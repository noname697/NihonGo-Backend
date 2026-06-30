"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StudyCharacter extends Model {
    static associate(models) {
      StudyCharacter.hasMany(models.UserCharacterProgress, {
        foreignKey: "character_id",
        as: "userProgress",
      });
    }
  }
  StudyCharacter.init(
    {
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      symbol: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      romaji: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      meaning: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      onyomi: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      kunyomi: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      jlpt_level: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      stroke_count: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      character_group: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      position: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "StudyCharacter",
      tableName: "study_characters",
    },
  );
  return StudyCharacter;
};
