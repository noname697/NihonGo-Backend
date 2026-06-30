"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.UserExerciseProgress, {
        foreignKey: "user_id",
        as: "exerciseProgress",
      });
      User.hasMany(models.UserLessonProgress, {
        foreignKey: "user_id",
        as: "lessonProgress",
      });
      User.hasMany(models.UserCharacterProgress, {
        foreignKey: "user_id",
        as: "characterProgress",
      });
      User.hasMany(models.FlashcardDeck, {
        foreignKey: "user_id",
        as: "flashcardDecks",
      });
      User.hasMany(models.FlashcardReview, {
        foreignKey: "user_id",
        as: "flashcardReviews",
      });
    }
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "student",
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
    },
  );
  return User;
};
