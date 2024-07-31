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

// Get all retiradas
router.get("/", (req, res) => {
  const db = readDB();
  res.json(db.retiradas);
});

// Get a single retirada by id
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const retirada = db.retiradas.find((r) => r.id === parseInt(id));
  if (retirada) {
    res.json(retirada);
  } else {
    res.status(404).json({ message: "Retirada não encontrada" });
  }
});

// Create a new retirada
router.post("/", (req, res) => {
  const newRetirada = req.body;
  const db = readDB();
  newRetirada.id = db.retiradas.length + 1; // Simples ID increment
  db.retiradas.push(newRetirada);
  writeDB(db);
  res.status(201).json(newRetirada);
});

// Update an existing retirada
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const updatedRetirada = req.body;
  const db = readDB();
  const index = db.retiradas.findIndex((r) => r.id === parseInt(id));
  if (index !== -1) {
    db.retiradas[index] = { ...db.retiradas[index], ...updatedRetirada };
    writeDB(db);
    res.json(db.retiradas[index]);
  } else {
    res.status(404).json({ message: "Retirada não encontrada" });
  }
});

// Delete a retirada
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const index = db.retiradas.findIndex((r) => r.id === parseInt(id));
  if (index !== -1) {
    const deletedRetirada = db.retiradas.splice(index, 1);
    writeDB(db);
    res.json(deletedRetirada);
  } else {
    res.status(404).json({ message: "Retirada não encontrada" });
  }
});

module.exports = router;
