const authService = require("../services/auth.service");

const register = async (req, res, next) => {
  try {
    const result = await authService.registerUser(req.body);

    return res.status(201).json({
      message: "User created successfully.",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.loginUser(req.body);

    return res.status(200).json({
      message: "Login successfully.",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

const me = async (req, res, next) => {
  try {
    return res.status(200).json({
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  me,
};
