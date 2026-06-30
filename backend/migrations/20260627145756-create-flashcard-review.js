"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("flashcard_reviews", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      flashcard_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "flashcards",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      correct_attempts: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      wrong_attempts: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      review_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      mastery_score: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      due_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      last_reviewed_at: {
        type: Sequelize.DATE,
        allowNull: true,
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

    await queryInterface.addIndex("flashcard_reviews", ["user_id"]);
    await queryInterface.addIndex("flashcard_reviews", ["flashcard_id"]);
    await queryInterface.addIndex("flashcard_reviews", ["due_date"]);

    await queryInterface.addIndex(
      "flashcard_reviews",
      ["user_id", "flashcard_id"],
      { unique: true },
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("flashcard_reviews");
  },
};
