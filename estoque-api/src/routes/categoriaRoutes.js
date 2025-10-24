const express = require("express");
const router = express.Router();
const categoriaController = require("../controllers/categoriaController");
const {
  validarCriacaoCategoria,
  validarAtualizacaoCategoria,
  validarIdParam
} = require("../validators/categoriaValidators");
const authMiddleware = require("../middlewares/authMiddleware")

router.use(authMiddleware)

router.get("/", categoriaController.listarCategorias);
router.get("/:id", validarIdParam, categoriaController.buscarCategoriaPorId);
router.post("/", validarCriacaoCategoria, categoriaController.criarCategoria);
router.put("/:id", validarAtualizacaoCategoria, categoriaController.atualizarCategoria);
router.delete("/:id", validarIdParam, categoriaController.deletarCategoriaPorId);

module.exports = router;
