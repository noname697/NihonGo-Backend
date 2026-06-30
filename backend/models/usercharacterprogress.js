"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserCharacterProgress extends Model {
    static associate(models) {
      UserCharacterProgress.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
      UserCharacterProgress.belongsTo(models.StudyCharacter, {
        foreignKey: "character_id",
        as: "character",
      });
    }
  }
  UserCharacterProgress.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      character_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      correct_attempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      wrong_attempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: "wrong_attemps",
      },
      last_answer: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "last_awnser",
      },
      last_result: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      mastery_score: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      last_practiced_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "UserCharacterProgress",
      tableName: "user_character_progress",
    },
  );
  return UserCharacterProgress;
};
