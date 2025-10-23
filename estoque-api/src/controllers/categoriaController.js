const categoriaRepository = require("../repositories/categoriaRepository");
const produtoRepository = require("../repositories/produtoRepository");
const { validationResult } = require("express-validator");

// Listar todas as categorias
exports.listarCategorias = async (req, res, next) => {
    try {
        const categorias = await categoriaRepository.buscarTodos();
        const totalCategorias = await categoriaRepository.contar();
        const response = {
            pageSize: categorias.length,
            totalCount: totalCategorias,
            data: categorias,
        };
        res.json(response);
    } catch (error) {
        error.publicMessage = "Erro interno do servidor ao listar categorias";
        next(error);
    }
};

// Buscar uma categoria por id
exports.buscarCategoriaPorId = async (req, res, next) => {
    try {
        const categoriaId = parseInt(req.params.id);
        if (isNaN(categoriaId)) {
            const error = new Error("Id inválido. Precisa ser um número");
            error.status = 400;
            error.publicMessage = "Id inválido. Precisa ser um número";
            return next(error);
        }
        const categoria = await categoriaRepository.buscarPorId(categoriaId);
        if (!categoria) {
            const error = new Error(`Categoria com Id ${categoriaId} não encontrada`);
            error.status = 404;
            error.publicMessage = `Categoria com Id ${categoriaId} não encontrada`;
            return next(error);
        }
        res.json(categoria);
    } catch (error) {
        error.publicMessage = "Erro interno do servidor ao buscar categoria";
        next(error);
    }
};

// Criar uma nova categoria
exports.criarCategoria = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error("Dados inválidos");
            error.status = 400;
            error.publicMessage = "Dados inválidos";
            error.validation = errors.array();
            return next(error);
        }
        const { descricao } = req.body;
        const categoriaCriada = await categoriaRepository.criarCategoria({ descricao });
        res.status(201).json(categoriaCriada);
    } catch (error) {
        error.publicMessage = "Erro interno do servidor ao criar categoria";
        next(error);
    }
};

// Atualizar categoria
exports.atualizarCategoria = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error("Dados inválidos");
            error.status = 400;
            error.publicMessage = "Dados inválidos";
            error.validation = errors.array();
            return next(error);
        }
        const categoriaId = parseInt(req.params.id);
        const { descricao } = req.body;
        if (isNaN(categoriaId)) {
            const error = new Error("Id inválido. Precisa ser um número");
            error.status = 400;
            error.publicMessage = "Id inválido. Precisa ser um número";
            return next(error);
        }
        const categoriaDoBanco = await categoriaRepository.buscarPorId(categoriaId);
        if (!categoriaDoBanco) {
            const error = new Error(`Categoria com Id ${categoriaId} não encontrada`);
            error.status = 404;
            error.publicMessage = `Categoria com Id ${categoriaId} não encontrada`;
            return next(error);
        }
        const categoriaAtualizada = await categoriaRepository.atualizarCategoria({ id: categoriaId, descricao });
        res.status(200).json(categoriaAtualizada);
    } catch (error) {
        error.publicMessage = "Erro interno do servidor ao atualizar categoria";
        next(error);
    }
};

// Deletar categoria
exports.deletarCategoriaPorId = async (req, res, next) => {
    try {
        const categoriaId = parseInt(req.params.id);
        if (isNaN(categoriaId)) {
            const error = new Error("Id inválido. Precisa ser um número");
            error.status = 400;
            error.publicMessage = "Id inválido. Precisa ser um número";
            return next(error);
        }
        const categoriaDoBanco = await categoriaRepository.buscarPorId(categoriaId);
        if (!categoriaDoBanco) {
            const error = new Error(`Categoria com Id ${categoriaId} não encontrada`);
            error.status = 404;
            error.publicMessage = `Categoria com Id ${categoriaId} não encontrada`;
            return next(error);
        }
        const produtosVinculados = await produtoRepository.buscarPorCategoriaId(categoriaId);
        if (produtosVinculados.length > 0) {
            const error = new Error("Não é possível deletar a categoria, existem produtos vinculados");
            error.status = 400;
            error.publicMessage = "Não é possível deletar a categoria, existem produtos vinculados";
            return next(error);
        }
        await categoriaRepository.deletarCategoria(categoriaId);
        res.status(204).send();
    } catch (error) {
        error.publicMessage = "Erro interno do servidor ao deletar categoria";
        next(error);
    }
};
