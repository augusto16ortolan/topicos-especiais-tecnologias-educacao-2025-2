const { where } = require("sequelize");
const { Produto } = require("../models");

class ProdutoRepository {
  async contar() {
    return await Produto.count();
  }

  async buscarTodos() {
    return await Produto.findAll();
  }

  async buscarPorId(id) {
    return await Produto.findByPk(id);
  }

  async criarProduto(produto) {
    return await Produto.create(produto);
  }

  async atualizarProduto(produto) {
    await Produto.update(produto, { where: { id: produto.id } });
    return produto;
  }

  async deletarProduto(id) {
    return await Produto.destroy({ where: { id: id } });
  }
}

module.exports = new ProdutoRepository();
