const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUser,
  getUserById,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

// рутер получение имеющихся пользователей
router.get('/', getUsers);

// рутер получения своего пользователя
router.get('/me', getUser);

// рутер поиска пользователя по его id
router.get('/:userId', celebrate({

  params: Joi.object().keys({
    userId: Joi.string().alphanum(),
  }),

  }), getUserById);

// рутер обновление данных пользователя
router.patch('/me', celebrate({

body: Joi.object().keys({
  name: Joi.string().min(2).max(30),
  about: Joi.string().min(2).max(30),
}),

}), updateUser);

// рутер обновление аватара пользователя
router.patch('/me/avatar', celebrate({

  body: Joi.object().keys({
    avatar: Joi.string().regex(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/),
  }),

  }), updateUserAvatar);

module.exports = router;
