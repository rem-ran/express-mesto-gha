const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// импорт собственных ошибок
const NotFoundError = require('../errors/NotFoundError');
const SameEntryError = require('../errors/SameEntryError');
const WrongMailOrPassError = require('../errors/WrongMailOrPassError');


// контроллер получения имеющихся пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next)
};

// контроллер получания пользователя
module.exports.getUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => res.send(user))
    .catch(next)
};

// контроллер поиска пользователя по его id
module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)

    .then((user) => {

      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      }

      return res.send(user);
    })

    .catch(next)
};

// контроллер создания нового пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt
    .hash(password, 10)

    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))

    .then((user) => {
    user = user.toObject()
    delete user.password
    return res.send(user)
  })


    .catch((err) => {

      if (err.code === 11000) {
        return next(new SameEntryError('Пользователь с таким email уже существует'));
      }

      return next(err);
    });
};

// контроллер обновления данных пользователя
module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true })
    .then((user) => res.send(new User({ name, about, avatar: user.avatar })))

    .catch(next)
};

// контроллер обновления аватара пользователя
module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true })
    .then((user) => res.send(new User({name: user.name, about: user.about, avatar})))

    .catch(next)
};

// контроллер логина пользователя
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'someKey',
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          maxAge: 36000000,
          httpOnly: true,
          sameSite: true,
        })
        .send({message: 'Авторизация успешна'})
    })

    .catch((err) => next(new WrongMailOrPassError(err.message)))
};
