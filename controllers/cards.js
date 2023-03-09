const Card = require('../models/card');
const {
  ERROR_CODE_400,
  ERROR_CODE_403,
  ERROR_CODE_404,
  ERROR_CODE_500,
} = require('../utils/constants');

// контроллер получения имеющихся карточек
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res
      .status(ERROR_CODE_500)
      .send({ message: 'Произошла ошибка получения карточек' }));
};

// контроллер создания новой карточки
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_400).send({ message: err.message });
      }

      return res.status(ERROR_CODE_500).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

// контроллер удаления карточеки
module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  const { _id } = req.user;

  Card.findById(cardId)

  .then((card) => {
    if (card === null) {
      return res
        .status(ERROR_CODE_400)
        .send({ message: 'Карточка по указанному _id не найдена.' });
    }

    if (card.owner == _id) {
      return Card.findByIdAndRemove(cardId)
        .then(() => res.send({ message: 'Карточка удалена' }))

        .catch((err) => res
          .status(ERROR_CODE_500)
          .send({message: 'На сервере произошла ошибка.'}));

    } return res.status(ERROR_CODE_403).send({ message: 'Нельзя удалять чужие карточки' })
  })

  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(ERROR_CODE_404).send({
        message: 'Указан некорректный id карточки',
      });
    }

    return res.status(ERROR_CODE_500).send({
      message: 'На сервере произошла ошибка.',
    });

  });

  }

// контроллер постановки лайка карточке
module.exports.putCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $addToSet: { likes: req.user._id },
    },
    { new: true },
  )

    .then((card) => {
      if (card === null) {
        return res
          .status(ERROR_CODE_404)
          .send({ message: 'Карточка по указанному _id не найдена.' });
      }
      return res.send({ message: 'Лайк успешно поставлен' });
    })

    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_400).send({
          message: 'Указан некорректный id карточки',
        });
      }

      return res.status(ERROR_CODE_500).send({
        message: 'На сервере произошла ошибка.',
      });
    });
};

// контроллер удаления лайка у карточки
module.exports.deleteCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )

    .then((card) => {
      if (card === null) {
        return res
          .status(ERROR_CODE_404)
          .send({ message: 'Карточка по указанному _id не найдена.' });
      }
      return res.send({ message: 'Лайк успешно удалён' });
    })

    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_400).send({
          message: 'Указан некорректный id карточки',
        });
      }

      return res.status(ERROR_CODE_500).send({
        message: 'На сервере произошла ошибка.',
      });
    });
};
