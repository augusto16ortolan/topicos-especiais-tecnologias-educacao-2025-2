const jwt = require("jsonwebtoken")
const SECRET = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ mensagem: "Acesso negado. Token inválido ou ausente." })
    }

    const token = authHeader.split(' ')[1]
    try {
        const payload = jwt.verify(token, SECRET)
        req.usuario = payload;
        next();
    } catch (_) {
        return res.status(401).json({ mensagem: "Acesso negado. Token inválido ou ausente." })
    }
}