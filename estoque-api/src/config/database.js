const { Sequelize } = require("sequelize");
require("dotenv").config();

let sequelize;

if (process.env.NODE_ENV === "test") {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory",
    logging: false,
  });
} else {
  sequelize = new Sequelize(process.env.NEON_URL, {
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
}

module.exports = sequelize;
