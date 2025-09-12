const produtoRepository = require("../repositories/produtoRepository");

//Listar todos os produtos
exports.listarProdutos = async (req, res) => {
  const produtos = await produtoRepository.buscarTodos();
  const totalProdutos = await produtoRepository.contar();

  const response = {
    pageSize: produtos.length,
    totalCount: totalProdutos,
    data: produtos,
  };

  res.json(response);
};

//Buscar um produto por id
exports.buscarProdutoPorId = async (req, res) => {
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
};

//Criar um novo produto
exports.criarProduto = async (req, res) => {
  const { nome, descricao, preco, quantidadeEmEstoque, categoriaId, marcaId } =
    req.body;

  //verificar se todos os valores obrigatorios estao preenchidos
  if (nome == null || descricao == null || preco == null) {
    return res
      .status(400)
      .json({ mensagem: "Todos os dados são obrigatórios" });
  }

  if (typeof preco !== "number" || preco <= 0) {
    return res.status(400).json({ mensagem: "O valor deve ser maior que 0" });
  }

  //validar se a quantidadeEmEstoque é um numero e é positiva
  //validar se existe uma marca com o marcaId enviado
  //validar se existe uma categoria com o categoriaId enviado

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
};

//Atualiza um produto
exports.atualizarProduto = async (req, res) => {
  const produtoId = parseInt(req.params.id);
  const { nome, descricao, preco, quantidadeEmEstoque, categoriaId, marcaId } =
    req.body;

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

  res.status(202).json(produtoAtualizado);
};

//Deletar um produto por id
exports.deletarProdutoPorId = async (req, res) => {
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
};
