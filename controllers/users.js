const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// импорт собственных ошибок
const NotFoundError = require('../errors/NotFoundError');
const SameEntryError = require('../errors/SameEntryError');
const ValidationError = require('../errors/ValidationError');

// контроллер получения имеющихся пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

// контроллер получания пользователя
module.exports.getUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => res.send(user))
    .catch(next);
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

    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new NotFoundError('_id указан некорректно.'));
      }

      return next(err);
    });
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

    .then(() => {
      res.send(new User({
        name, about, avatar, email,
      }));
    })

    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError(err.message));
      }

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

    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError(err.message));
      }

      return next(err);
    });
};

// контроллер обновления аватара пользователя
module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true })
    .then((user) => res.send(new User({ name: user.name, about: user.about, avatar })))

    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError(err.message));
      }

      return next(err);
    });
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
        .send({ message: 'Авторизация успешна' });
    })

    .catch(next);
};
