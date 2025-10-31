const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Endpoints para autenticação e registro de usuários
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - nome
 *         - email
 *         - senha
 *       properties:
 *         id:
 *           type: integer
 *           description: ID do usuário
 *         nome:
 *           type: string
 *           description: Nome do usuário
 *           minLength: 2
 *           maxLength: 100
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário
 *         senha:
 *           type: string
 *           minLength: 8
 *           description: Senha do usuário
 *       example:
 *         id: 1
 *         nome: "João Silva"
 *         email: "joao@email.com"
 *         senha: "senha123"
 *     
 *     UsuarioResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID do usuário
 *         nome:
 *           type: string
 *           description: Nome do usuário
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário
 *       example:
 *         id: 1
 *         nome: "João Silva"
 *         email: "joao@email.com"
 *     
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - senha
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário
 *           example: "joao@email.com"
 *         senha:
 *           type: string
 *           description: Senha do usuário
 *           example: "senha123"
 *     
 *     AuthResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: JWT token para autenticação
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         usuario:
 *           $ref: '#/components/schemas/UsuarioResponse'
 *     
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         mensagem:
 *           type: string
 *           description: Mensagem de erro
 *           example: "Email e senha são obrigatórios"
 *         erro:
 *           type: string
 *           description: Detalhes do erro (opcional)
 *           example: "Validation error"
 *   
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: "Insira o token JWT no formato: Bearer {token}"
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza login do usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           example:
 *             email: "joao@email.com"
 *             senha: "senha123"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *             example:
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               usuario:
 *                 id: 1
 *                 nome: "João Silva"
 *                 email: "joao@email.com"
 *       400:
 *         description: Dados obrigatórios não fornecidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               mensagem: "Email e senha são obrigatórios"
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               mensagem: "Credenciais inválidas"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               mensagem: "Ocorreu um erro ao autenticar. Tente novamente mais tarde."
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /auth/registrar:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - senha
 *             properties:
 *               nome:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 description: Nome do usuário
 *                 example: "João Silva"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do usuário
 *                 example: "joao@email.com"
 *               senha:
 *                 type: string
 *                 minLength: 8
 *                 description: Senha do usuário
 *                 example: "senha123"
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *             example:
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               usuario:
 *                 id: 1
 *                 nome: "João Silva"
 *                 email: "joao@email.com"
 *       400:
 *         description: Dados inválidos ou senha muito curta
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               campos_obrigatorios:
 *                 summary: Campos obrigatórios
 *                 value:
 *                   mensagem: "Nome, email e senha são obrigatórios"
 *               senha_curta:
 *                 summary: Senha muito curta
 *                 value:
 *                   mensagem: "A senha deve conter 8 ou mais caracteres"
 *       401:
 *         description: Email já utilizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               mensagem: "Email já utilizado"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               mensagem: "Erro ao cadastrar usuário"
 *               erro: "Database connection error"
 */
router.post('/registrar', authController.registrar);

module.exports = router;