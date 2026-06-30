const {
  Exercise,
  UserExerciseProgress,
  UserLessonProgress,
  Lesson,
  ExerciseOption,
  CourseModule,
  sequelize,
} = require("../../models");

const createError = require("../utils/createError");

const normalizeAnswer = (answer) => {
  return String(answer || "")
    .trim()
    .toLowerCase();
};

const recalculateLessonProgress = async (userId, lessonId, transaction) => {
  const totalExercises = await Exercise.count({
    where: {
      lesson_id: lessonId,
    },
    transaction,
  });

  const answeredExercises = await UserExerciseProgress.count({
    include: [
      {
        model: Exercise,
        as: "exercise",
        attributes: [],
        where: {
          lesson_id: lessonId,
        },
      },
    ],
    where: {
      user_id: userId,
    },
    transaction,
  });

  const correctExercises = await UserExerciseProgress.count({
    include: [
      {
        model: Exercise,
        as: "exercise",
        attributes: [],
        where: {
          lesson_id: lessonId,
        },
      },
    ],
    where: {
      user_id: userId,
      is_correct: true,
    },
    transaction,
  });

  const score =
    totalExercises === 0
      ? 0
      : Number(((correctExercises / totalExercises) * 100).toFixed(2));

  const isCompleted = totalExercises > 0 && answeredExercises >= totalExercises;

  const now = new Date();

  const [lessonProgress] = await UserLessonProgress.findOrCreate({
    where: {
      user_id: userId,
      lesson_id: lessonId,
    },
    default: {
      user_id: userId,
      lesson_id: lessonId,
      total_exercises: totalExercises,
      correct_exercises: correctExercises,
      score,
      is_completed: isCompleted,
      completed_at: isCompleted ? now : null,
      last_studied_at: now,
    },
    transaction,
  });

  await lessonProgress.update(
    {
      total_exercises: totalExercises,
      correct_exercises: correctExercises,
      score,
      is_completed: isCompleted,
      completed_at:
        isCompleted && !lessonProgress.completed_at
          ? now
          : lessonProgress.completed_at,
      last_studied_at: now,
    },
    { transaction },
  );

  return lessonProgress;
};

const submitExerciseAnswer = async (userId, exerciseId, answer) => {
  if (answer === undefined || answer === null || String(answer).trim() === "") {
    throw createError("Answer is required", 400);
  }

  const result = await sequelize.transaction(async (transaction) => {
    const exercise = await Exercise.findByPk(exerciseId, {
      include: [
        {
          model: Lesson,
          as: "lesson",
          attributes: ["id", "title", "module_id"],
        },
        {
          model: ExerciseOption,
          as: "options",
          attributes: ["id", "text", "position"],
        },
      ],
      transaction,
    });

    if (!exercise) {
      throw createError("Exercise not found", 404);
    }

    const normalizedUserAnswer = normalizeAnswer(answer);
    const normalizedCorrectAnswer = normalizeAnswer(exercise.correct_answer);

    const isCorrect = normalizedUserAnswer === normalizedCorrectAnswer;

    const existingProgress = await UserExerciseProgress.findOne({
      where: {
        user_id: userId,
        exercise_id: exercise.id,
      },
      transaction,
    });

    let exerciseProgress;

    const now = new Date();

    if (existingProgress) {
      exerciseProgress = await existingProgress.update(
        {
          answer,
          is_correct: isCorrect,
          attempts_count: existingProgress.attempts_count + 1,
          answered_at: now,
        },
        { transaction },
      );
    } else {
      exerciseProgress = await UserExerciseProgress.create(
        {
          user_id: userId,
          exercise_id: exercise.id,
          answer,
          is_correct: isCorrect,
          attempts_count: 1,
          answered_at: now,
        },
        { transaction },
      );
    }

    const lessonProgress = await recalculateLessonProgress(
      userId,
      exercise.lesson.id,
      transaction,
    );

    return {
      exercise: {
        id: exercise.id,
        lesson_id: exercise.lesson_id,
        type: exercise.type,
        question: exercise.question,
      },
      result: {
        submitted_answer: answer,
        is_correct: isCorrect,
        correct_answer: exercise.correct_answer,
        explanation: exercise.explanation,
        attempts_count: exerciseProgress.attempts_count,
      },
      lessonProgress: {
        lesson_id: lessonProgress.lesson_id,
        total_exercises: lessonProgress.total_exercises,
        correct_exercises: lessonProgress.correct_exercises,
        score: lessonProgress.score,
        is_completed: lessonProgress.is_completed,
        completed_at: lessonProgress.completed_at,
        last_studied_at: lessonProgress.last_studied_at,
      },
    };
  });

  return result;
};

const getMyLessonProgress = async (userId, lessonId) => {
  const lesson = await Lesson.findByPk(lessonId, {
    attributes: ["id", "title", "description"],
  });

  if (!lesson) {
    throw createError("Lesson not found.", 404);
  }

  const lessonProgress = await UserLessonProgress.findOne({
    where: {
      user_id: userId,
      lesson_id: lessonId,
    },
    attributes: [
      "lesson_id",
      "total_exercises",
      "correct_exercises",
      "score",
      "is_completed",
      "completed_at",
      "last_studied_at",
    ],
  });

  const exerciseProgress = await UserExerciseProgress.findAll({
    attributes: [
      "exercise_id",
      "answer",
      "is_correct",
      "attempts_count",
      "answered_at",
    ],
    include: [
      {
        model: Exercise,
        as: "exercise",
        attributes: ["id", "question", "type", "position"],
        where: {
          lesson_id: lessonId,
        },
      },
    ],
    where: {
      user_id: userId,
    },
    order: [[{ model: Exercise, as: "exercise" }, "position", "ASC"]],
  });

  return {
    lesson,
    lesson_progress: lessonProgress || {
      lesson_id: Number(lessonId),
      total_exercises: 0,
      correct_exercises: 0,
      score: 0,
      is_completed: false,
      completed_at: null,
      last_studied_at: null,
    },
    exercise_progress: exerciseProgress,
  };
};

const getMyModuleProgress = async (userId, moduleId) => {
  const module = await CourseModule.findByPk(moduleId, {
    attributes: ["id", "title", "description", "position"],
    include: [
      {
        model: Lesson,
        as: "lessons",
        attributes: ["id", "title", "description", "position"],
        include: [
          {
            model: UserLessonProgress,
            as: "userProgress",
            attributes: [
              "total_exercises",
              "correct_exercises",
              "score",
              "is_completed",
              "completed_at",
              "last_studied_at",
            ],
            where: {
              user_id: userId,
            },
            required: false,
          },
        ],
      },
    ],
    order: [[{ model: Lesson, as: "lessons" }, "position", "ASC"]],
  });

  if (!module) {
    throw createError("Module not found", 404);
  }

  const lessons = module.lessons || [];
  const completedLessons = lessons.filter((lesson) => {
    return (
      lesson.userProgress &&
      lesson.userProgress.some((progress) => progress.is_completed)
    );
  }).length;

  const totalLessons = lessons.length;

  const moduleScore =
    totalLessons === 0
      ? 0
      : Number(((completedLessons / totalLessons) * 100).toFixed(2));

  return {
    module,
    summary: {
      total_lessons: totalLessons,
      completed_lessons: completedLessons,
      progress_percentage: moduleScore,
    },
  };
};

const getMyOverallProgress = async (userId) => {
  const modules = await CourseModule.findAll({
    attributes: ["id", "level", "title", "description", "position"],
    include: [
      {
        model: Lesson,
        as: "lessons",
        attributes: ["id", "title", "position"],
        include: [
          {
            model: UserLessonProgress,
            as: "userProgress",
            attributes: ["score", "is_completed"],
            where: {
              user_id: userId,
            },
            required: false,
          },
        ],
      },
    ],
    order: [
      ["position", "ASC"],
      [{ model: Lesson, as: "lessons" }, "position", "ASC"],
    ],
  });

  const progress = modules.map((module) => {
    const lessons = module.lessons || [];

    const completedLessons = lessons.filter((lesson) => {
      return (
        lesson.userProgress &&
        lesson.userProgress.some((progress) => progress.is_completed)
      );
    }).length;

    const totalLessons = lessons.length;

    const progressPercentage =
      totalLessons === 0
        ? 0
        : Number(((completedLessons / totalLessons) * 100).toFixed(2));

    return {
      id: module.id,
      level: module.level,
      title: module.title,
      description: module.description,
      position: module.position,
      total_lessons: totalLessons,
      completed_lessons: completedLessons,
      progress_percentage: progressPercentage,
    };
  });

  return progress;
};

module.exports = {
  submitExerciseAnswer,
  getMyLessonProgress,
  getMyModuleProgress,
  getMyOverallProgress,
};
