const express = require("express");
const router = express.Router();
const produtoController = require("../controllers/produtoController");
const {
  validarCriacaoProduto,
  validarAtualizacaoProduto,
  validarIdParam
} = require("../validators/produtoValidators");
const authMiddleware = require("../middlewares/authMiddleware");

// Aplica o middleware de autenticação em todas as rotas
router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Produtos
 *   description: Endpoints para gerenciamento de produtos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Produto:
 *       type: object
 *       required:
 *         - nome
 *         - descricao
 *         - preco
 *         - categoriaId
 *         - marcaId
 *       properties:
 *         id:
 *           type: integer
 *           description: ID do produto
 *         nome:
 *           type: string
 *           description: Nome do produto
 *           minLength: 2
 *           maxLength: 100
 *         descricao:
 *           type: string
 *           description: Descrição do produto
 *           minLength: 5
 *           maxLength: 500
 *         preco:
 *           type: number
 *           format: float
 *           minimum: 0.01
 *           description: Preço do produto
 *         quantidadeEmEstoque:
 *           type: integer
 *           minimum: 0
 *           description: Quantidade em estoque
 *         categoriaId:
 *           type: integer
 *           description: ID da categoria
 *         marcaId:
 *           type: integer
 *           description: ID da marca
 *       example:
 *         id: 1
 *         nome: "Teclado Mecânico"
 *         descricao: "Teclado mecânico com switches Cherry MX"
 *         preco: 299.99
 *         quantidadeEmEstoque: 15
 *         categoriaId: 1
 *         marcaId: 1
 */

/**
 * @swagger
 * /produtos:
 *   get:
 *     summary: Lista todos os produtos
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de produtos retornada com sucesso
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
 *                     $ref: '#/components/schemas/Produto'
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/", produtoController.listarProdutos);

/**
 * @swagger
 * /produtos/{id}:
 *   get:
 *     summary: Busca um produto pelo ID
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/:id", validarIdParam, produtoController.buscarProdutoPorId);

/**
 * @swagger
 * /produtos:
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - descricao
 *               - preco
 *               - categoriaId
 *               - marcaId
 *             properties:
 *               nome:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 description: Nome do produto
 *                 example: "Teclado Mecânico"
 *               descricao:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 500
 *                 description: Descrição do produto
 *                 example: "Teclado mecânico com switches Cherry MX"
 *               preco:
 *                 type: number
 *                 format: float
 *                 minimum: 0.01
 *                 description: Preço do produto
 *                 example: 299.99
 *               quantidadeEmEstoque:
 *                 type: integer
 *                 minimum: 0
 *                 description: Quantidade em estoque
 *                 example: 15
 *               categoriaId:
 *                 type: integer
 *                 description: ID da categoria
 *                 example: 1
 *               marcaId:
 *                 type: integer
 *                 description: ID da marca
 *                 example: 1
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       400:
 *         description: Dados inválidos ou categoria/marca não existe
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/", validarCriacaoProduto, produtoController.criarProduto);

/**
 * @swagger
 * /produtos/{id}:
 *   put:
 *     summary: Atualiza um produto existente
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 description: Nome do produto
 *                 example: "Teclado Mecânico Atualizado"
 *               descricao:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 500
 *                 description: Descrição do produto
 *                 example: "Teclado mecânico com switches Cherry MX atualizado"
 *               preco:
 *                 type: number
 *                 format: float
 *                 minimum: 0.01
 *                 description: Preço do produto
 *                 example: 349.99
 *               quantidadeEmEstoque:
 *                 type: integer
 *                 minimum: 0
 *                 description: Quantidade em estoque
 *                 example: 20
 *               categoriaId:
 *                 type: integer
 *                 description: ID da categoria
 *                 example: 1
 *               marcaId:
 *                 type: integer
 *                 description: ID da marca
 *                 example: 1
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       400:
 *         description: Dados inválidos ou categoria/marca não existe
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.put("/:id", validarAtualizacaoProduto, produtoController.atualizarProduto);

/**
 * @swagger
 * /produtos/{id}:
 *   delete:
 *     summary: Deleta um produto pelo ID
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     responses:
 *       204:
 *         description: Produto deletado com sucesso
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete("/:id", validarIdParam, produtoController.deletarProdutoPorId);

module.exports = router;
