"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserExerciseProgress extends Model {
    static associate(models) {
      UserExerciseProgress.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
      UserExerciseProgress.belongsTo(models.Exercise, {
        foreignKey: "exercise_id",
        as: "exercise",
      });
    }
  }
  UserExerciseProgress.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      exercise_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      answer: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_correct: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      attempts_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      answered_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "UserExerciseProgress",
      tableName: "user_exercise_progress",
    },
  );
  return UserExerciseProgress;
};
