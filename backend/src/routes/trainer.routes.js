const express = require("express");

const trainerController = require("../controllers/trainer.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");

const {
  listCharactersSchema,
  randomCharactersSchema,
  answerCharacterSchema,
  trainerProgressSchema,
} = require("../validators/trainer.validator");

const router = express.Router();

router.get(
  "/characters",
  validate(listCharactersSchema),
  trainerController.listCharacters,
);
router.get(
  "/characters/random",
  validate(randomCharactersSchema),
  trainerController.listRandomCharacters,
);

router.post(
  "/characters/:id/answer",
  authMiddleware,
  validate(answerCharacterSchema),
  trainerController.answerCharacter,
);

router.get(
  "/progress",
  authMiddleware,
  validate(trainerProgressSchema),
  trainerController.showTrainerProgress,
);

module.exports = router;
