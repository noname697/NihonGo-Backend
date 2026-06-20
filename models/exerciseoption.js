'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ExerciseOption extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ExerciseOption.init({
    exercise_id: DataTypes.INTEGER,
    text: DataTypes.STRING,
    is_correct: DataTypes.BOOLEAN,
    position: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ExerciseOption',
  });
  return ExerciseOption;
};