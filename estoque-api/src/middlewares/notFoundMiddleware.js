// Middleware para tratar rotas não encontradas
module.exports = (req, res, next) => {
  res.status(404).json({
    mensagem: 'Rota não encontrada'
  });
};
