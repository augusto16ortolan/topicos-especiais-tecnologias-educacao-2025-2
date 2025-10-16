const { body, param } = require("express-validator");

// Validators para criação de marca
const validarCriacaoMarca = [
  body("descricao")
    .notEmpty()
    .withMessage("Descrição é obrigatória")
    .isLength({ min: 2, max: 100 })
    .withMessage("Descrição deve ter entre 2 e 100 caracteres")
    .trim(),
];

// Validators para atualização de marca
const validarAtualizacaoMarca = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("ID deve ser um número inteiro maior que 0"),

  body("descricao")
    .notEmpty()
    .withMessage("Descrição é obrigatória")
    .isLength({ min: 2, max: 100 })
    .withMessage("Descrição deve ter entre 2 e 100 caracteres")
    .trim(),
];

// Validators para parâmetros de ID
const validarIdParam = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("ID deve ser um número inteiro maior que 0"),
];

module.exports = {
  validarCriacaoMarca,
  validarAtualizacaoMarca,
  validarIdParam,
};
