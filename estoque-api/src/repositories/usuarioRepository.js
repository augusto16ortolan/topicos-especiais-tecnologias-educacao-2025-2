const { Usuario } = require("../models")

class UsuarioRepository {

    async buscarPorEmail(email) {
        return await Usuario.findOne({ where: { email } })
    }

    async criarUsuario(data) {
        return await Usuario.create(data)
    }
}

module.exports = new UsuarioRepository();