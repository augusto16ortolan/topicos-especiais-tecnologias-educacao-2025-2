const express = require("express");
const router = express.Router();
const produtoController = require("../controllers/produtoController");
const {
  validarCriacaoProduto,
  validarAtualizacaoProduto,
  validarIdParam
} = require("../validators/produtoValidators");
const authMiddleware = require("../middlewares/authMiddleware")

router.use(authMiddleware)

router.get("/", produtoController.listarProdutos);
router.get("/:id", validarIdParam, produtoController.buscarProdutoPorId);
router.post("/", validarCriacaoProduto, produtoController.criarProduto);
router.put("/:id", validarAtualizacaoProduto, produtoController.atualizarProduto);
router.delete("/:id", validarIdParam, produtoController.deletarProdutoPorId);

module.exports = router;
