const router = require("express").Router();

const {
  getCards,
  createCard,
  deleteCard,
  putCardLike,
  deleteCardLike,
} = require("../controllers/cards");

//рутер получения имеющихся карточек
router.get("/", getCards);

//рутер создания новой карточки
router.post("/", createCard);

//рутер удаления карточеки
router.delete("/:cardId", deleteCard);

//рутер постановки лайка карточке
router.put("/:cardId/likes", putCardLike);

//рутер удаления лайка у карточки
router.delete("/:cardId/likes", deleteCardLike);

module.exports = router;
