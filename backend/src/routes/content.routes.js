const express = require("express");
const contentController = require("../controllers/content.controller");

const router = express.Router();

router.get("/modules", contentController.listModules);
router.get("/modules/:id", contentController.showModule);
router.get("/lessons/:id", contentController.showLesson);
router.get("/lessons/:id/exercises", contentController.listLessonExercises);

module.exports = router;
