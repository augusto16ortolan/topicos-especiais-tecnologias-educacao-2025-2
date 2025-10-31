const express = require("express");
const { loggingMiddleware, requestIdMiddleware } = require("./middlewares");
const { swaggerSpec, swaggerUI } = require("./config/swagger");

const app = express();

app.use(requestIdMiddleware);
app.use(loggingMiddleware);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use(express.json());

//Endpoint para verificar se o servidor está rodando
app.get("/statuscheck", (req, res) => {
  res.send("Aplicação funcionando!");
});

//Endpoints das entidades
const produtoRoutes = require("./routes/produtoRoutes");
const marcaRoutes = require("./routes/marcaRoutes");
const categoriaRoutes = require("./routes/categoriaRoutes");
const authRoutes = require("./routes/authRoutes");

app.use("/produtos", produtoRoutes);
app.use("/categorias", categoriaRoutes);
app.use("/marcas", marcaRoutes);
app.use("/auth", authRoutes);

const { errorHandlerMiddleware, notFoundMiddleware } = require("./middlewares");
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

module.exports = app;
