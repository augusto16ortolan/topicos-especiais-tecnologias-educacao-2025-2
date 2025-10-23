// Middleware central para tratamento de erros
module.exports = (err, req, res, next) => {
  console.error("Erro Centralizado:", err);
  const status = err.status || 500;
  const resposta = {
    mensagem: err.publicMessage || "Erro interno do servidor",
    erro: process.env.NODE_ENV === 'production' ? undefined : err.message || err.toString()
  };
  if (err.validation) {
    resposta.erros = err.validation; // Mostra problemas detalhados do validator
  }
  res.status(status).json(resposta);
};
