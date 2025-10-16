const { body, param } = require("express-validator");

// Validators para criação de produto
const validarCriacaoProduto = [
  body("nome")
    .notEmpty()
    .withMessage("Nome é obrigatório")
    .isLength({ min: 2, max: 100 })
    .withMessage("Nome deve ter entre 2 e 100 caracteres")
    .trim(),

  body("descricao")
    .notEmpty()
    .withMessage("Descrição é obrigatória")
    .isLength({ min: 5, max: 500 })
    .withMessage("Descrição deve ter entre 5 e 500 caracteres")
    .trim(),

  body("preco")
    .notEmpty()
    .withMessage("Preço é obrigatório")
    .isFloat({ min: 0.01 })
    .withMessage("Preço deve ser um número maior que 0"),

  body("quantidadeEmEstoque")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Quantidade em estoque deve ser um número inteiro maior ou igual a 0"),

  body("categoriaId")
    .notEmpty()
    .withMessage("ID da categoria é obrigatório")
    .isInt({ min: 1 })
    .withMessage("ID da categoria deve ser um número inteiro maior que 0"),

  body("marcaId")
    .notEmpty()
    .withMessage("ID da marca é obrigatório")
    .isInt({ min: 1 })
    .withMessage("ID da marca deve ser um número inteiro maior que 0"),
];

// Validators para atualização de produto
const validarAtualizacaoProduto = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("ID deve ser um número inteiro maior que 0"),

  body("nome")
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage("Nome deve ter entre 2 e 100 caracteres")
    .trim(),

  body("descricao")
    .optional()
    .isLength({ min: 5, max: 500 })
    .withMessage("Descrição deve ter entre 5 e 500 caracteres")
    .trim(),

  body("preco")
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage("Preço deve ser um número maior que 0"),

  body("quantidadeEmEstoque")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Quantidade em estoque deve ser um número inteiro maior ou igual a 0"),

  body("categoriaId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("ID da categoria deve ser um número inteiro maior que 0"),

  body("marcaId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("ID da marca deve ser um número inteiro maior que 0"),
];

// Validators para parâmetros de ID
const validarIdParam = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("ID deve ser um número inteiro maior que 0"),
];

module.exports = {
  validarCriacaoProduto,
  validarAtualizacaoProduto,
  validarIdParam,
};
