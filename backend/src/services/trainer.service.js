const { Op } = require("sequelize");

const {
  sequelize,
  StudyCharacter,
  UserCharacterProgress,
} = require("../../models");

const createError = require("../utils/createError");

const normalizeAnswer = (answer) => {
  return String(answer || "")
    .trim()
    .toLowerCase();
};

const buildCharactersWhere = (query) => {
  const where = {};

  if (query.type) where.type = query.type;
  if (query.jlpt_level) where.jlpt_level = query.jlpt_level;
  if (query.character_group) where.character_group = query.character_group;

  return where;
};

const checkCharacterAnswer = (character, answer) => {
  const normalizedAnswer = normalizeAnswer(answer);

  const validAnswers = [
    character.romaji,
    character.meaning,
    character.onyomi,
    character.kunyomi,
  ]
    .filter(Boolean)
    .flatMap((value) => {
      return String(value)
        .split(",")
        .map((item) => normalizeAnswer(item));
    });

  return validAnswers.includes(normalizedAnswer);
};

const calculateMasteryScore = (correctAttempts, wrongAttempts) => {
  const totalAttempts = correctAttempts + wrongAttempts;

  if (totalAttempts === 0) {
    return 0;
  }

  return Number(((correctAttempts / totalAttempts) * 100).toFixed(2));
};

const getCharacters = async (query) => {
  const where = buildCharactersWhere(query);

  const characters = await StudyCharacter.findAll({
    where,
    attributes: [
      "id",
      "type",
      "symbol",
      "romaji",
      "meaning",
      "onyomi",
      "kunyomi",
      "jlpt_level",
      "stroke_count",
      "character_group",
      "position",
    ],
    order: [
      ["type", "ASC"],
      ["position", "ASC"],
    ],
  });

  return characters;
};

const getRandomCharacters = async (query) => {
  const where = buildCharactersWhere(query);

  const limit = Math.min(Number(query.limit) || 10, 50);

  const characters = await StudyCharacter.findAll({
    where,
    attributes: [
      "id",
      "type",
      "symbol",
      "romaji",
      "meaning",
      "onyomi",
      "kunyomi",
      "jlpt_level",
      "stroke_count",
      "character_group",
      "position",
    ],
    order: sequelize.random(),
    limit,
  });

  return characters;
};

const submitCharacterAnswer = async (userId, characterId, answer) => {
  if (typeof answer !== "string" || !answer.trim()) {
    throw createError("Answer must be a non-empty", 400);
  }

  const result = await sequelize.transaction(async (transaction) => {
    const character = await StudyCharacter.findByPk(characterId, {
      transaction,
    });

    if (!character) {
      throw createError("Character not found", 404);
    }

    const isCorrect = checkCharacterAnswer(character, answer);

    const [progress] = await UserCharacterProgress.findOrCreate({
      where: {
        user_id: userId,
        character_id: characterId,
      },
      defaults: {
        user_id: userId,
        character_id: characterId,
        correct_attempts: 0,
        wrong_attempts: 0,
        mastery_score: 0,
      },
      transaction,
    });

    const correctAttempts = progress.correct_attempts + (isCorrect ? 1 : 0);
    const wrongAttempts = progress.wrong_attempts + (isCorrect ? 0 : 1);
    const masteryScore = calculateMasteryScore(correctAttempts, wrongAttempts);

    const now = new Date();

    await progress.update(
      {
        correct_attempts: correctAttempts,
        wrong_attempts: wrongAttempts,
        last_answer: answer,
        last_result: isCorrect,
        mastery_score: masteryScore,
        last_practiced_at: now,
      },
      { transaction },
    );

    return {
      character: {
        id: character.id,
        type: character.type,
        symbol: character.symbol,
        romaji: character.romaji,
        meaning: character.meaning,
        onyomi: character.onyomi,
        kunyomi: character.kunyomi,
        jlpt_level: character.jlpt_level,
      },
      result: {
        submitted_answer: answer,
        is_correct: isCorrect,
        correct_answers: {
          romaji: character.romaji,
          meaning: character.meaning,
          onyomi: character.onyomi,
          kunyomi: character.kunyomi,
        },
      },
      progress: {
        correct_attempts: correctAttempts,
        wrong_attempts: wrongAttempts,
        mastery_score: masteryScore,
        last_practiced_at: now,
      },
    };
  });

  return result;
};

const getMyTrainerProgress = async (userId, query) => {
  const characterWhere = buildCharactersWhere(query);

  const progress = await UserCharacterProgress.findAll({
    where: {
      user_id: userId,
    },
    attributes: [
      "character_id",
      "correct_attempts",
      "wrong_attempts",
      "last_answer",
      "last_result",
      "mastery_score",
      "last_practiced_at",
    ],
    include: [
      {
        model: StudyCharacter,
        as: "character",
        attributes: [
          "id",
          "type",
          "symbol",
          "romaji",
          "meaning",
          "onyomi",
          "kunyomi",
          "jlpt_level",
          "character_group",
          "position",
        ],
        where: characterWhere,
      },
    ],
    order: [[{ model: StudyCharacter, as: "character" }, "position", "ASC"]],
  });

  return progress;
};

module.exports = {
  getCharacters,
  getRandomCharacters,
  submitCharacterAnswer,
  getMyTrainerProgress,
};
