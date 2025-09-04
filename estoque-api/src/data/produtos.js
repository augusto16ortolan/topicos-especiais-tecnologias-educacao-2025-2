// Array que simula o banco de dados de produtos
const produtos = [
  {
    id: 1,
    nome: "Notebook X",
    descricao: "Intel i5, 8GB RAM",
    preco: 3500,
    quantidadeEmEstoque: 10,
    categoriaId: 1,
    marcaId: 1,
  },
  {
    id: 2,
    nome: "Teclado Mecânico",
    descricao: "RGB, Switch Blue",
    preco: 250,
    quantidadeEmEstoque: 15,
    categoriaId: 2,
    marcaId: 2,
  },
  {
    id: 3,
    nome: "Cadeira Gamer",
    descricao: "Ajustável, Preto",
    preco: 1200,
    quantidadeEmEstoque: 5,
    categoriaId: 3,
    marcaId: 3,
  },
  {
    id: 4,
    nome: "WebCam",
    descricao: "4K",
    preco: 800,
    quantidadeEmEstoque: 2,
    categoriaId: 4,
    marcaId: 4,
  },
];

module.exports = produtos;
