const jwt = require("jsonwebtoken");
const { User } = require("../../models");
const createError = require("../utils/createError");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw createError("Token not provided", 401);
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw createError("Invalid token format", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id, {
      attributes: ["id", "name", "email", "role", "createdAt", "updatedAt"],
    });

    if (!user) {
      throw createError("User not found", 401);
    }

    req.user = user;
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(createError("Token expired", 401));
    }

    if (error.name === "JsonWebTokenError") {
      return next(createError("Invalid token.", 401));
    }

    return next(error);
  }
};

module.exports = authMiddleware;
