const { Op, QueryTypes } = require("sequelize");

const {
  sequelize,
  CourseModule,
  Lesson,
  Exercise,
  UserExerciseProgress,
  UserLessonProgress,
  StudyCharacter,
  UserCharacterProgress,
  FlashcardDeck,
  Flashcard,
  FlashcardReview,
} = require("../../models");

const calculatePercentage = (part, total) => {
  if (!total || total === 0) return 0;

  return Number(((part / total) * 100).toFixed(2));
};

const getModulesProgress = async (userId) => {
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
            attributes: ["is_completed", "score", "last_studied_at"],
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

  return modules.map((module) => {
    const plainModule = module.get({ plain: true });
    const lessons = plainModule.lessons || [];

    const completedLessons = lessons.filter((lesson) => {
      return lesson.userProgress?.some((progress) => progress.is_completed);
    }).length;

    const totalLessons = lessons.length;

    return {
      id: plainModule.id,
      level: plainModule.level,
      title: plainModule.title,
      description: plainModule.description,
      position: plainModule.position,
      total_lessons: totalLessons,
      completed_lessons: completedLessons,
      progress_percentage: calculatePercentage(completedLessons, totalLessons),
    };
  });
};

const getLessonStats = async (userId) => {
  const totalLessons = await Lesson.count();

  const startedLessons = await UserLessonProgress.count({
    where: {
      user_id: userId,
    },
  });

  const completedLessons = await UserLessonProgress.count({
    where: {
      user_id: userId,
      is_completed: true,
    },
  });

  const lessonProgressRecords = await UserLessonProgress.findAll({
    where: {
      user_id: userId,
    },
    attributes: ["score"],
  });

  const averageScore =
    lessonProgressRecords.length === 0
      ? 0
      : Number(
          (
            lessonProgressRecords.reduce(
              (sum, item) => sum + Number(item.score),
              0,
            ) / lessonProgressRecords.length
          ).toFixed(2),
        );

  return {
    total_lessons: totalLessons,
    started_lessons: startedLessons,
    completed_lessons: completedLessons,
    completion_percentage: calculatePercentage(completedLessons, totalLessons),
    averageScore: averageScore,
  };
};

const getExerciseStats = async (userId) => {
  const totalExercises = await Exercise.count();

  const answeredExercises = await UserExerciseProgress.count({
    where: {
      user_id: userId,
    },
  });

  const correctExercises = await UserExerciseProgress.count({
    where: {
      user_id: userId,
      is_correct: true,
    },
  });

  return {
    total_exercises: totalExercises,
    answered_exercises: answeredExercises,
    correct_exercises: correctExercises,
    accuracy_percentage: calculatePercentage(
      correctExercises,
      answeredExercises,
    ),
    completion_percentage: calculatePercentage(
      answeredExercises,
      totalExercises,
    ),
  };
};

const getTrainerStats = async (userId) => {
  const totalCharacters = await StudyCharacter.count();

  const studiedCharacters = await UserCharacterProgress.count({
    where: {
      user_id: userId,
    },
  });
  const masteredCharacters = await UserCharacterProgress.count({
    where: {
      user_id: userId,
      mastery_score: {
        [Op.gte]: 80,
      },
    },
  });

  const progressRecords = await UserCharacterProgress.findAll({
    where: {
      user_id: userId,
    },
    attributes: ["correct_attempts", "wrong_attempts", "mastery_score"],
  });

  const correctAttempts = progressRecords.reduce(
    (sum, item) => sum + Number(item.correct_attempts),
    0,
  );
  const wrongAttempts = progressRecords.reduce(
    (sum, item) => sum + Number(item.wrong_attempts),
    0,
  );
  const totalAttempts = correctAttempts + wrongAttempts;

  const averageMastery =
    progressRecords.length === 0
      ? 0
      : Number(
          (
            progressRecords.reduce(
              (sum, item) => sum + Number(item.mastery_score),
              0,
            ) / progressRecords.length
          ).toFixed(2),
        );

  return {
    total_characters: totalCharacters,
    studied_characters: studiedCharacters,
    mastered_characters: masteredCharacters,
    study_percentage: calculatePercentage(studiedCharacters, totalCharacters),
    correct_attempts: correctAttempts,
    wrong_attempts: wrongAttempts,
    accuracy_percentage: calculatePercentage(correctAttempts, totalAttempts),
    average_mastery: averageMastery,
  };
};

const getFlashcardStats = async (userId) => {
  const totalDecks = await FlashcardDeck.count({
    where: {
      user_id: userId,
    },
  });

  const totalCards = await Flashcard.count({
    include: [
      {
        model: FlashcardDeck,
        as: "deck",
        attributes: [],
        where: {
          user_id: userId,
        },
      },
    ],
  });

  const reviewedCards = await FlashcardReview.count({
    where: {
      user_id: userId,
    },
  });

  const correctReviews = await FlashcardReview.findAll({
    where: {
      user_id: userId,
    },
    attributes: ["correct_attempts", "wrong_attempts", "mastery_score"],
  });

  const correctAttempts = correctReviews.reduce(
    (sum, item) => sum + Number(item.correct_attempts),
    0,
  );
  const wrongAttempts = correctReviews.reduce(
    (sum, item) => sum + Number(item.wrong_attempts),
    0,
  );

  const totalAttempts = correctAttempts + wrongAttempts;

  const averageMastery =
    correctReviews.length === 0
      ? 0
      : Number(
          (
            correctReviews.reduce(
              (sum, item) => sum + Number(item.mastery_score),
              0,
            ) / correctReviews.length
          ).toFixed(2),
        );

  const now = new Date();

  const dueRows = await sequelize.query(
    `
        SELECT COUNT(*)::int AS count
        FROM flashcards AS f
        INNER JOIN flashcard_decks AS d
            ON d.id = f.deck_id
        LEFT JOIN flashcard_reviews AS r
            ON r.flashcard_id = f.id
            AND r.user_id = :userId
        WHERE d.user_id = :userId
            AND (
                r.id IS NULL
                OR r.due_date <= :now
            )
    `,
    {
      replacements: {
        userId,
        now,
      },
      type: QueryTypes.SELECT,
    },
  );

  const dueCards = Number(dueRows[0]?.count || 0);

  return {
    total_decks: totalDecks,
    total_cards: totalCards,
    reviewed_cards: reviewedCards,
    due_cards: dueCards,
    review_completion_percentage: calculatePercentage(
      reviewedCards,
      totalCards,
    ),
    correct_attempts: correctAttempts,
    wrong_attempts: wrongAttempts,
    accuracy_percentage: calculatePercentage(correctAttempts, totalAttempts),
    average_mastery: averageMastery,
  };
};

const getRecentActivity = async (userId) => {
  const recentLessons = await UserLessonProgress.findAll({
    where: {
      user_id: userId,
    },
    attributes: [
      "lesson_id",
      "score",
      "is_completed",
      "completed_at",
      "last_studied_at",
    ],
    include: [
      {
        model: Lesson,
        as: "lesson",
        attributes: ["id", "title"],
      },
    ],
    order: [["last_studied_at", "DESC"]],
    limit: 5,
  });

  const recentCharacters = await UserCharacterProgress.findAll({
    where: {
      user_id: userId,
    },
    attributes: [
      "character_id",
      "last_answer",
      "last_result",
      "mastery_score",
      "last_practiced_at",
    ],
    include: [
      {
        model: StudyCharacter,
        as: "character",
        attributes: ["id", "type", "symbol", "romaji", "meaning"],
      },
    ],
    order: [["last_practiced_at", "DESC"]],
    limit: 5,
  });

  const recentFlashcards = await FlashcardReview.findAll({
    where: {
      user_id: userId,
    },
    attributes: [
      "flashcard_id",
      "review_count",
      "mastery_score",
      "due_date",
      "last_reviewed_at",
    ],
    include: [
      {
        model: Flashcard,
        as: "flashcard",
        attributes: ["id", "front_text", "back_text"],
        include: [
          {
            model: FlashcardDeck,
            as: "deck",
            attributes: ["id", "title"],
          },
        ],
      },
    ],
    order: [["last_reviewed_at", "DESC"]],
    limit: 5,
  });

  return {
    recent_lessons: recentLessons,
    recent_characters: recentCharacters,
    recent_flashcards: recentFlashcards,
  };
};

const getDashboardSummary = async (userId) => {
  const [
    modules_progress,
    lesson_stats,
    exercise_stats,
    trainer_stats,
    flashcard_stats,
    recent_activity,
  ] = await Promise.all([
    getModulesProgress(userId),
    getLessonStats(userId),
    getExerciseStats(userId),
    getTrainerStats(userId),
    getFlashcardStats(userId),
    getRecentActivity(userId),
  ]);

  return {
    modules_progress,
    lesson_stats,
    exercise_stats,
    trainer_stats,
    flashcard_stats,
    recent_activity,
  };
};

module.exports = {
  getDashboardSummary,
};
