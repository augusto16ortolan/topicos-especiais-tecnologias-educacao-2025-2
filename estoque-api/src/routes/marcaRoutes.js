const express = require("express");
const router = express.Router();
const marcaController = require("../controllers/marcaController");
const {
  validarCriacaoMarca,
  validarAtualizacaoMarca,
  validarIdParam
} = require("../validators/marcaValidators");

router.get("/", marcaController.listarMarcas);
router.get("/:id", validarIdParam, marcaController.buscarMarcaPorId);
router.post("/", validarCriacaoMarca, marcaController.criarMarca);
router.put("/:id", validarAtualizacaoMarca, marcaController.atualizarMarca);
router.delete("/:id", validarIdParam, marcaController.deletarMarcaPorId);

module.exports = router;
