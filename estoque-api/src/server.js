const app = require("./app");
const db = require("./models");

const PORT = 3000;

// Conectar e sincronizar o banco
db.sequelize
  .authenticate()
  .then(() => console.log("Banco encontrado e autenticado com sucesso!"))
  .catch((error) =>
    console.error("Banco não localizado ou erro na autenticação", error)
  );

db.sequelize
  .sync({ alter: true })
  .then(() => console.log("Tabelas sincronizadas com sucesso!"))
  .catch((error) => console.error("Erro ao sincronizar as tabelas!", error));

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
