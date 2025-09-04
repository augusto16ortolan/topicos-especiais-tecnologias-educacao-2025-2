const produtos = require("../data/produtos");

//Listar todos os produtos
exports.listarProdutos = (req, res) => {
  const response = {
    pageSize: produtos.length,
    totalCount: 100,
    data: produtos,
  };

  res.json(response);
};

//Buscar um produto por id
exports.buscarProdutoPorId = (req, res) => {
  const produtoId = parseInt(req.params.id);

  if (isNaN(produtoId)) {
    return res
      .status(400)
      .json({ mensagem: "Id inválido. Precisa ser um número" });
  }

  const produto = produtos.find((p) => p.id == produtoId);

  if (!produto) {
    return res
      .status(404)
      .json({ mensagem: `Produto com Id ${produtoId} não encontrado` });
  }

  res.json(produto);
};

//Criar um novo produto
exports.criarProduto = (req, res) => {
  console.log(req.data);
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
    id: produtos.length + 1,
    nome,
    descricao,
    preco,
    quantidadeEmEstoque,
    categoriaId,
    marcaId,
  };
  produtos.push(produto);
  res.status(201).json(produto);
};

//Deletar um produto por id
exports.deletarProdutoPorId = (req, res) => {
  const produtoId = parseInt(req.params.id);

  if (isNaN(produtoId)) {
    return res
      .status(400)
      .json({ mensagem: "Id inválido. Precisa ser um número" });
  }

  const index = produtos.findIndex((p) => p.id === produtoId);

  if (index === -1) {
    return res
      .status(404)
      .json({ mensagem: `Produto com Id ${produtoId} não encontrado` });
  }

  produtos.splice(index, 1);

  return res.status(204).send();
};
