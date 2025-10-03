const { Marca } = require("../models");

class MarcaRepository {
  async contar() {
    return await Marca.count();
  }

  async buscarTodos() {
    return await Marca.findAll();
  }

  async buscarPorId(id) {
    return await Marca.findByPk(id);
  }

  async criarMarca(marca) {
    return await Marca.create(marca);
  }

  async atualizarMarca(marca) {
    await Marca.update(marca, { where: { id: marca.id } });
    return marca;
  }

  async deletarMarca(id) {
    return await Marca.destroy({ where: { id } });
  }
}

module.exports = new MarcaRepository();
