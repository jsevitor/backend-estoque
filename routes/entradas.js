const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

// Caminho para o arquivo db.json
const dbPath = path.join(__dirname, "../db.json");

// Helper function to read database
const readDB = () => {
  const data = fs.readFileSync(dbPath, "utf8");
  return JSON.parse(data);
};

// Helper function to write database
const writeDB = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf8");
};

// Get all entradas
router.get("/", (req, res) => {
  const db = readDB();
  res.json(db.entradas);
});

// Get a single entrada by id
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const entrada = db.entradas.find((e) => e.id === parseInt(id));
  if (entrada) {
    res.json(entrada);
  } else {
    res.status(404).json({ message: "Entrada não encontrada" });
  }
});

// Create a new entrada
router.post("/", (req, res) => {
  const newEntrada = req.body;
  const db = readDB();
  // Certifica-se de que o ID é um número
  newEntrada.id = db.entradas.length
    ? Math.max(...db.entradas.map((e) => e.id)) + 1
    : 1; // Simples ID increment
  db.entradas.push(newEntrada);
  writeDB(db);
  res.status(201).json(newEntrada);
});

// Update an existing entrada
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const updatedEntrada = req.body;
  const db = readDB();
  const index = db.entradas.findIndex((e) => e.id === parseInt(id));
  if (index !== -1) {
    db.entradas[index] = { ...db.entradas[index], ...updatedEntrada };
    writeDB(db);
    res.json(db.entradas[index]);
  } else {
    res.status(404).json({ message: "Entrada não encontrada" });
  }
});

// Delete an entrada
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const index = db.entradas.findIndex((e) => e.id === parseInt(id));
  if (index !== -1) {
    const deletedEntrada = db.entradas.splice(index, 1);
    writeDB(db);
    res.json(deletedEntrada);
  } else {
    res.status(404).json({ message: "Entrada não encontrada" });
  }
});

module.exports = router;
