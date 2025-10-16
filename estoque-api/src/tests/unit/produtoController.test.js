const produtoController = require("../../controllers/produtoController");
const produtoRepository = require("../../repositories/produtoRepository");
const { validationResult } = require("express-validator");

// Mock do express-validator
jest.mock("express-validator", () => ({
  validationResult: jest.fn(),
}));

// Mock da response do Express
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe("Produto Controller - Unitários", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===============================
  // listarProdutos
  // ===============================
  it("listarProdutos deve retornar array de produtos", async () => {
    const res = mockResponse();

    produtoRepository.buscarTodos = jest
      .fn()
      .mockResolvedValue([{ id: 1, nome: "Teclado" }]);
    produtoRepository.contar = jest.fn().mockResolvedValue(1);

    await produtoController.listarProdutos({}, res);

    expect(produtoRepository.buscarTodos).toHaveBeenCalled();
    expect(produtoRepository.contar).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      pageSize: 1,
      totalCount: 1,
      data: [{ id: 1, nome: "Teclado" }],
    });
  });

  // ===============================
  // buscarProdutoPorId
  // ===============================
  it("buscarProdutoPorId deve retornar produto existente", async () => {
    const res = mockResponse();
    const req = { params: { id: "1" } };

    produtoRepository.buscarPorId = jest
      .fn()
      .mockResolvedValue({ id: 1, nome: "Teclado" });

    await produtoController.buscarProdutoPorId(req, res);

    expect(res.json).toHaveBeenCalledWith({ id: 1, nome: "Teclado" });
  });

  it("buscarProdutoPorId deve retornar 404 se produto não existir", async () => {
    const res = mockResponse();
    const req = { params: { id: "1" } };

    produtoRepository.buscarPorId = jest.fn().mockResolvedValue(null);

    await produtoController.buscarProdutoPorId(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      mensagem: "Produto com Id 1 não encontrado",
    });
  });

  it("buscarProdutoPorId deve retornar 400 se id inválido", async () => {
    const res = mockResponse();
    const req = { params: { id: "abc" } };

    await produtoController.buscarProdutoPorId(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      mensagem: "Id inválido. Precisa ser um número",
    });
  });

  // ===============================
  // criarProduto
  // ===============================
  it("criarProduto deve criar produto corretamente", async () => {
    const res = mockResponse();
    const req = {
      body: {
        nome: "Teclado",
        descricao: "Teclado mecânico",
        preco: 150,
        quantidadeEmEstoque: 10,
        categoriaId: 1,
        marcaId: 1,
      },
    };

    // Mock validationResult para retornar sem erros
    validationResult.mockReturnValue({
      isEmpty: () => true,
      array: () => []
    });

    // Mock dos repositories
    produtoRepository.criarProduto = jest.fn().mockResolvedValue(req.body);
    const marcaRepository = require("../../repositories/marcaRepository");
    const categoriaRepository = require("../../repositories/categoriaRepository");
    marcaRepository.buscarPorId = jest.fn().mockResolvedValue({ id: 1, descricao: "Marca Test" });
    categoriaRepository.buscarPorId = jest.fn().mockResolvedValue({ id: 1, descricao: "Categoria Test" });

    await produtoController.criarProduto(req, res);

    expect(produtoRepository.criarProduto).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(req.body);
  });

  it("criarProduto deve retornar 400 se dados obrigatórios faltarem", async () => {
    const res = mockResponse();
    const req = { body: { nome: "Teclado" } };

    // Mock validationResult para retornar erros de validação
    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [
        { msg: "Descrição é obrigatória", param: "descricao", location: "body" },
        { msg: "Preço é obrigatório", param: "preco", location: "body" }
      ]
    });

    await produtoController.criarProduto(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      mensagem: "Dados inválidos",
      erros: [
        { msg: "Descrição é obrigatória", param: "descricao", location: "body" },
        { msg: "Preço é obrigatório", param: "preco", location: "body" }
      ]
    });
  });

  it("criarProduto deve retornar 400 se preço inválido", async () => {
    const res = mockResponse();
    const req = {
      body: {
        nome: "Teclado",
        descricao: "desc",
        preco: -5,
        quantidadeEmEstoque: 10,
        categoriaId: 1,
        marcaId: 1,
      },
    };

    // Mock validationResult para retornar erros de validação
    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [
        { msg: "Preço deve ser um número maior que 0", param: "preco", location: "body" }
      ]
    });

    await produtoController.criarProduto(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      mensagem: "Dados inválidos",
      erros: [
        { msg: "Preço deve ser um número maior que 0", param: "preco", location: "body" }
      ]
    });
  });

  // ===============================
  // atualizarProduto
  // ===============================
  it("atualizarProduto deve atualizar produto corretamente", async () => {
    const res = mockResponse();
    const req = {
      params: { id: "1" },
      body: {
        nome: "Teclado Novo",
        descricao: "desc",
        preco: 200,
        quantidadeEmEstoque: 5,
        categoriaId: 1,
        marcaId: 1,
      },
    };

    // Mock validationResult para retornar sem erros
    validationResult.mockReturnValue({
      isEmpty: () => true,
      array: () => []
    });

    // Mock dos repositories
    produtoRepository.buscarPorId = jest.fn().mockResolvedValue({ id: 1 });
    produtoRepository.atualizarProduto = jest.fn().mockResolvedValue(req.body);
    const marcaRepository = require("../../repositories/marcaRepository");
    const categoriaRepository = require("../../repositories/categoriaRepository");
    marcaRepository.buscarPorId = jest.fn().mockResolvedValue({ id: 1, descricao: "Marca Test" });
    categoriaRepository.buscarPorId = jest.fn().mockResolvedValue({ id: 1, descricao: "Categoria Test" });

    await produtoController.atualizarProduto(req, res);

    expect(produtoRepository.atualizarProduto).toHaveBeenCalledWith({
      id: 1,
      ...req.body,
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(req.body);
  });

  it("atualizarProduto deve retornar 404 se produto não existir", async () => {
    const res = mockResponse();
    const req = { params: { id: "1" }, body: {} };

    produtoRepository.buscarPorId = jest.fn().mockResolvedValue(null);

    await produtoController.atualizarProduto(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("atualizarProduto deve retornar 400 se id inválido", async () => {
    const res = mockResponse();
    const req = { params: { id: "abc" }, body: {} };

    await produtoController.atualizarProduto(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  // ===============================
  // deletarProdutoPorId
  // ===============================
  it("deletarProdutoPorId deve remover produto corretamente", async () => {
    const res = mockResponse();
    const req = { params: { id: "1" } };

    produtoRepository.buscarPorId = jest.fn().mockResolvedValue({ id: 1 });
    produtoRepository.deletarProduto = jest.fn().mockResolvedValue();

    await produtoController.deletarProdutoPorId(req, res);

    expect(produtoRepository.deletarProduto).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it("deletarProdutoPorId deve retornar 404 se produto não existir", async () => {
    const res = mockResponse();
    const req = { params: { id: "1" } };

    produtoRepository.buscarPorId = jest.fn().mockResolvedValue(null);

    await produtoController.deletarProdutoPorId(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("deletarProdutoPorId deve retornar 400 se id inválido", async () => {
    const res = mockResponse();
    const req = { params: { id: "abc" } };

    await produtoController.deletarProdutoPorId(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});
