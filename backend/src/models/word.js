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
    static associate({ User }) {
      // define association here
      this.belongsToMany(User, {
        through: "UserWords",
        as: "words",
        foreignKey: "userId"
      });
    }

    toJSON() {
      return { ...this.get(), id: undefined };
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
    definition: {
      type: DataTypes.STRING(18000),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: "words",
    modelName: "Word",
    timestamps: false
  });
  return Word;
};