const express = require("express");

const app = express();
app.use(express.json());

//Endpoint para verificar se o servidor está rodando
app.get("/statuscheck", (req, res) => {
  res.send("Aplicação funcionando!");
});

//Endpoints das entidades
const produtoRoutes = require("./routes/produtoRoutes");
app.use("/produtos", produtoRoutes);

module.exports = app;
