const flashcardService = require("../services/flashcard.service");

const createDeck = async (req, res, next) => {
  try {
    const deck = await flashcardService.createDeck(req.user.id, req.body);

    return res
      .status(201)
      .json({ message: "Deck created successfully.", deck });
  } catch (error) {
    next(error);
  }
};

const listDecks = async (req, res, next) => {
  try {
    const decks = await flashcardService.getMyDecks(req.user.id);

    return res.status(200).json({ decks });
  } catch (error) {
    next(error);
  }
};

const showDeck = async (req, res, next) => {
  try {
    const deck = await flashcardService.getDeckById(req.user.id, req.params.id);

    return res.status(200).json({ deck });
  } catch (error) {
    next(error);
  }
};

const updateDeck = async (req, res, next) => {
  try {
    const deck = await flashcardService.updateDeck(
      req.user.id,
      req.params.id,
      req.body,
    );

    return res
      .status(200)
      .json({ message: "Flashcard deck updated successfully.", deck });
  } catch (error) {
    next(error);
  }
};

const deleteDeck = async (req, res, next) => {
  try {
    const result = await flashcardService.deleteDeck(
      req.user.id,
      req.params.id,
    );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const createCard = async (req, res, next) => {
  try {
    const card = await flashcardService.createCard(
      req.user.id,
      req.params.deckId,
      req.body,
    );

    return res
      .status(201)
      .json({ message: "Flashcard created successfully.", card });
  } catch (error) {
    next(error);
  }
};

const updateCard = async (req, res, next) => {
  try {
    const card = await flashcardService.updateCard(
      req.user.id,
      req.params.id,
      req.body,
    );

    return res
      .status(200)
      .json({ message: "Flashcard updated successfully.", card });
  } catch (error) {
    next(error);
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const result = await flashcardService.deleteCard(
      req.user.id,
      req.params.id,
    );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const listDueCards = async (req, res, next) => {
  try {
    const cards = await flashcardService.getDueCards(req.user.id, req.query);

    return res.status(200).json({ cards });
  } catch (error) {
    next(error);
  }
};

const reviewCard = async (req, res, next) => {
  try {
    const result = await flashcardService.reviewCard(
      req.user.id,
      req.params.id,
      req.body.is_correct,
    );

    return res
      .status(200)
      .json({ message: "Flashcard reviewed successfully.", ...result });
  } catch (error) {
    next(error);
  }
};

const showReviewProgress = async (req, res, next) => {
  try {
    const progress = await flashcardService.getReviewProgress(req.user.id);

    return res.status(200).json(progress);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDeck,
  listDecks,
  showDeck,
  updateDeck,
  deleteDeck,
  createCard,
  updateCard,
  deleteCard,
  listDueCards,
  reviewCard,
  showReviewProgress,
};
