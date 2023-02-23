const router = require("express").Router();

const {
  getUsers,
  getUser,
  createUser,
  // updateUser,
  // updateUserAvatar,
} = require("../controllers/users");

//получение имеющихся пользователей
router.get("/", getUsers);

//поиск пользователя по его id
router.get("/:userId", getUser);

//создание нового пользователя
router.post("/", createUser);

// обновление данных пользователя
// router.patch("/me", updateUser);

//обновление аватара пользователя
// router.patch("/me/avatar", updateUserAvatar);

module.exports = router;
