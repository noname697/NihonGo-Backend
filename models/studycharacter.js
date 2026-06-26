'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StudyCharacter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  StudyCharacter.init({
    type: DataTypes.STRING,
    symbol: DataTypes.STRING,
    romaji: DataTypes.STRING,
    meaning: DataTypes.STRING,
    onyomi: DataTypes.STRING,
    kunyomi: DataTypes.STRING,
    jlpt_level: DataTypes.STRING,
    stroke_count: DataTypes.INTEGER,
    character_group: DataTypes.STRING,
    position: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'StudyCharacter',
  });
  return StudyCharacter;
};