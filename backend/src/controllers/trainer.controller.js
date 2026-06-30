const trainerService = require("../services/trainer.service");

const listCharacters = async (req, res, next) => {
  try {
    const characters = await trainerService.getCharacters(req.query);

    return res.status(200).json({ characters });
  } catch (error) {
    next(error);
  }
};

const listRandomCharacters = async (req, res, next) => {
  try {
    const characters = await trainerService.getRandomCharacters(req.query);

    return res.status(200).json({ characters });
  } catch (error) {
    next(error);
  }
};

const answerCharacter = async (req, res, next) => {
  try {
    const result = await trainerService.submitCharacterAnswer(
      req.user.id,
      req.params.id,
      req.body.answer,
    );

    return res
      .status(200)
      .json({ message: "Answer submitted successfully.", ...result });
  } catch (error) {
    next(error);
  }
};

const showTrainerProgress = async (req, res, next) => {
  try {
    const progress = await trainerService.getMyTrainerProgress(
      req.user.id,
      req.query,
    );

    return res.status(200).json({ progress });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listCharacters,
  listRandomCharacters,
  answerCharacter,
  showTrainerProgress,
};
