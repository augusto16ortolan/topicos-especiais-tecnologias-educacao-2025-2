const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Marca = sequelize.define(
  "Marca",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    descricao: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "marcas",
    timestamps: true,
  }
);

module.exports = Marca;
