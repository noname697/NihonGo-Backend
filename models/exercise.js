'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Exercise extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Exercise.init({
    lesson_id: DataTypes.INTEGER,
    type: DataTypes.STRING,
    question: DataTypes.TEXT,
    correct_awnser: DataTypes.STRING,
    explanation: DataTypes.TEXT,
    position: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Exercise',
  });
  return Exercise;
};