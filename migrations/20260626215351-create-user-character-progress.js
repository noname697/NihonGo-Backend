'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserCharacterProgresses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      character_id: {
        type: Sequelize.INTEGER
      },
      correct_attempts: {
        type: Sequelize.INTEGER
      },
      wrong_attemps: {
        type: Sequelize.INTEGER
      },
      last_awnser: {
        type: Sequelize.STRING
      },
      last_result: {
        type: Sequelize.BOOLEAN
      },
      mastery_score: {
        type: Sequelize.FLOAT
      },
      last_practiced_at: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('UserCharacterProgresses');
  }
};