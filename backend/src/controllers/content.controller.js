const contentService = require("../services/content.service");

const listModules = async (req, res, next) => {
  try {
    const modules = await contentService.getModules();

    return res.status(200).json({
      modules,
    });
  } catch (error) {
    next(error);
  }
};

const showModule = async (req, res, next) => {
  try {
    const module = await contentService.getModuleById(req.params.id);

    return res.status(200).json({
      module,
    });
  } catch (error) {
    next(error);
  }
};

const showLesson = async (req, res, next) => {
  try {
    const lesson = await contentService.getLessonById(req.params.id);

    return res.status(200).json({
      lesson,
    });
  } catch (error) {
    next(error);
  }
};

const listLessonExercises = async (req, res, next) => {
  try {
    const result = await contentService.getLessonExercises(req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listModules,
  showModule,
  showLesson,
  listLessonExercises,
};
