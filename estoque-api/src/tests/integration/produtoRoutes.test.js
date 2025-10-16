const request = require("supertest");
const app = require("../../app");
const sequelize = require("../../config/database");
const Produto = require("../../models/produto");
const Categoria = require("../../models/categoria");
const Marca = require("../../models/marca");

beforeAll(async () => {
  await sequelize.sync({ force: true }); // recria tabelas em memória
});

afterAll(async () => {
  await sequelize.close(); // fecha conexão após testes
});

describe("Rotas de produtos", () => {
  let produtoId;
  let categoriaId;
  let marcaId;

  beforeEach(async () => {
    // Criar categoria e marca para os testes
    const categoria = await Categoria.create({ descricao: "Eletrônicos" });
    const marca = await Marca.create({ descricao: "Logitech" });
    categoriaId = categoria.id;
    marcaId = marca.id;
  });

  it("POST /produtos deve criar um produto", async () => {
    const res = await request(app).post("/produtos").send({
      nome: "Teclado",
      descricao: "Teclado mecânico ABNT2",
      preco: 150,
      quantidadeEmEstoque: 10,
      categoriaId: categoriaId,
      marcaId: marcaId,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    produtoId = res.body.id;
  });

  it("GET /produtos deve retornar array de produtos", async () => {
    const res = await request(app).get("/produtos");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });

  it("GET /produtos/:id deve retornar o produto criado", async () => {
    const res = await request(app).get(`/produtos/${produtoId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", produtoId);
    expect(res.body).toHaveProperty("nome", "Teclado");
    expect(res.body).toHaveProperty("quantidadeEmEstoque", 10);
  });

  it("PUT /produtos/:id deve atualizar o produto", async () => {
    const res = await request(app).put(`/produtos/${produtoId}`).send({
      nome: "Teclado Mecânico",
      descricao: "Teclado mecânico ABNT2 atualizado",
      preco: 200,
      quantidadeEmEstoque: 8,
      categoriaId: categoriaId,
      marcaId: marcaId,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.nome).toBe("Teclado Mecânico");
    expect(res.body.preco).toBe(200);
    expect(res.body.quantidadeEmEstoque).toBe(8);
  });

  it("DELETE /produtos/:id deve remover o produto", async () => {
    const res = await request(app).delete(`/produtos/${produtoId}`);

    expect(res.statusCode).toBe(204);

    const produto = await Produto.findByPk(produtoId);
    expect(produto).toBeNull();
  });

  it("GET /produtos/:id retorna 404 se produto não existir", async () => {
    const res = await request(app).get(`/produtos/${produtoId}`);
    expect(res.statusCode).toBe(404);
  });
});
