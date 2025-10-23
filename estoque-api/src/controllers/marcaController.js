const marcaRepository = require("../repositories/marcaRepository");
const produtoRepository = require("../repositories/produtoRepository");
const { validationResult } = require("express-validator");

// Listar todas as marcas
exports.listarMarcas = async (req, res, next) => {
    try {
        const marcas = await marcaRepository.buscarTodos();
        const totalMarcas = await marcaRepository.contar();
        const response = {
            pageSize: marcas.length,
            totalCount: totalMarcas,
            data: marcas,
        };
        res.json(response);
    } catch (error) {
        error.publicMessage = "Erro interno do servidor ao listar marcas";
        next(error);
    }
};

// Buscar uma marca por id
exports.buscarMarcaPorId = async (req, res, next) => {
    try {
        const marcaId = parseInt(req.params.id);
        if (isNaN(marcaId)) {
            const error = new Error("Id inválido. Precisa ser um número");
            error.status = 400;
            error.publicMessage = "Id inválido. Precisa ser um número";
            return next(error);
        }
        const marca = await marcaRepository.buscarPorId(marcaId);
        if (!marca) {
            const error = new Error(`Marca com Id ${marcaId} não encontrada`);
            error.status = 404;
            error.publicMessage = `Marca com Id ${marcaId} não encontrada`;
            return next(error);
        }
        res.json(marca);
    } catch (error) {
        error.publicMessage = "Erro interno do servidor ao buscar marca";
        next(error);
    }
};

// Criar uma nova marca
exports.criarMarca = async (req, res, next) => {
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
        const marcaCriada = await marcaRepository.criarMarca({ descricao });
        res.status(201).json(marcaCriada);
    } catch (error) {
        error.publicMessage = "Erro interno do servidor ao criar marca";
        next(error);
    }
};

// Atualizar marca
exports.atualizarMarca = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error("Dados inválidos");
            error.status = 400;
            error.publicMessage = "Dados inválidos";
            error.validation = errors.array();
            return next(error);
        }
        const marcaId = parseInt(req.params.id);
        const { descricao } = req.body;
        if (isNaN(marcaId)) {
            const error = new Error("Id inválido. Precisa ser um número");
            error.status = 400;
            error.publicMessage = "Id inválido. Precisa ser um número";
            return next(error);
        }
        const marcaDoBanco = await marcaRepository.buscarPorId(marcaId);
        if (!marcaDoBanco) {
            const error = new Error(`Marca com Id ${marcaId} não encontrada`);
            error.status = 404;
            error.publicMessage = `Marca com Id ${marcaId} não encontrada`;
            return next(error);
        }
        const marcaAtualizada = await marcaRepository.atualizarMarca({ id: marcaId, descricao });
        res.status(200).json(marcaAtualizada);
    } catch (error) {
        error.publicMessage = "Erro interno do servidor ao atualizar marca";
        next(error);
    }
};

// Deletar marca
exports.deletarMarcaPorId = async (req, res, next) => {
    try {
        const marcaId = parseInt(req.params.id);
        if (isNaN(marcaId)) {
            const error = new Error("Id inválido. Precisa ser um número");
            error.status = 400;
            error.publicMessage = "Id inválido. Precisa ser um número";
            return next(error);
        }
        const marcaDoBanco = await marcaRepository.buscarPorId(marcaId);
        if (!marcaDoBanco) {
            const error = new Error(`Marca com Id ${marcaId} não encontrada`);
            error.status = 404;
            error.publicMessage = `Marca com Id ${marcaId} não encontrada`;
            return next(error);
        }
        const produtosVinculados = await produtoRepository.buscarPorMarcaId(marcaId);
        if (produtosVinculados.length > 0) {
            const error = new Error("Não é possível deletar a marca, existem produtos vinculados");
            error.status = 400;
            error.publicMessage = "Não é possível deletar a marca, existem produtos vinculados";
            return next(error);
        }
        await marcaRepository.deletarMarca(marcaId);
        res.status(204).send();
    } catch (error) {
        error.publicMessage = "Erro interno do servidor ao deletar marca";
        next(error);
    }
};

