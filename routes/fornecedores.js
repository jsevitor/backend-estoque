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

// Get all fornecedores
router.get("/", (req, res) => {
  const db = readDB();
  res.json(db.fornecedores);
});

// Get a single fornecedor by id
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const fornecedor = db.fornecedores.find((f) => f.id === parseInt(id));
  if (fornecedor) {
    res.json(fornecedor);
  } else {
    res.status(404).json({ message: "Fornecedor não encontrado" });
  }
});

// Create a new fornecedor
router.post("/", (req, res) => {
  const newFornecedor = req.body;
  const db = readDB();
  newFornecedor.id = db.fornecedores.length + 1; // Simples ID increment
  db.fornecedores.push(newFornecedor);
  writeDB(db);
  res.status(201).json(newFornecedor);
});

// Update an existing fornecedor
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const updatedFornecedor = req.body;
  const db = readDB();
  const index = db.fornecedores.findIndex((f) => f.id === parseInt(id));
  if (index !== -1) {
    db.fornecedores[index] = {
      ...db.fornecedores[index],
      ...updatedFornecedor,
    };
    writeDB(db);
    res.json(db.fornecedores[index]);
  } else {
    res.status(404).json({ message: "Fornecedor não encontrado" });
  }
});

// Delete a fornecedor
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const index = db.fornecedores.findIndex((f) => f.id === parseInt(id));
  if (index !== -1) {
    const deletedFornecedor = db.fornecedores.splice(index, 1);
    writeDB(db);
    res.json(deletedFornecedor);
  } else {
    res.status(404).json({ message: "Fornecedor não encontrado" });
  }
});

module.exports = router;
