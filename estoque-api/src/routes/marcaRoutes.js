const express = require("express");
const router = express.Router();
const marcaController = require("../controllers/marcaController");
const {
  validarCriacaoMarca,
  validarAtualizacaoMarca,
  validarIdParam
} = require("../validators/marcaValidators");
const authMiddleware = require("../middlewares/authMiddleware");

// Aplica o middleware de autenticação em todas as rotas
router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Marcas
 *   description: Endpoints para gerenciamento de marcas
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Marca:
 *       type: object
 *       required:
 *         - descricao
 *       properties:
 *         id:
 *           type: integer
 *           description: ID da marca
 *         descricao:
 *           type: string
 *           description: Descrição da marca
 *           minLength: 2
 *           maxLength: 100
 *       example:
 *         id: 1
 *         descricao: "Logitech"
 */

/**
 * @swagger
 * /marcas:
 *   get:
 *     summary: Lista todas as marcas
 *     tags: [Marcas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de marcas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pageSize:
 *                   type: integer
 *                 totalCount:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Marca'
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/", marcaController.listarMarcas);

/**
 * @swagger
 * /marcas/{id}:
 *   get:
 *     summary: Busca uma marca pelo ID
 *     tags: [Marcas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da marca
 *     responses:
 *       200:
 *         description: Marca encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Marca'
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Marca não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/:id", validarIdParam, marcaController.buscarMarcaPorId);

/**
 * @swagger
 * /marcas:
 *   post:
 *     summary: Cria uma nova marca
 *     tags: [Marcas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - descricao
 *             properties:
 *               descricao:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 description: Descrição da marca
 *                 example: "Logitech"
 *     responses:
 *       201:
 *         description: Marca criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Marca'
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/", validarCriacaoMarca, marcaController.criarMarca);

/**
 * @swagger
 * /marcas/{id}:
 *   put:
 *     summary: Atualiza uma marca existente
 *     tags: [Marcas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da marca
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - descricao
 *             properties:
 *               descricao:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 description: Descrição da marca
 *                 example: "Logitech Atualizada"
 *     responses:
 *       200:
 *         description: Marca atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Marca'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Marca não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.put("/:id", validarAtualizacaoMarca, marcaController.atualizarMarca);

/**
 * @swagger
 * /marcas/{id}:
 *   delete:
 *     summary: Deleta uma marca pelo ID
 *     tags: [Marcas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da marca
 *     responses:
 *       204:
 *         description: Marca deletada com sucesso
 *       400:
 *         description: ID inválido ou marca possui produtos vinculados
 *       404:
 *         description: Marca não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.delete("/:id", validarIdParam, marcaController.deletarMarcaPorId);

module.exports = router;
