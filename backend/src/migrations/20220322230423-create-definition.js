'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('definitions', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      wordId: {
        type: Sequelize.INTEGER
      },
      categoryId: {
        type: Sequelize.INTEGER
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
        type: Sequelize.STRING(18000)
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Definitions');
  }
};