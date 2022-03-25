'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Definition extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Category }) {
      this.belongsTo(Category, { as: "category" });
    }

    toJSON() {
      const _ = undefined;
      return { ...this.get(), id: _, wordId: _, categoryId: _ };
    }
  }
  Definition.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    definition: {
      type: DataTypes.STRING(18000),
      allowNull: false,
      validate: {
        notEmpty: { msg: "definition cannot be empty" },
        notNull: { msg: "definition must be present" }
      }
    },
    example: {
      type: DataTypes.STRING(18000),
    }
  }, {
    sequelize,
    modelName: 'Definition',
    timestamps: false,
    tableName: "definitions"
  });
  return Definition;
};