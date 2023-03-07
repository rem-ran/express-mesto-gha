/* eslint-disable import/no-extraneous-dependencies */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  ERROR_CODE_400,
  ERROR_CODE_401,
  ERROR_CODE_404,
  ERROR_CODE_409,
  ERROR_CODE_500,
} = require('../utils/constants');

// контроллер получения имеющихся пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res
      .status(ERROR_CODE_500)
      .send({ message: 'Произошла ошибка получения пользователей' }));
};

// контроллер поиска пользователя по его id
module.exports.getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)

    .then((user) => {
      if (user === null) {
        return res
          .status(ERROR_CODE_404)
          .send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.send(user);
    })

    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(ERROR_CODE_400)
          .send({ message: '_id указан некорректно.' });
      }

      return res.status(ERROR_CODE_500).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

// контроллер создания нового пользователя
module.exports.createUser = (req, res) => {
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
        return res.status(ERROR_CODE_400).send({ message: err.message });
      }

      if (err.code === 11000) {
        return res.status(ERROR_CODE_409).send({ message: 'Пользователь с таким email уже существует' });
      }

      return res.status(ERROR_CODE_500).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

// контроллер обновления данных пользователя
module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true })
    .then(() => res.send(new User({ name, about })))

    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_400).send({ message: err.message });
      }

      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_404).send({
          message: 'Пользователь с указанным _id не найден.',
        });
      }

      return res.status(ERROR_CODE_500).send({
        message: 'На сервере произошла ошибка.',
      });
    });
};

// контроллер обновления аватара пользователя
module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true })
    .then(() => res.send(new User({ avatar })))

    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_400).send({
          message: 'Переданы некорректные данные при обновлении аватара.',
        });
      }

      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_404).send({
          message: 'Пользователь с указанным _id не найден.',
        });
      }

      return res.status(ERROR_CODE_500).send({
        message: 'На сервере произошла ошибка.',
      });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })

    .catch((err) => {
      // ошибка аутентификации
      res
        .status(ERROR_CODE_401)
        .send({ message: err.message });
    });
};
