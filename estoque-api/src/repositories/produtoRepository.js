const { Produto, Marca, Categoria } = require("../models");

class ProdutoRepository {
  async contar() {
    return await Produto.count();
  }

  async buscarTodos() {
    return await Produto.findAll({
      include: [
        { model: Marca, as: "marca" },
        { model: Categoria, as: "categoria" }
      ]
    });
  }

  async buscarPorId(id) {
    return await Produto.findByPk(id, {
      include: [
        { model: Marca, as: "marca" },
        { model: Categoria, as: "categoria" }
      ]
    });
  }

  async buscarPorMarcaId(marcaId) {
    return await Produto.findAll({
      where: { marcaId }
    });
  }

  async buscarPorCategoriaId(categoriaId) {
    return await Produto.findAll({
      where: { categoriaId }
    });
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
