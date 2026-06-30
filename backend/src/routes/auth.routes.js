const express = require("express");

const authMiddleware = require("../middlewares/auth.middleware");
const authController = require("../controllers/auth.controller");
const validate = require("../middlewares/validate.middleware");
const { authLimiter } = require("../middlewares/rateLimit.middleware");

const { registerSchema, loginSchema } = require("../validators/auth.validator");

const router = express.Router();

router.post(
  "/register",
  authLimiter,
  validate(registerSchema),
  authController.register,
);
router.post("/login", authLimiter, validate(loginSchema), authController.login);
router.get("/me", authMiddleware, authController.me);

module.exports = router;
