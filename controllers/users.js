const User = require("../models/user");

//получение имеющихся пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() =>
      res
        .status(500)
        .send({ message: "Произошла ошибка получения пользователей" })
    );
};

//поиск пользователя по его id
module.exports.getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => res.send(user))
    .catch(() =>
      res
        .status(500)
        .send({ message: "Произошла ошибка получения пользователя" })
    );
};

//создание нового пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch(() =>
      res
        .status(500)
        .send({ message: "Произошла ошибка создания пользователя" })
    );
};

//обновление данных пользователя
// module.exports.updateUser = (req, res) => {
//   res.status(200).send({ message: "me. to be continued " });
//   // User.findByIdAndUpdate()
//   //   .then((user) => {
//   //     res.send({ data: user });
//   //   })
//   //   .catch(() =>
//   //     res
//   //       .status(500)
//   //       .send({ message: "Произошла ошибка обновления пользователя" })
//   //   );
// };

//обновление аватара пользователя
// module.exports.updateUserAvatar = (req, res) => {
//   res.status(200).send({ message: "me / avatar. to be continued" });
//   // User.findByIdAndUpdate()
//   //   .then((user) => {
//   //     res.send({ data: user });
//   //   })
//   //   .catch(() =>
//   //     res
//   //       .status(500)
//   //       .send({ message: "Произошла ошибка обновления аватара пользователя" })
//   //   );
// };
