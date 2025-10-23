const produtoRepository = require("../repositories/produtoRepository");
const marcaRepository = require("../repositories/marcaRepository");
const categoriaRepository = require("../repositories/categoriaRepository");
const { validationResult } = require("express-validator");

//Listar todos os produtos
exports.listarProdutos = async (req, res, next) => {
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
    error.publicMessage = 'Erro interno do servidor ao listar produtos';
    next(error);
  }
};

//Buscar um produto por id
exports.buscarProdutoPorId = async (req, res, next) => {
  try {
    const produtoId = parseInt(req.params.id);
    if (isNaN(produtoId)) {
      const error = new Error('Id inválido. Precisa ser um número');
      error.status = 400;
      error.publicMessage = 'Id inválido. Precisa ser um número';
      return next(error);
    }
    const produto = await produtoRepository.buscarPorId(produtoId);
    if (!produto) {
      const error = new Error(`Produto com Id ${produtoId} não encontrado`);
      error.status = 404;
      error.publicMessage = `Produto com Id ${produtoId} não encontrado`;
      return next(error);
    }
    res.json(produto);
  } catch (error) {
    error.publicMessage = 'Erro interno do servidor ao buscar produto';
    next(error);
  }
};

//Criar um novo produto
exports.criarProduto = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Dados inválidos');
      error.status = 400;
      error.publicMessage = 'Dados inválidos';
      error.validation = errors.array();
      return next(error);
    }
    const { nome, descricao, preco, quantidadeEmEstoque, categoriaId, marcaId } = req.body;
    const marca = await marcaRepository.buscarPorId(marcaId);
    if (!marca) {
      const error = new Error('A marca informada não existe');
      error.status = 400;
      error.publicMessage = 'A marca informada não existe';
      return next(error);
    }
    const categoria = await categoriaRepository.buscarPorId(categoriaId);
    if (!categoria) {
      const error = new Error('A categoria informada não existe');
      error.status = 400;
      error.publicMessage = 'A categoria informada não existe';
      return next(error);
    }
    const produto = { nome, descricao, preco, quantidadeEmEstoque, categoriaId, marcaId };
    const produtoCriado = await produtoRepository.criarProduto(produto);
    res.status(201).json(produtoCriado);
  } catch (error) {
    error.publicMessage = 'Erro interno do servidor ao criar produto';
    next(error);
  }
};

//Atualiza um produto
exports.atualizarProduto = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Dados inválidos');
      error.status = 400;
      error.publicMessage = 'Dados inválidos';
      error.validation = errors.array();
      return next(error);
    }
    const produtoId = parseInt(req.params.id);
    const { nome, descricao, preco, quantidadeEmEstoque, categoriaId, marcaId } = req.body;
    if (isNaN(produtoId)) {
      const error = new Error('Id inválido. Precisa ser um número');
      error.status = 400;
      error.publicMessage = 'Id inválido. Precisa ser um número';
      return next(error);
    }
    const produtoDoBanco = await produtoRepository.buscarPorId(produtoId);
    if (!produtoDoBanco) {
      const error = new Error(`Produto com Id ${produtoId} não encontrado`);
      error.status = 404;
      error.publicMessage = `Produto com Id ${produtoId} não encontrado`;
      return next(error);
    }
    if (marcaId) {
      const marca = await marcaRepository.buscarPorId(marcaId);
      if (!marca) {
        const error = new Error('A marca informada não existe');
        error.status = 400;
        error.publicMessage = 'A marca informada não existe';
        return next(error);
      }
    }
    if (categoriaId) {
      const categoria = await categoriaRepository.buscarPorId(categoriaId);
      if (!categoria) {
        const error = new Error('A categoria informada não existe');
        error.status = 400;
        error.publicMessage = 'A categoria informada não existe';
        return next(error);
      }
    }
    const produtoParaAtualizar = { id: produtoId, nome, descricao, preco, quantidadeEmEstoque, categoriaId, marcaId };
    const produtoAtualizado = await produtoRepository.atualizarProduto(produtoParaAtualizar);
    res.status(200).json(produtoAtualizado);
  } catch (error) {
    error.publicMessage = 'Erro interno do servidor ao atualizar produto';
    next(error);
  }
};

//Deletar um produto por id
exports.deletarProdutoPorId = async (req, res, next) => {
  try {
    const produtoId = parseInt(req.params.id);
    if (isNaN(produtoId)) {
      const error = new Error('Id inválido. Precisa ser um número');
      error.status = 400;
      error.publicMessage = 'Id inválido. Precisa ser um número';
      return next(error);
    }
    const produtoDoBanco = await produtoRepository.buscarPorId(produtoId);
    if (!produtoDoBanco) {
      const error = new Error(`Produto com Id ${produtoId} não encontrado`);
      error.status = 404;
      error.publicMessage = `Produto com Id ${produtoId} não encontrado`;
      return next(error);
    }
    await produtoRepository.deletarProduto(produtoId);
    return res.status(204).send();
  } catch (error) {
    error.publicMessage = 'Erro interno do servidor ao deletar produto';
    next(error);
  }
};
