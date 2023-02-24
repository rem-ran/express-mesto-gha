const User = require("../models/user");

//Статусы ошибок вынесены в константы согласно ТЗ
const ERROR_CODE_400 = 400;
const ERROR_CODE_404 = 404;
const ERROR_CODE_500 = 500;

//контроллер получения имеющихся пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() =>
      res
        .status(ERROR_CODE_500)
        .send({ message: "Произошла ошибка получения пользователей" })
    );
};

//контроллер поиска пользователя по его id
module.exports.getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)

    .then((user) => {
      if (user === null) {
        return res
          .status(ERROR_CODE_404)
          .send({ message: "Пользователь по указанному _id не найден." });
      } else {
        res.send(user);
      }
    })

    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(ERROR_CODE_400)
          .send({ message: "_id указан некорректно." });
      }

      return res.status(ERROR_CODE_500).send({
        message: "На сервере произошла ошибка",
      });
    });
};

//контроллер создания нового пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(ERROR_CODE_400).send({
          message: "Переданы некорректные данные при создании пользователя.",
        });
      }

      return res.status(ERROR_CODE_500).send({
        message: "На сервере произошла ошибка",
      });
    });
};

//контроллер обновления данных пользователя
module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true })
    .then(() => res.send({ name, about }))

    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(ERROR_CODE_400).send({
          message: "Переданы некорректные данные при обновлении пользователя.",
        });
      }

      if (err.name === "CastError") {
        return res.status(ERROR_CODE_404).send({
          message: "Пользователь с указанным _id не найден.",
        });
      }

      return res.status(ERROR_CODE_500).send({
        message: `На сервере произошла ошибка.`,
      });
    });
};

//контроллер обновления аватара пользователя
module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true })
    .then(() => res.send({ avatar }))

    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(ERROR_CODE_400).send({
          message: "Переданы некорректные данные при обновлении аватара.",
        });
      }

      if (err.name === "CastError") {
        return res.status(ERROR_CODE_404).send({
          message: "Пользователь с указанным _id не найден.",
        });
      }

      return res.status(ERROR_CODE_500).send({
        message: `На сервере произошла ошибка.`,
      });
    });
};
