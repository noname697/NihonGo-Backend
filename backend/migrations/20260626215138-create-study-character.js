"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("study_characters", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      symbol: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      romaji: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      meaning: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      onyomi: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      kunyomi: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      jlpt_level: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      stroke_count: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      character_group: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      position: {
        type: Sequelize.INTEGER,
        allowNull: false,
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

    await queryInterface.addIndex("study_characters", ["type"]);
    await queryInterface.addIndex("study_characters", ["jlpt_level"]);
    await queryInterface.addIndex("study_characters", ["type", "position"]);
    await queryInterface.addIndex("study_characters", ["type", "symbol"]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("study_characters");
  },
};
