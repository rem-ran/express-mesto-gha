const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// импорт собственных ошибок
const NotFoundError = require('../errors/NotFoundError');
const NotValidError = require('../errors/NotValidError');
const SameEntryError = require('../errors/SameEntryError');
const ValidationError = require('../errors/ValidationError');
const WrongMailOrPassError = require('../errors/WrongMailOrPassError');


// контроллер получения имеющихся пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next)
    // .catch(() => res
    //   .status(ERROR_CODE_500)
    //   .send({ message: 'Произошла ошибка получения пользователей' }));
};

// контроллер получания пользователя
module.exports.getUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => res.send(user))
    .catch(next)
    // .catch(() => res
    //   .status(ERROR_CODE_500)
    //   .send({ message: 'Произошла ошибка получения пользователя' }));
};

// контроллер поиска пользователя по его id
module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)

    .then((user) => {

      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      }

      // if (!user) {
        // return res
        //   .status(ERROR_CODE_404)
        //   .send({ message: 'Пользователь по указанному _id не найден.' });
      // }

      return res.send(user);
    })

    .catch((err) => {

      if (err.name === 'CastError') {
        return next(new NotValidError('_id указан некорректно.'))
      }

      // if (err.name === 'CastError') {
        // return res
        //   .status(ERROR_CODE_400)
        //   .send({ message: '_id указан некорректно.' });
      // }

      // return next(new ServerError('На сервере произошла ошибка.'))

      // return res.status(ERROR_CODE_500).send({
      //   message: 'На сервере произошла ошибка',
      // });

      return next(err);

    })
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
    .then((user) => res.send(user))
    .catch((err) => {

      if (err.name === 'ValidationError') {
        return next(new ValidationError(err.message));
      }

      // if (err.name === 'ValidationError') {
      //   return res.status(ERROR_CODE_400).send({ message: err.message });
      // }

      if (err.code === 11000) {
        return next(new SameEntryError('Пользователь с таким email уже существует'));
      }

      // if (err.code === 11000) {
      //   return res.status(ERROR_CODE_409).send({ message: 'Пользователь с таким email уже существует' });
      // }

      // return res.status(ERROR_CODE_500).send({
      //   message: 'На сервере произошла ошибка',
      // });

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

      // if (err.name === 'ValidationError') {
      //   return res.status(ERROR_CODE_400).send({ message: err.message });
      // }

      // if (err.name === 'CastError') {
      //   return next(new NotValidError('Пользователь с указанным _id не найден.'))
      // }

      // if (err.name === 'CastError') {
      //   return res.status(ERROR_CODE_404).send({
      //     message: 'Пользователь с указанным _id не найден.',
      //   });
      // }

      // return res.status(ERROR_CODE_500).send({
      //   message: 'На сервере произошла ошибка.',
      // });

      return next(err);
    });
};

// контроллер обновления аватара пользователя
module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true })
    .then((user) => res.send(new User({name: user.name, about: user.about, avatar})))

    .catch((err) => {

      if (err.name === 'ValidationError') {
        return next(new ValidationError(err.message));
      }

      // if (err.name === 'ValidationError') {
      //   return res.status(ERROR_CODE_400).send({
      //     message: 'Переданы некорректные данные при обновлении аватара.',
      //   });
      // }

      // if (err.name === 'CastError') {
      //   return res.status(ERROR_CODE_404).send({
      //     message: 'Пользователь с указанным _id не найден.',
      //   });
      // }

      // return res.status(ERROR_CODE_500).send({
      //   message: 'На сервере произошла ошибка.',
      // });

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
        .end();
    })

    .catch((err) => next(new WrongMailOrPassError(err.message)))

    // .catch((err) => {
    //   res
    //     .status(ERROR_CODE_401)
    //     .send({ message: err.message });
    // });
};
