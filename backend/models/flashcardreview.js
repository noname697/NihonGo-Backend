"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class FlashcardReview extends Model {
    static associate(models) {
      FlashcardReview.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
      FlashcardReview.belongsTo(models.Flashcard, {
        foreignKey: "flashcard_id",
        as: "flashcard",
      });
    }
  }
  FlashcardReview.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      flashcard_id: {
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
      },
      review_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      mastery_score: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      due_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      last_reviewed_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "FlashcardReview",
      tableName: "flashcard_reviews",
    },
  );
  return FlashcardReview;
};
