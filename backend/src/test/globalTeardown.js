process.env.NODE_ENV = "test";
const { sequelize } = require("../models");

module.exports = async () => {
  await sequelize.sync({ force: true });
  await sequelize.close();
}