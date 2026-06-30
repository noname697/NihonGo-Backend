const progressService = require("../services/progress.service");

const answerExercise = async (req, res, next) => {
  try {
    const result = await progressService.submitExerciseAnswer(
      req.user.id,
      req.params.id,
      req.body.answer,
    );

    return res.status(200).json({
      message: "Answer submitted successfully",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

const showLessonProgress = async (req, res, next) => {
  try {
    const result = await progressService.getMyLessonProgress(
      req.user.id,
      req.params.id,
    );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const showModuleProgress = async (req, res, next) => {
  try {
    const result = await progressService.getMyModuleProgress(
      req.user.id,
      req.params.id,
    );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const showOverallProgress = async (req, res, next) => {
  try {
    const progress = await progressService.getMyOverallProgress(req.user.id);

    return res.status(200).json({ progress });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  answerExercise,
  showLessonProgress,
  showModuleProgress,
  showOverallProgress,
};
