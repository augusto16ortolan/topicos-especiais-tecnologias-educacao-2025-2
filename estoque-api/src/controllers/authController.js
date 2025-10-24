const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const usuarioRepository = require("../repositories/usuarioRepository")
const SECRET = process.env.JWT_SECRET;

exports.login = async (req, res) => {
    const { email, senha } = req.body

    if (!email || !senha) {
        return res.status(400).json({ mensagem: "Email e senha são obrigatórios" })
    }

    try {
        const usuario = await usuarioRepository.buscarPorEmail(email)

        if (!usuario) {
            return res.status(401).json({ mensagem: "Credenciais inválidas" })
        }

        const isSenhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!isSenhaCorreta) {
            return res.status(401).json({ mensagem: "Credenciais inválidas" })
        }

        const payload = { id: usuario.id, email: usuario.email, nome: usuario.nome }
        const token = jwt.sign(payload, SECRET, { expiresIn: '1h' })
        res.json({ token, usuario: payload })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ mensagem: "Ocorreu um erro ao autenticar. Tente novamente mais tarde." })
    }
}

exports.registrar = async (req, res) => {
    const { nome, email, senha } = req.body

    if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: "Nome, email e senha são obrigatórios" })
    }

    if (senha.length < 8) {
        return res.status(400).json({ mensagem: "A senha deve conter 8 ou mais caracteres" })
    }

    try {
        const usuarioExistente = await usuarioRepository.buscarPorEmail(email)

        if (usuarioExistente) {
            return res.status(401).json({ mensagem: "Email já utilizado" })
        }

        const senhaHash = await bcrypt.hash(senha, 10);
        const usuario = await usuarioRepository.criarUsuario({ nome, email, senha: senhaHash })
        const payload = { id: usuario.id, email: usuario.email, nome: usuario.nome }
        const token = jwt.sign(payload, SECRET, { expiresIn: '1h' })
        res.status(201).json({ token, usuario: payload })
    } catch (error) {
        res.status(500).json({ mensagem: "Erro ao cadastrar usuário", erro: error.message })
    }
}