const sequelize = require("../config/database");
const Produto = require("./produto");

const db = {
  sequelize,
  Produto,
};

module.exports = db;
