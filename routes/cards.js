const router = require("express").Router();

const {
  getCards,
  createCard,
  deleteCard,
  // putCardLike,
  // deleteCardLike,
} = require("../controllers/cards");

//получение имеющихся карточек
router.get("/", getCards);

//создание новой карточки
router.post("/", createCard);

router.delete("/:cardId", deleteCard);

// // router.put("/:cardId/likes", putCardLike);

// // router.delete("/:cardId/likes", deleteCardLike);

module.exports = router;
