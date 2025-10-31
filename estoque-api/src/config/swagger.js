const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de controle de estoque",
      version: "1.0.0",
      description:
        "Documentação completa em Swagger da API de controle de estoque",
      termsOfService: "https://example.com/terms/",
      contact: {
        name: "API Support",
        url: "https://www.example.com/support",
        email: "support@example.com",
      },
      license: {
        name: "Apache 2.0",
        url: "https://www.apache.org/licenses/LICENSE-2.0.html",
      },
    },
  },
  apis: [path.join(__dirname, "../routes/*.js")],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = {
  swaggerUI,
  swaggerSpec,
};
