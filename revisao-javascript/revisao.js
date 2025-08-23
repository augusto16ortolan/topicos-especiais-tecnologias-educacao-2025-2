const axios = require("axios");
// console é utilizado para debug da aplicacao
/*console.log("Olá, mundo!");
console.error("Ocorreu um erro!");
console.warn("Atencao");
console.table([
  { nome: "augusto", idade: 24 },
  { nome: "joao", idade: 35 },
]);*/

//Tipagens e verificacao de tipos
/*nome = "Augusto"; //texto - string
idade = 24; //numerico - number
ativo = true; //condicao - boolean
lista = []; //lista, vetor - array
objeto = { nome, idade }; //objeto - object

console.log(typeof nome);
console.log(typeof idade);
console.log(typeof ativo);
console.log(typeof lista);
console.log(typeof objeto);
console.log(Array.isArray(lista));
console.log(Array.isArray(objeto));*/

//Definicoes de variáveis
/*var nome = "Augusto";
let idade = 24;

//Depois de inicializada, ela nao pode ser alterada
const DATA_NASCIMENTO = "16/03/2001";

//Let respeita o escopo do código, nao modifica quando entra em outro bloco
//Var é modificada mesmo em outro bloco
let x = 10;
if (idade == 24) {
  let x = 5;
  console.log(x);
}
console.log(x);
*/

//Estruturas de condicao
//if, else if, else e switch
/*idade = 5;

if (idade >= 18) {
  console.log("Voce é adulto");
} else if (idade >= 14) {
  console.log("Voce é adolescente");
} else {
  console.log("Voce é crianca");
}

idade = 15;
nome = "joao";

//&& = and
//|| = or
//podem haver várias condicoes juntas
if (idade >= 18 && nome == "joao") {
}*/

//Switch é utilizado apenas com valores estáticos
/*valor = 3;
switch (valor) {
  case 1:
    console.log("Caiu no valor 1");
    break;
  case 2:
    console.log("Caiu no valor 2");
    break;
  default:
    console.log("Nao localizou nenhum valor correspondente");
}
*/

//Estruturas / Laços de repeticao
// for (for loop, for in, for of), while
// for = utilizado para quando temos o tamanho do dado que queremos percorrer
// while = utilizado para quando nao sabemos o tamanho do dado

//for loop / for each
/*for (i = 0; i < 10; i++) {
  console.log(i);
}

lista = [122, 2434, 35352, 42313, 55787];
for (i = 0; i < lista.length; i++) {
  console.log(lista[i]);
}
*/

//for in
/*objeto = { nome: "joao", idade: 18, genero: "M" };
for (atributo in objeto) {
  console.log(atributo, objeto[atributo]);
}*/

//for of
/*lista = ["asas", "hhghf", "adads", "lkljk"];
for (valor of lista) {
  console.log(valor);
}*/

//while, sempre vai precisar de uma condicao
/*contador = 0;
while (contador <= 18) {
  console.log(contador);
  contador++;
}*/

//Funcoes = function
//acoes que queremos organizar de uma mais pratica e separada no codigo
//reutilizacao de codigo

//funcao sem retorno
/*function digaOla(saudacao = "Ola") {
  console.log(saudacao);
}

digaOla("hi");
digaOla("hello");
digaOla("bom dia");
digaOla("oi");
digaOla("opa");

//funcao com parametros e retorno
function somaValores(valor1, valor2) {
  return valor1 + valor2;
}

somaDosValores = somaValores(10, 25);
console.log(somaDosValores);

//As funcoes acima, sao chamadas de funcoes TRADICIONAIS

//Foi criada uma outra maneira de definir funcoes, as chamadas arrow functions

const subtraiValores = (valor1, valor2) => valor1 - valor2;

const multiplicaValores = (valor1, valor2) => {
  return valor1 * valor2;
};

console.log(subtraiValores(10, 3));
console.log(multiplicaValores(33, 56));*/

//Assincronismo

/*function imprimirInter() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("Internacional");
    }, 2000);
  });
}

function imprimirGremio() {
  console.log("Gremio");
}

async function imprimirTimes() {
  console.log("Consultando times...");
  await imprimirInter();
  imprimirGremio();
}

imprimirTimes();
*/

async function getAllFilms() {
  const response = await axios.get("https://swapi.info/api/films");
  let filmes = response.data;
  let titulos = filmes.map((filme) => {
    return filme.episode_id + " - " + filme.title;
  });
  let filmesEscolhidos = filmes.filter((filme) => {
    return (
      filme.title === "A New Hope" || filme.title === "The Empire Strikes Back"
    );
  });
  let somaValoresEpisodeId = filmes.reduce((acumulador, filme) => {
    return acumulador + filme.episode_id;
  }, 0);
  console.log(titulos);
  console.log(filmesEscolhidos);
  console.log(somaValoresEpisodeId);
}

getAllFilms();
