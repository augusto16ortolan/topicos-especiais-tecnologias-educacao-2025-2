const categoriaRepository = require("../repositories/categoriaRepository");
const produtoRepository = require("../repositories/produtoRepository");
const { validationResult } = require("express-validator");

// Listar todas as categorias
exports.listarCategorias = async (req, res) => {
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
        console.error("Erro ao listar categorias:", error);
        res.status(500).json({ 
            mensagem: "Erro interno do servidor ao listar categorias", 
            erro: error.message 
        });
    }
};

// Buscar uma categoria por id
exports.buscarCategoriaPorId = async (req, res) => {
    try {
        const categoriaId = parseInt(req.params.id);

        if (isNaN(categoriaId)) {
            return res.status(400).json({ mensagem: "Id inválido. Precisa ser um número" });
        }

        const categoria = await categoriaRepository.buscarPorId(categoriaId);

        if (!categoria) {
            return res
                .status(404)
                .json({ mensagem: `Categoria com Id ${categoriaId} não encontrada` });
        }

        res.json(categoria);
    } catch (error) {
        console.error("Erro ao buscar categoria por ID:", error);
        res.status(500).json({ 
            mensagem: "Erro interno do servidor ao buscar categoria", 
            erro: error.message 
        });
    }
};

// Criar uma nova categoria
exports.criarCategoria = async (req, res) => {
    try {
        // Verificar erros de validação
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                mensagem: "Dados inválidos",
                erros: errors.array()
            });
        }

        const { descricao } = req.body;

        const categoriaCriada = await categoriaRepository.criarCategoria({ descricao });
        res.status(201).json(categoriaCriada);
    } catch (error) {
        console.error("Erro ao criar categoria:", error);
        res.status(500).json({ 
            mensagem: "Erro interno do servidor ao criar categoria", 
            erro: error.message 
        });
    }
};

// Atualizar categoria
exports.atualizarCategoria = async (req, res) => {
    try {
        // Verificar erros de validação
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                mensagem: "Dados inválidos",
                erros: errors.array()
            });
        }

        const categoriaId = parseInt(req.params.id);
        const { descricao } = req.body;

        if (isNaN(categoriaId)) {
            return res.status(400).json({ mensagem: "Id inválido. Precisa ser um número" });
        }

        const categoriaDoBanco = await categoriaRepository.buscarPorId(categoriaId);

        if (!categoriaDoBanco) {
            return res
                .status(404)
                .json({ mensagem: `Categoria com Id ${categoriaId} não encontrada` });
        }

        const categoriaAtualizada = await categoriaRepository.atualizarCategoria({
            id: categoriaId,
            descricao,
        });

        res.status(200).json(categoriaAtualizada);
    } catch (error) {
        console.error("Erro ao atualizar categoria:", error);
        res.status(500).json({ 
            mensagem: "Erro interno do servidor ao atualizar categoria", 
            erro: error.message 
        });
    }
};

// Deletar categoria
exports.deletarCategoriaPorId = async (req, res) => {
    try {
        const categoriaId = parseInt(req.params.id);

        if (isNaN(categoriaId)) {
            return res.status(400).json({ mensagem: "Id inválido. Precisa ser um número" });
        }

        const categoriaDoBanco = await categoriaRepository.buscarPorId(categoriaId);

        if (!categoriaDoBanco) {
            return res
                .status(404)
                .json({ mensagem: `Categoria com Id ${categoriaId} não encontrada` });
        }

        // Verificar se existem produtos vinculados
        const produtosVinculados = await produtoRepository.buscarPorCategoriaId(categoriaId);
        if (produtosVinculados.length > 0) {
            return res.status(400).json({ 
                mensagem: "Não é possível deletar a categoria, existem produtos vinculados" 
            });
        }

        await categoriaRepository.deletarCategoria(categoriaId);
        res.status(204).send();
    } catch (error) {
        console.error("Erro ao deletar categoria:", error);
        res.status(500).json({ 
            mensagem: "Erro interno do servidor ao deletar categoria", 
            erro: error.message 
        });
    }
};
