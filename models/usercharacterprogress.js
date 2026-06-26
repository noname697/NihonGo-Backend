'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserCharacterProgress extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserCharacterProgress.init({
    user_id: DataTypes.INTEGER,
    character_id: DataTypes.INTEGER,
    correct_attempts: DataTypes.INTEGER,
    wrong_attemps: DataTypes.INTEGER,
    last_awnser: DataTypes.STRING,
    last_result: DataTypes.BOOLEAN,
    mastery_score: DataTypes.FLOAT,
    last_practiced_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'UserCharacterProgress',
  });
  return UserCharacterProgress;
};