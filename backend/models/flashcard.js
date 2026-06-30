"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Flashcard extends Model {
    static associate(models) {
      Flashcard.belongsTo(models.FlashcardDeck, {
        foreignKey: "deck_id",
        as: "deck",
      });
      Flashcard.hasMany(models.FlashcardReview, {
        foreignKey: "flashcard_id",
        as: "reviews",
      });
    }
  }
  Flashcard.init(
    {
      deck_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      front_text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      back_text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      example_sentence: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      position: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      modelName: "Flashcard",
      tableName: "flashcards",
    },
  );
  return Flashcard;
};
