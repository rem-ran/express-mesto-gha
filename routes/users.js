const router = require('express').Router();

const {
  getUsers,
  getUser,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

// рутер получение имеющихся пользователей
router.get('/', getUsers);

// рутер поиск пользователя по его id
router.get('/:userId', getUser);

// рутер обновление данных пользователя
router.patch('/me', updateUser);

// рутер обновление аватара пользователя
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
