"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Lesson extends Model {
    static associate(models) {
      Lesson.belongsTo(models.CourseModule, {
        foreignKey: "module_id",
        as: "module",
      });

      Lesson.hasMany(models.Exercise, {
        foreignKey: "lesson_id",
        as: "exercises",
      });

      Lesson.hasMany(models.UserLessonProgress, {
        foreignKey: "lesson_id",
        as: "userProgress",
      });
    }
  }
  Lesson.init(
    {
      module_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      explanation_text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      position: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Lesson",
      tableName: "lessons",
    },
  );
  return Lesson;
};
