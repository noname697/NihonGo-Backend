"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("flashcards", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      deck_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "flashcard_decks",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      front_text: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      back_text: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      example_sentence: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      position: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex("flashcards", ["deck_id"]);
    await queryInterface.addIndex("flashcards", ["deck_id", "position"]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("flashcards");
  },
};
