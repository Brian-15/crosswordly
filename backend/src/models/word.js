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
    static associate({ Definition }) {
      // define association here
      // this.belongsToMany(User, { through: "user_words" });
      this.hasMany(Definition, {
        as: "definitions",
        foreignKey: {
          name: "wordId",
          allowNull: false
        }
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
      allowNull: false,
      validate: {
        notNull: { msg: "word must be included" },
        notEmpty: { msg: "word cannot not be an empty string" }
      }
    },
  }, {
    sequelize,
    tableName: "words",
    modelName: "Word",
    timestamps: false
  });
  return Word;
};