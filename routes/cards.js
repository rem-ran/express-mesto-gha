const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { regexUrl } = require('../utils/regexUrl');

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
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(regexUrl),
  }),

}), createCard);

// рутер удаления карточки
router.delete('/:cardId', celebrate({

  params: Joi.object().keys({
    cardId: Joi.string().alphanum().hex().length(24),
  }),

}), deleteCard);

// рутер постановки лайка карточке
router.put('/:cardId/likes', celebrate({

  params: Joi.object().keys({
    cardId: Joi.string().alphanum().hex().length(24),
  }),

}), putCardLike);

// рутер удаления лайка у карточки
router.delete('/:cardId/likes', celebrate({

  params: Joi.object().keys({
    cardId: Joi.string().alphanum().hex().length(24),
  }),

}), deleteCardLike);

module.exports = router;
