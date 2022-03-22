"use strict";
const { v4: uuid } = require("uuid");
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert("People", [{
     *   name: "John Doe",
     *   isBetaMember: false
     * }], {});
    */
    return await queryInterface.bulkInsert("users", [{
      uuid: uuid(),
      username: "johndoe",
      password: "12345",
      displayName: "johndoe"
    }], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete("People", null, {});
     */
    return await queryInterface.bulkDelete("users", null, {});
  }
};
