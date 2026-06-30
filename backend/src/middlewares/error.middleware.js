const {
  ValidationError,
  UniqueConstraintError,
  ForeignKeyConstraintError,
  DatabaseError,
} = require("sequelize");

const errorMiddleware = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;

  if (error.details) {
    return res.status(statusCode).json({
      message: error.message,
      errors: error.details,
    });
  }

  if (error instanceof UniqueConstraintError) {
    return res.status(409).json({
      message: "Resource already exists.",
      errors: error.errors.map((item) => ({
        field: item.path,
        message: item.message,
      })),
    });
  }

  if (error instanceof ValidationError) {
    return res.status(400).json({
      message: "Validation error.",
      errors: error.errors.map((item) => ({
        field: item.path,
        message: item.message,
      })),
    });
  }

  if (error instanceof ForeignKeyConstraintError) {
    return res.status(400).json({
      message: "Invalid relationship reference.",
    });
  }

  if (error instanceof DatabaseError) {
    return res.status(500).json({
      message: "Database error.",
    });
  }

  if (process.env.NODE_ENV === "development") {
    console.error(error);
  }

  return res.status(statusCode).json({
    message: error.message || "Internal server error.",
  });
};

module.exports = errorMiddleware;
