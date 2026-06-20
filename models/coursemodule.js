'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CourseModule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CourseModule.init({
    level: DataTypes.STRING,
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    position: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CourseModule',
  });
  return CourseModule;
};