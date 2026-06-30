"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserLessonProgress extends Model {
    static associate(models) {
      UserLessonProgress.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
      UserLessonProgress.belongsTo(models.Lesson, {
        foreignKey: "lesson_id",
        as: "lesson",
      });
    }
  }
  UserLessonProgress.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      lesson_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total_exercises: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      correct_exercises: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      score: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      is_completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      completed_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      last_studied_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "UserLessonProgress",
      tableName: "user_lesson_progress",
    },
  );
  return UserLessonProgress;
};
