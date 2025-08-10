// backend/controllers/vehiculos.cjs
const db = require('../models/db.cjs');
const COLLECTION = 'vehiculos';

exports.list = (_req, res) => {
  const rows = db.getAll(COLLECTION);
  res.json(rows);
};

exports.getOne = (req, res) => {
  const key = String(req.params.idOrPlaca);
  const rows = db.getAll(COLLECTION);
  const row = rows.find(v => String(v.id ?? '') === key || String(v.placa ?? '') === key);
  if (!row) return res.status(404).json({ message: 'No encontrado' });
  res.json(row);
};

exports.patchOne = (req, res) => {
  const key = String(req.params.idOrPlaca);
  const patch = req.body || {};

  const rows = db.getAll(COLLECTION);
  const idx = rows.findIndex(v => String(v.id ?? '') === key || String(v.placa ?? '') === key);
  if (idx === -1) return res.status(404).json({ message: 'No encontrado' });

  const updated = { ...rows[idx], ...patch };

  // Si el vehículo tiene 'id', usamos idField='id'; si no, usamos placa como llave
  const idField = updated.id != null ? 'id' : 'placa';
  db.upsert(COLLECTION, updated, idField);

  res.json(updated);
};
