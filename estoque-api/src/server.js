const express = require("express");
const db = require("./models");

const app = express();
app.use(express.json());

//Endpoint para verificar se o servidor está rodando
app.get("/statuscheck", (req, res) => {
  res.send("Aplicação funcionando!");
});

//Endpoints das entidades
const produtoRoutes = require("./routes/produtoRoutes");
app.use("/produtos", produtoRoutes);

//Conectar e sincronizar o banco de dados
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

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
