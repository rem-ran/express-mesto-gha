const Card = require("../models/card");

//получение имеющихся карточек
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() =>
      res.status(500).send({ message: "Произошла ошибка получения карточки" })
    );
};

//создание новой карточки
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  let owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch(() =>
      res.status(500).send({ message: "Произошла ошибка создания карточки" })
    );
};

//удаление карточек
module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .then((card) => res.send(card))
    .catch(() =>
      res.status(500).send({ message: "Произошла ошибка удаления карточки" })
    );
};
