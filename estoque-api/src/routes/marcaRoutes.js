const express = require("express");
const router = express.Router();
const marcaController = require("../controllers/marcaController");

router.get("/", marcaController.listarMarcas);
router.get("/:id", marcaController.buscarMarcaPorId);
router.post("/", marcaController.criarMarca);
router.put("/:id", marcaController.atualizarMarca);
router.delete("/:id", marcaController.deletarMarcaPorId);

module.exports = router;
