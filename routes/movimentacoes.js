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

// Get all movimentacoes
router.get("/", (req, res) => {
  const db = readDB();
  res.json(db.movimentacoes);
});

// Get a single movimentacao by id
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const movimentacao = db.movimentacoes.find((m) => m.id === parseInt(id));
  if (movimentacao) {
    res.json(movimentacao);
  } else {
    res.status(404).json({ message: "Movimentação não encontrada" });
  }
});

// Create a new movimentacao
router.post("/", (req, res) => {
  const newMovimentacao = req.body;
  const db = readDB();
  newMovimentacao.id = db.movimentacoes.length + 1; // Simples ID increment
  db.movimentacoes.push(newMovimentacao);
  writeDB(db);
  res.status(201).json(newMovimentacao);
});

// Update an existing movimentacao
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const updatedMovimentacao = req.body;
  const db = readDB();
  const index = db.movimentacoes.findIndex((m) => m.id === parseInt(id));
  if (index !== -1) {
    db.movimentacoes[index] = {
      ...db.movimentacoes[index],
      ...updatedMovimentacao,
    };
    writeDB(db);
    res.json(db.movimentacoes[index]);
  } else {
    res.status(404).json({ message: "Movimentação não encontrada" });
  }
});

// Delete a movimentacao
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const index = db.movimentacoes.findIndex((m) => m.id === parseInt(id));
  if (index !== -1) {
    const deletedMovimentacao = db.movimentacoes.splice(index, 1);
    writeDB(db);
    res.json(deletedMovimentacao);
  } else {
    res.status(404).json({ message: "Movimentação não encontrada" });
  }
});

module.exports = router;
