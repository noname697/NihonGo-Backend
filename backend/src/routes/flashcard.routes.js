const express = require("express");

const flashcardController = require("../controllers/flashcard.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");

const {
  idParamSchema,
  createDeckSchema,
  updateDeckSchema,
  createCardSchema,
  updateCardSchema,
  dueCardsSchema,
  reviewCardSchema,
} = require("../validators/flashcard.validator");

const router = express.Router();

router.use(authMiddleware);

router.post(
  "/decks",
  validate(createDeckSchema),
  flashcardController.createDeck,
);
router.get("/decks", flashcardController.listDecks);
router.get("/decks/:id", validate(idParamSchema), flashcardController.showDeck);
router.put(
  "/decks/:id",
  validate(updateDeckSchema),
  flashcardController.updateDeck,
);
router.delete(
  "/decks/:id",
  validate(idParamSchema),
  flashcardController.deleteDeck,
);

router.post(
  "/decks/:deckId/cards",
  validate(createCardSchema),
  flashcardController.createCard,
);
router.put(
  "/cards/:id",
  validate(updateCardSchema),
  flashcardController.updateCard,
);
router.delete(
  "/cards/:id",
  validate(idParamSchema),
  flashcardController.deleteCard,
);

router.get("/due", validate(dueCardsSchema), flashcardController.listDueCards);
router.post(
  "/cards/:id/review",
  validate(reviewCardSchema),
  flashcardController.reviewCard,
);
router.get("/progress", flashcardController.showReviewProgress);

module.exports = router;
