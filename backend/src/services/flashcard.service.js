const { Op, where } = require("sequelize");

const {
  sequelize,
  FlashcardDeck,
  Flashcard,
  FlashcardReview,
} = require("../../models");

const createError = require("../utils/createError");

const calculateMasteryScore = (correctAttempts, wrongAttempts) => {
  const total = correctAttempts + wrongAttempts;

  if (total === 0) return 0;

  return Number(((correctAttempts / total) * 100).toFixed(2));
};

const getNextDueData = (isCorrect, reviewCount) => {
  const now = new Date();

  let daysToAdd;

  if (!isCorrect) {
    daysToAdd = 1;
  } else if (reviewCount <= 1) {
    daysToAdd = 1;
  } else if (reviewCount === 2) {
    daysToAdd = 3;
  } else if (reviewCount === 3) {
    daysToAdd = 7;
  } else {
    daysToAdd = 14;
  }

  now.setDate(now.getDate() + daysToAdd);

  return now;
};

const ensureDeckOwner = async (userId, deckId) => {
  const deck = await FlashcardDeck.findOne({
    where: {
      id: deckId,
      user_id: userId,
    },
  });

  if (!deck) {
    throw createError("Flashcard deck not found.", 404);
  }

  return deck;
};

const createDeck = async (userId, data) => {
  const { title, description, is_public } = data;

  if (!title || !title.trim()) {
    throw createError("Deck title is required.", 400);
  }

  const deck = await FlashcardDeck.create({
    user_id: userId,
    title,
    description: description || null,
    is_public: Boolean(is_public),
  });

  return deck;
};

const getMyDecks = async (userId) => {
  const decks = await FlashcardDeck.findAll({
    where: {
      user_id: userId,
    },
    attributes: [
      "id",
      "title",
      "description",
      "is_public",
      "createdAt",
      "updatedAt",
    ],
    include: [
      {
        model: Flashcard,
        as: "cards",
        attributes: ["id"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  return decks.map((deck) => {
    const plainDeck = deck.get({ plain: true });

    return {
      id: plainDeck.id,
      title: plainDeck.title,
      description: plainDeck.description,
      is_public: plainDeck.is_public,
      cards_count: plainDeck.cards.length,
      createdAt: plainDeck.createdAt,
      updatedAt: plainDeck.updatedAt,
    };
  });
};

const getDeckById = async (userId, deckId) => {
  const deck = await FlashcardDeck.findOne({
    where: {
      id: deckId,
      user_id: userId,
    },
    attributes: [
      "id",
      "title",
      "description",
      "is_public",
      "createdAt",
      "updatedAt",
    ],
    include: [
      {
        model: Flashcard,
        as: "cards",
        attributes: [
          "id",
          "front_text",
          "back_text",
          "example_sentence",
          "notes",
          "position",
          "createdAt",
          "updatedAt",
        ],
      },
    ],
    order: [[{ model: Flashcard, as: "cards" }, "position", "ASC"]],
  });

  if (!deck) {
    throw createError("Flashcard deck not found.", 404);
  }

  return deck;
};

const updateDeck = async (userId, deckId, data) => {
  const deck = await ensureDeckOwner(userId, deckId);

  const { title, description, is_public } = data;

  if (title !== undefined && !title.trim()) {
    throw createError("Deck title cannot be empty", 400);
  }

  await FlashcardDeck.update({
    title: title ?? deck.title,
    description: description ?? deck.description,
    is_public: is_public !== undefined ? Boolean(is_public) : deck.is_public,
  });

  return deck;
};

const deleteDeck = async (userId, deckId) => {
  const deck = await ensureDeckOwner(userId, deckId);

  await deck.destroy();

  return {
    message: "Flashcard deck deleted successfully.",
  };
};

const createCard = async (userId, deckId, data) => {
  await ensureDeckOwner(userId, deckId);

  const { front_text, back_text, example_sentence, notes } = data;

  if (!front_text || !front_text.trim()) {
    throw createError("Front text is required.", 400);
  }

  if (!back_text || !back_text.trim()) {
    throw createError("Back text is required.", 400);
  }

  const cardsCount = await Flashcard.count({
    where: {
      deck_id: deckId,
    },
  });

  const card = await Flashcard.create({
    deck_id: deckId,
    front_text,
    back_text,
    example_sentence: example_sentence || null,
    notes: notes || null,
    position: cardsCount + 1,
  });

  return card;
};

const updateCard = async (userId, cardId, data) => {
  const card = await Flashcard.findByPk(cardId, {
    include: [
      {
        model: FlashcardDeck,
        as: "deck",
        attributes: ["id", "user_id"],
      },
    ],
  });

  if (!card || card.deck.user_id !== userId) {
    throw createError("Flashcard not found.", 404);
  }

  const { front_text, back_text, example_sentence, notes, position } = data;

  if (front_text !== undefined && !front_text.trim()) {
    throw createError("Front text cannot be empty", 400);
  }
  if (back_text !== undefined && !back_text.trim()) {
    throw createError("Back text cannot be empty", 400);
  }

  await card.update({
    front_text: front_text ?? card.front_text,
    back_text: back_text ?? card.back_text,
    example_sentence: example_sentence ?? card.example_sentence,
    notes: notes ?? card.notes,
    position: position ?? card.position,
  });

  return card;
};

const deleteCard = async (userId, cardId) => {
  const card = await Flashcard.findByPk(cardId, {
    include: [
      {
        model: FlashcardDeck,
        as: "deck",
        attributes: ["id", "user_id"],
      },
    ],
  });

  if (!card || card.deck.user_id !== userId) {
    throw createError("Flashcard not found.", 404);
  }

  await card.destroy();

  return {
    message: "Flashcard deleted successfully.",
  };
};

const getDueCards = async (userId, options = {}) => {
  const now = new Date();

  const deckId = options.deck_id;
  const limit = Math.min(Number(options.limit) || 20, 100);

  const deckWhere = {
    user_id: userId,
  };

  if (deckId) {
    await ensureDeckOwner(userId, deckId);
    deckWhere.id = deckId;
  }

  const cards = await Flashcard.findAll({
    attributes: [
      "id",
      "deck_id",
      "front_text",
      "back_text",
      "example_sentence",
      "notes",
      "position",
    ],
    include: [
      {
        model: FlashcardDeck,
        as: "deck",
        attributes: ["id", "title"],
        where: deckWhere,
      },
      {
        model: FlashcardReview,
        as: "reviews",
        attributes: [
          "id",
          "correct_attempts",
          "wrong_attempts",
          "review_count",
          "mastery_score",
          "due_date",
          "last_reviewed_at",
        ],
        where: {
          user_id: userId,
        },
        required: false,
        duplicating: false,
      },
    ],
    where: {
      [Op.or]: [
        {
          "$reviews.id$": null,
        },
        {
          "$reviews.due_date$": {
            [Op.lte]: now,
          },
        },
      ],
    },
    order: [
      [{ model: FlashcardDeck, as: "deck" }, "id", "ASC"],
      ["position", "ASC"],
    ],
    limit,
    subQuery: false,
  });

  return cards.map((card) => {
    const plainCard = card.get({ plain: true });
    const review = plainCard.reviews?.[0] || null;

    return {
      id: plainCard.id,
      deck_id: plainCard.deck_id,
      deck: plainCard.deck,
      front_text: plainCard.front_text,
      back_text: plainCard.back_text,
      example_sentence: plainCard.example_sentence,
      notes: plainCard.notes,
      position: plainCard.position,
      review: review
        ? {
            id: review.id,
            correct_attempts: review.correct_attempts,
            wrong_attempts: review.wrong_attempts,
            review_count: review.review_count,
            mastery_score: review.mastery_score,
            due_date: review.due_date,
            last_reviewed_at: review.last_reviewed_at,
            status: "due",
          }
        : {
            id: null,
            correct_attempts: 0,
            wrong_attempts: 0,
            review_count: 0,
            mastery_score: 0,
            due_date: now,
            last_reviewed_at: null,
            status: "new",
          },
    };
  });
};

const reviewCard = async (userId, cardId, isCorrect) => {
  if (typeof isCorrect !== "boolean") {
    throw createError("is_correct must be a boolean value.", 400);
  }

  const result = await sequelize.transaction(async (transaction) => {
    const card = await Flashcard.findByPk(cardId, {
      include: [
        {
          model: FlashcardDeck,
          as: "deck",
          attributes: ["id", "title", "user_id"],
        },
      ],
      transaction,
    });

    if (!card || card.deck.user_id !== userId) {
      throw createError("Flashcard not found.", 404);
    }

    const now = new Date();

    const [review] = await FlashcardReview.findOrCreate({
      where: {
        user_id: userId,
        flashcard_id: cardId,
      },
      defaults: {
        user_id: userId,
        flashcard_id: cardId,
        correct_attempts: 0,
        wrong_attempts: 0,
        review_count: 0,
        mastery_score: 0,
        due_date: now,
        last_reviewed_at: null,
      },
      transaction,
    });

    const correctAttempts = review.correct_attempts + (isCorrect ? 1 : 0);
    const wrongAttempts = review.wrong_attempts + (isCorrect ? 0 : 1);
    const reviewCount = review.review_count + 1;
    const masteryScore = calculateMasteryScore(correctAttempts, wrongAttempts);
    const dueDate = getNextDueData(isCorrect, reviewCount);

    await review.update(
      {
        correct_attempts: correctAttempts,
        wrong_attempts: wrongAttempts,
        review_count: reviewCount,
        mastery_score: masteryScore,
        due_date: dueDate,
        last_reviewed_at: now,
      },
      { transaction },
    );

    return {
      flashcard: {
        id: card.id,
        deck_id: card.deck_id,
        front_text: card.front_text,
        back_text: card.back_text,
        example_sentence: card.example_sentence,
        notes: card.notes,
      },
      review: {
        is_correct: isCorrect,
        correct_attempts: correctAttempts,
        wrong_attempts: wrongAttempts,
        review_count: reviewCount,
        mastery_score: masteryScore,
        due_date: dueDate,
        last_reviewed_at: now,
      },
    };
  });

  return result;
};

const getReviewProgress = async (userId) => {
  const reviews = await FlashcardReview.findAll({
    where: {
      user_id: userId,
    },
    attributes: [
      "flashcard_id",
      "correct_attempts",
      "wrong_attempts",
      "review_count",
      "mastery_score",
      "due_date",
      "last_reviewed_at",
    ],
    include: [
      {
        model: Flashcard,
        as: "flashcard",
        attributes: ["id", "front_text", "back_text", "deck_id"],
        include: [
          {
            model: FlashcardDeck,
            as: "deck",
            attributes: ["id", "title"],
          },
        ],
      },
    ],
    order: [["due_date", "ASC"]],
  });

  return reviews;
};

module.exports = {
  createDeck,
  getMyDecks,
  getDeckById,
  updateDeck,
  deleteDeck,
  createCard,
  updateCard,
  deleteCard,
  getDueCards,
  reviewCard,
  getReviewProgress,
};
