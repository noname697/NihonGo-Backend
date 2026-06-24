"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Exercise extends Model {
    static associate(models) {
      Exercise.belongsTo(models.Lesson, {
        foreignKey: "lesson_id",
        as: "lesson",
      });

      Exercise.hasMany(models.ExerciseOption, {
        foreignKey: "exercise_id",
        as: "options",
      });

      Exercise.hasMany(models.UserExerciseProgress, {
        foreignKey: "exercise_id",
        as: "userProgress",
      });
    }
  }
  Exercise.init(
    {
      lesson_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "complete_sentence",
      },
      question: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      correct_answer: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      explanation: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      position: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Exercise",
      tableName: "exercises",
    },
  );
  return Exercise;
};
