const marcaRepository = require("../repositories/marcaRepository");
const produtoRepository = require("../repositories/produtoRepository");
const { validationResult } = require("express-validator");

// Listar todas as marcas
exports.listarMarcas = async (req, res) => {
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
        console.error("Erro ao listar marcas:", error);
        res.status(500).json({ 
            mensagem: "Erro interno do servidor ao listar marcas", 
            erro: error.message 
        });
    }
};

// Buscar uma marca por id
exports.buscarMarcaPorId = async (req, res) => {
    try {
        const marcaId = parseInt(req.params.id);

        if (isNaN(marcaId)) {
            return res.status(400).json({ mensagem: "Id inválido. Precisa ser um número" });
        }

        const marca = await marcaRepository.buscarPorId(marcaId);

        if (!marca) {
            return res.status(404).json({ mensagem: `Marca com Id ${marcaId} não encontrada` });
        }

        res.json(marca);
    } catch (error) {
        console.error("Erro ao buscar marca por ID:", error);
        res.status(500).json({ 
            mensagem: "Erro interno do servidor ao buscar marca", 
            erro: error.message 
        });
    }
};

// Criar uma nova marca
exports.criarMarca = async (req, res) => {
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

        const marcaCriada = await marcaRepository.criarMarca({ descricao });
        res.status(201).json(marcaCriada);
    } catch (error) {
        console.error("Erro ao criar marca:", error);
        res.status(500).json({ 
            mensagem: "Erro interno do servidor ao criar marca", 
            erro: error.message 
        });
    }
};

// Atualizar marca
exports.atualizarMarca = async (req, res) => {
    try {
        // Verificar erros de validação
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                mensagem: "Dados inválidos",
                erros: errors.array()
            });
        }

        const marcaId = parseInt(req.params.id);
        const { descricao } = req.body;

        if (isNaN(marcaId)) {
            return res.status(400).json({ mensagem: "Id inválido. Precisa ser um número" });
        }

        const marcaDoBanco = await marcaRepository.buscarPorId(marcaId);

        if (!marcaDoBanco) {
            return res.status(404).json({ mensagem: `Marca com Id ${marcaId} não encontrada` });
        }

        const marcaAtualizada = await marcaRepository.atualizarMarca({ id: marcaId, descricao });
        res.status(200).json(marcaAtualizada);
    } catch (error) {
        console.error("Erro ao atualizar marca:", error);
        res.status(500).json({ 
            mensagem: "Erro interno do servidor ao atualizar marca", 
            erro: error.message 
        });
    }
};

// Deletar marca
exports.deletarMarcaPorId = async (req, res) => {
    try {
        const marcaId = parseInt(req.params.id);

        if (isNaN(marcaId)) {
            return res.status(400).json({ mensagem: "Id inválido. Precisa ser um número" });
        }

        const marcaDoBanco = await marcaRepository.buscarPorId(marcaId);

        if (!marcaDoBanco) {
            return res.status(404).json({ mensagem: `Marca com Id ${marcaId} não encontrada` });
        }

        // Verificar se existem produtos vinculados
        const produtosVinculados = await produtoRepository.buscarPorMarcaId(marcaId);
        if (produtosVinculados.length > 0) {
            return res.status(400).json({ 
                mensagem: "Não é possível deletar a marca, existem produtos vinculados" 
            });
        }

        await marcaRepository.deletarMarca(marcaId);
        res.status(204).send();
    } catch (error) {
        console.error("Erro ao deletar marca:", error);
        res.status(500).json({ 
            mensagem: "Erro interno do servidor ao deletar marca", 
            erro: error.message 
        });
    }
};

