'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('StudyCharacters', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.STRING
      },
      symbol: {
        type: Sequelize.STRING
      },
      romaji: {
        type: Sequelize.STRING
      },
      meaning: {
        type: Sequelize.STRING
      },
      onyomi: {
        type: Sequelize.STRING
      },
      kunyomi: {
        type: Sequelize.STRING
      },
      jlpt_level: {
        type: Sequelize.STRING
      },
      stroke_count: {
        type: Sequelize.INTEGER
      },
      character_group: {
        type: Sequelize.STRING
      },
      position: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('StudyCharacters');
  }
};