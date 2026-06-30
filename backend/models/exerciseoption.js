"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ExerciseOption extends Model {
    static associate(models) {
      ExerciseOption.belongsTo(models.Exercise, {
        foreignKey: "exercise_id",
        as: "exercise",
      });
    }
  }
  ExerciseOption.init(
    {
      exercise_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_correct: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      position: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ExerciseOption",
      tableName: "exercise_options",
    },
  );
  return ExerciseOption;
};
