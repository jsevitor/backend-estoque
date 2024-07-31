const express = require("express");
const router = express.Router();
const jsonServer = require("json-server");
const path = require("path");

const dbPath = jsonServer.router(path.join(__dirname, "../db.json"));

// Helper function to read database
const readDB = () => {
  const data = fs.readFileSync(dbPath);
  return JSON.parse(data);
};

// Helper function to write database
const writeDB = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// Get all produtos
router.get("/", (req, res) => {
  const db = readDB();
  res.json(db.produtos);
});

// Get a single produto by id
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const produto = db.produtos.find((p) => p.id === parseInt(id));
  if (produto) {
    res.json(produto);
  } else {
    res.status(404).json({ message: "Produto não encontrado" });
  }
});

// Create a new produto
router.post("/", (req, res) => {
  const newProduto = req.body;
  const db = readDB();
  newProduto.id = db.produtos.length + 1; // Simples ID increment
  db.produtos.push(newProduto);
  writeDB(db);
  res.status(201).json(newProduto);
});

// Update an existing produto
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const updatedProduto = req.body;
  const db = readDB();
  const index = db.produtos.findIndex((p) => p.id === parseInt(id));
  if (index !== -1) {
    db.produtos[index] = { ...db.produtos[index], ...updatedProduto };
    writeDB(db);
    res.json(db.produtos[index]);
  } else {
    res.status(404).json({ message: "Produto não encontrado" });
  }
});

// Delete a produto
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const index = db.produtos.findIndex((p) => p.id === parseInt(id));
  if (index !== -1) {
    const deletedProduto = db.produtos.splice(index, 1);
    writeDB(db);
    res.json(deletedProduto);
  } else {
    res.status(404).json({ message: "Produto não encontrado" });
  }
});

module.exports = router;
