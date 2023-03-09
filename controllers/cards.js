const Card = require('../models/card');

// импорт собственных ошибок
const NotFoundError = require('../errors/NotFoundError');
const NotValidError = require('../errors/NotValidError');
const NoRightsError = require('../errors/NoRightsError');


// контроллер получения имеющихся карточек
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next)
};

// контроллер создания новой карточки
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch(next)
};

// контроллер удаления карточеки
module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;

  Card.findById(cardId)

  .then((card) => {

    if (!card) {
      throw new NotFoundError('Карточка по указанному _id не найдена.');
    }

    if (card.owner == _id) {
      return Card.findByIdAndRemove(cardId)
        .then(() => res.send({ message: 'Карточка удалена.' }))

        .catch(next)

    } throw new NoRightsError('Нельзя удалять чужие карточки.');
  })

  .catch((err) => {

    if (err.name === 'CastError') {
      return next(new NotValidError('Указан некорректный id карточки.'))
    }

    next(err);
  });
  }

// контроллер постановки лайка карточке
module.exports.putCardLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $addToSet: { likes: req.user._id },
    },
    { new: true },
  )

    .then((card) => {

      if (!card) {
        throw new NotFoundError('Карточка по указанному _id не найдена.');
      }

      return res.send({ message: 'Лайк успешно поставлен' });
    })

    .catch((err) => {

      if (err.name === 'CastError') {
        return next(new NotValidError('Указан некорректный id карточки.'))
      }

      next(err);
    });
};

// контроллер удаления лайка у карточки
module.exports.deleteCardLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )

    .then((card) => {

      if (!card) {
        throw new NotFoundError('Карточка по указанному _id не найдена.');
      }

      return res.send({ message: 'Лайк успешно удалён' });
    })

    .catch((err) => {

      if (err.name === 'CastError') {
        return next(new NotValidError('Указан некорректный id карточки.'))
      }

      next(err);
    });
};
