const categoriaRepository = require("../repositories/categoriaRepository");
const produtoRepository = require("../repositories/produtoRepository");

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
        res.status(500).json({ mensagem: "Erro ao listar categorias", erro: error.message });
    }
};

// Buscar uma categoria por id
exports.buscarCategoriaPorId = async (req, res) => {
    const categoriaId = parseInt(req.params.id);

    if (isNaN(categoriaId)) {
        return res.status(400).json({ mensagem: "Id inválido. Precisa ser um número" });
    }

    try {
        const categoria = await categoriaRepository.buscarPorId(categoriaId);

        if (!categoria) {
            return res
                .status(404)
                .json({ mensagem: `Categoria com Id ${categoriaId} não encontrada` });
        }

        res.json(categoria);
    } catch (error) {
        res.status(500).json({ mensagem: "Erro ao buscar categoria", erro: error.message });
    }
};

// Criar uma nova categoria
exports.criarCategoria = async (req, res) => {
    const { descricao } = req.body;

    if (!descricao) {
        return res.status(400).json({ mensagem: "Descrição da categoria é obrigatório" });
    }

    try {
        const categoriaCriada = await categoriaRepository.criarCategoria({ descricao });
        res.status(201).json(categoriaCriada);
    } catch (error) {
        res.status(500).json({ mensagem: "Erro ao criar categoria", erro: error.message });
    }
};

// Atualizar categoria
exports.atualizarCategoria = async (req, res) => {
    const categoriaId = parseInt(req.params.id);
    const { descricao } = req.body;

    if (isNaN(categoriaId)) {
        return res.status(400).json({ mensagem: "Id inválido. Precisa ser um número" });
    }

    try {
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
        res.status(500).json({ mensagem: "Erro ao atualizar categoria", erro: error.message });
    }
};

// Deletar categoria
exports.deletarCategoriaPorId = async (req, res) => {
    const categoriaId = parseInt(req.params.id);

    if (isNaN(categoriaId)) {
        return res.status(400).json({ mensagem: "Id inválido. Precisa ser um número" });
    }

    try {
        const categoriaDoBanco = await categoriaRepository.buscarPorId(categoriaId);

        if (!categoriaDoBanco) {
            return res
                .status(404)
                .json({ mensagem: `Categoria com Id ${categoriaId} não encontrada` });
        }

        // Verificar se existem produtos vinculados
        const produtosVinculados = await produtoRepository.buscarPorCategoriaId(categoriaId);
        if (produtosVinculados.length > 0) {
            return res.status(400).json({ mensagem: "Não é possível deletar a categoria, existem produtos vinculados" });
        }

        await categoriaRepository.deletarCategoria(categoriaId);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ mensagem: "Erro ao deletar categoria", erro: error.message });
    }
};
