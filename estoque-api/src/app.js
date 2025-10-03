const express = require("express");

const app = express();
app.use(express.json());

//Endpoint para verificar se o servidor está rodando
app.get("/statuscheck", (req, res) => {
  res.send("Aplicação funcionando!");
});

//Endpoints das entidades
const produtoRoutes = require("./routes/produtoRoutes");
const marcaRoutes = require("./routes/marcaRoutes")
const categoriaRoutes = require("./routes/categoriaRoutes")

app.use("/produtos", produtoRoutes);
app.use("/categorias", categoriaRoutes);
app.use("/marcas", marcaRoutes);

module.exports = app;
