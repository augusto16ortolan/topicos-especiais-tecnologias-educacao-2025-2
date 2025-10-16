const produtoRepository = require("../repositories/produtoRepository");
const marcaRepository = require("../repositories/marcaRepository");
const categoriaRepository = require("../repositories/categoriaRepository");
const { validationResult } = require("express-validator");

//Listar todos os produtos
exports.listarProdutos = async (req, res) => {
  try {
    const produtos = await produtoRepository.buscarTodos();
    const totalProdutos = await produtoRepository.contar();

    const response = {
      pageSize: produtos.length,
      totalCount: totalProdutos,
      data: produtos,
    };

    res.json(response);
  } catch (error) {
    console.error("Erro ao listar produtos:", error);
    res.status(500).json({ 
      mensagem: "Erro interno do servidor ao listar produtos", 
      erro: error.message 
    });
  }
};

//Buscar um produto por id
exports.buscarProdutoPorId = async (req, res) => {
  try {
    const produtoId = parseInt(req.params.id);

    if (isNaN(produtoId)) {
      return res
        .status(400)
        .json({ mensagem: "Id inválido. Precisa ser um número" });
    }

    const produto = await produtoRepository.buscarPorId(produtoId);

    if (!produto) {
      return res
        .status(404)
        .json({ mensagem: `Produto com Id ${produtoId} não encontrado` });
    }

    res.json(produto);
  } catch (error) {
    console.error("Erro ao buscar produto por ID:", error);
    res.status(500).json({ 
      mensagem: "Erro interno do servidor ao buscar produto", 
      erro: error.message 
    });
  }
};

//Criar um novo produto
exports.criarProduto = async (req, res) => {
  try {
    // Verificar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        mensagem: "Dados inválidos",
        erros: errors.array()
      });
    }

    const { nome, descricao, preco, quantidadeEmEstoque, categoriaId, marcaId } = req.body;

    // Verificar se a marca existe
    const marca = await marcaRepository.buscarPorId(marcaId);
    if (!marca) {
      return res
        .status(400)
        .json({ mensagem: "A marca informada não existe" });
    }

    // Verificar se a categoria existe
    const categoria = await categoriaRepository.buscarPorId(categoriaId);
    if (!categoria) {
      return res
        .status(400)
        .json({ mensagem: "A categoria informada não existe" });
    }

    const produto = {
      nome,
      descricao,
      preco,
      quantidadeEmEstoque,
      categoriaId,
      marcaId,
    };

    const produtoCriado = await produtoRepository.criarProduto(produto);
    res.status(201).json(produtoCriado);
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    res.status(500).json({ 
      mensagem: "Erro interno do servidor ao criar produto", 
      erro: error.message 
    });
  }
};

//Atualiza um produto
exports.atualizarProduto = async (req, res) => {
  try {
    // Verificar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        mensagem: "Dados inválidos",
        erros: errors.array()
      });
    }

    const produtoId = parseInt(req.params.id);
    const { nome, descricao, preco, quantidadeEmEstoque, categoriaId, marcaId } = req.body;

    if (isNaN(produtoId)) {
      return res
        .status(400)
        .json({ mensagem: "Id inválido. Precisa ser um número" });
    }

    const produtoDoBanco = await produtoRepository.buscarPorId(produtoId);

    if (!produtoDoBanco) {
      return res
        .status(404)
        .json({ mensagem: `Produto com Id ${produtoId} não encontrado` });
    }

    // Verificar se a marca existe (se fornecida)
    if (marcaId) {
      const marca = await marcaRepository.buscarPorId(marcaId);
      if (!marca) {
        return res
          .status(400)
          .json({ mensagem: "A marca informada não existe" });
      }
    }

    // Verificar se a categoria existe (se fornecida)
    if (categoriaId) {
      const categoria = await categoriaRepository.buscarPorId(categoriaId);
      if (!categoria) {
        return res
          .status(400)
          .json({ mensagem: "A categoria informada não existe" });
      }
    }

    const produtoParaAtualizar = {
      id: produtoId,
      nome,
      descricao,
      preco,
      quantidadeEmEstoque,
      categoriaId,
      marcaId,
    };

    const produtoAtualizado = await produtoRepository.atualizarProduto(
      produtoParaAtualizar
    );

    res.status(200).json(produtoAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    res.status(500).json({ 
      mensagem: "Erro interno do servidor ao atualizar produto", 
      erro: error.message 
    });
  }
};

//Deletar um produto por id
exports.deletarProdutoPorId = async (req, res) => {
  try {
    const produtoId = parseInt(req.params.id);

    if (isNaN(produtoId)) {
      return res
        .status(400)
        .json({ mensagem: "Id inválido. Precisa ser um número" });
    }

    const produtoDoBanco = await produtoRepository.buscarPorId(produtoId);

    if (!produtoDoBanco) {
      return res
        .status(404)
        .json({ mensagem: `Produto com Id ${produtoId} não encontrado` });
    }

    await produtoRepository.deletarProduto(produtoId);
    return res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
    res.status(500).json({ 
      mensagem: "Erro interno do servidor ao deletar produto", 
      erro: error.message 
    });
  }
};
