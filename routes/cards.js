const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards,
  createCard,
  deleteCard,
  putCardLike,
  deleteCardLike,
} = require('../controllers/cards');

// рутер получения имеющихся карточек
router.get('/', getCards);

// рутер создания новой карточки
router.post('/', celebrate({

  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string(),
  }),

  }), createCard);

// рутер удаления карточеки
router.delete('/:cardId', celebrate({

  params: Joi.object().keys({
    cardId: Joi.string().alphanum(),
  }),

  }), deleteCard);

// рутер постановки лайка карточке
router.put('/:cardId/likes', celebrate({

  params: Joi.object().keys({
    cardId: Joi.string().alphanum(),
  }),

  }), putCardLike);

// рутер удаления лайка у карточки
router.delete('/:cardId/likes', celebrate({

  params: Joi.object().keys({
    cardId: Joi.string().alphanum(),
  }),

  }), deleteCardLike);

module.exports = router;
