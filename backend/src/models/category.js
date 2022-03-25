'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Definition }) {
      this.hasMany(Definition, { foreignKey: "categoryId" });
    }

    toJSON() {
      return {...this.get(), id: undefined};
    }
  }
  Category.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: { msg: "category name must not be empty" }
      }
    }
  }, {
    sequelize,
    modelName: 'Category',
    timestamps: false,
    tableName: "categories"
  });
  return Category;
};