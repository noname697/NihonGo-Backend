"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class FlashcardDeck extends Model {
    static associate(models) {
      FlashcardDeck.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });

      FlashcardDeck.hasMany(models.Flashcard, {
        foreignKey: "deck_id",
        as: "cards",
      });
    }
  }
  FlashcardDeck.init(
    {
      user_id: {
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
      is_public: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "FlashcardDeck",
      tableName: "flashcard_decks",
    },
  );
  return FlashcardDeck;
};
