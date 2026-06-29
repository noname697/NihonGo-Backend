const express = require("express");

const progressController = require("../controllers/progress.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");

const {
  idParamSchema,
  answerExerciseSchema,
} = require("../validators/progress.validator");

const router = express.Router();

router.use(authMiddleware);

router.post(
  "/exercises/:id/answer",
  validate(answerExerciseSchema),
  progressController.answerExercise,
);

router.get(
  "/lessons/:id",
  validate(idParamSchema),
  progressController.showLessonProgress,
);
router.get(
  "/modules/:id",
  validate(idParamSchema),
  progressController.showModuleProgress,
);
router.get("/overview", progressController.showOverallProgress);

module.exports = router;
