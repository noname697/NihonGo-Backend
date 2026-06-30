"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CourseModule extends Model {
    static associate(models) {
      CourseModule.hasMany(models.Lesson, {
        foreignKey: "module_id",
        as: "lessons",
      });
    }
  }
  CourseModule.init(
    {
      level: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
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
      modelName: "CourseModule",
      tableName: "modules",
    },
  );
  return CourseModule;
};
