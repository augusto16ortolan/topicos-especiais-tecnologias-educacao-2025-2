const sequelize = require("../config/database");
const Produto = require("./produto");
const Categoria = require("./categoria")
const Marca = require("./marca")
const Usuario = require("./usuario")

Categoria.hasMany(Produto, {
  foreignKey: "categoriaId",
  as: "produtos",
  onDelete: 'NO ACTION',
  onUpdate: 'NO ACTION',
})

Produto.belongsTo(Categoria, {
  foreignKey: "categoriaId",
  as: "categoria"
})

Marca.hasMany(Produto, {
  foreignKey: "marcaId",
  as: "produtos",
  onDelete: 'NO ACTION',
  onUpdate: 'NO ACTION',
})

Produto.belongsTo(Marca, {
  foreignKey: "marcaId",
  as: "marca"
})

const db = {
  sequelize,
  Produto,
  Categoria,
  Marca,
  Usuario
};

module.exports = db;
