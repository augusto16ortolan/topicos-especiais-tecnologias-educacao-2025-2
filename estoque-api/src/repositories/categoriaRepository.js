const { Categoria } = require("../models");

class CategoriaRepository {
  async contar() {
    return await Categoria.count();
  }

  async buscarTodos() {
    return await Categoria.findAll();
  }

  async buscarPorId(id) {
    return await Categoria.findByPk(id);
  }

  async criarCategoria(categoria) {
    return await Categoria.create(categoria);
  }

  async atualizarCategoria(categoria) {
    await Categoria.update(categoria, { where: { id: categoria.id } });
    return categoria;
  }

  async deletarCategoria(id) {
    return await Categoria.destroy({ where: { id } });
  }
}

module.exports = new CategoriaRepository();
