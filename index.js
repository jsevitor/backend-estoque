// index.js
const jsonServer = require("json-server");
const server = jsonServer.create();
const path = require("path");
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();

// Defina a porta em que o servidor irá rodar
const PORT = process.env.PORT || 3000;

// Use os middlewares padrão do json-server
server.use(middlewares);

// Use o roteador configurado com o arquivo db.json
server.use(router);

// Inicie o servidor
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
