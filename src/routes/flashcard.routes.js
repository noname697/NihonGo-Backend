const express = require("express");

const flashcardController = require("../controllers/flashcard.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/decks", flashcardController.createDeck);
router.get("/decks", flashcardController.listDecks);
router.get("/decks/:id", flashcardController.showDeck);
router.put("/decks/:id", flashcardController.updateDeck);
router.delete("/decks/:id", flashcardController.deleteDeck);

router.post("/decks/:deckId/cards", flashcardController.createCard);
router.put("/cards/:id", flashcardController.updateCard);
router.delete("/cards/:id", flashcardController.deleteCard);

router.get("/due", flashcardController.listDueCards);
router.post("/cards/:id/review", flashcardController.reviewCard);
router.get("/progress", flashcardController.showReviewProgress);

module.exports = router;
