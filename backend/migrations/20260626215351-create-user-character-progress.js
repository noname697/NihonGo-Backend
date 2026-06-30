"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_character_progress", {
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
      character_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "study_characters",
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
      wrong_attemps: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      last_awnser: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      last_result: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      mastery_score: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      last_practiced_at: {
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

    await queryInterface.addIndex("user_character_progress", ["user_id"]);
    await queryInterface.addIndex("user_character_progress", ["character_id"]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("user_character_progress");
  },
};
