const {
  CourseModule,
  Lesson,
  Exercise,
  ExerciseOption,
} = require("../../models");
const createError = require("../utils/createError");

const getModules = async () => {
  const modules = await CourseModule.findAll({
    attributes: ["id", "level", "title", "description", "position"],
    order: [["position", "ASC"]],
  });

  return modules;
};

const getModuleById = async (id) => {
  const module = await CourseModule.findByPk(id, {
    attributes: ["id", "level", "title", "description", "position"],
    include: [
      {
        model: Lesson,
        as: "lessons",
        attributes: ["id", "title", "description", "position"],
        separate: true,
        order: [["position", "ASC"]],
      },
    ],
  });

  if (!module) {
    throw createError("Module not found", 404);
  }

  return module;
};

const getLessonById = async (id) => {
  const lesson = await Lesson.findByPk(id, {
    attributes: [
      "id",
      "module_id",
      "title",
      "description",
      "explanation_text",
      "position",
    ],
    include: [
      {
        model: CourseModule,
        as: "module",
        attributes: ["id", "level", "title"],
      },
    ],
  });

  if (!lesson) {
    throw createError("Lesson not found", 404);
  }

  return lesson;
};

const getLessonExercises = async (lessonId) => {
  const lesson = await Lesson.findByPk(lessonId, {
    attributes: ["id", "title"],
  });

  if (!lesson) {
    throw createError("Lesson not found.", 404);
  }

  const exercises = await Exercise.findAll({
    where: { lesson_id: lessonId },
    attributes: ["id", "lesson_id", "type", "question", "position"],
    include: [
      {
        model: ExerciseOption,
        as: "options",
        attributes: ["id", "text", "position"],
      },
    ],
    order: [
      ["position", "ASC"],
      [{ model: ExerciseOption, as: "options" }, "position", "ASC"],
    ],
  });

  return {
    lesson,
    exercises,
  };
};

module.exports = {
  getModules,
  getModuleById,
  getLessonById,
  getLessonExercises,
};
