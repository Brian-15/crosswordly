"use strict";
const {
  Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Word extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Definition }) {
      // define association here
      this.belongsToMany(User, {
        through: "user_words",
        as: "words",
        foreignKey: "userId"
      });
      this.hasMany(Definition, {
        as: "definitions",
        foreignKey: "wordId"
      });
    }
  }
  Word.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    word: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
  }, {
    sequelize,
    tableName: "words",
    modelName: "Word",
    timestamps: false
  });
  return Word;
};