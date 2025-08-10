const db = require('../models/db.cjs');
const COLLECTION = 'usuarios';

exports.list = (_req, res) => {
  res.json(db.getAll(COLLECTION));
};

exports.create = (req, res) => {
  const body = req.body || {};
  if (!body.username) return res.status(400).json({ message: 'username requerido' });
  const exists = db.findOne(COLLECTION, { username: body.username });
  if (exists) return res.status(409).json({ message: 'usuario ya existe' });
  const created = db.create(COLLECTION, body, 'username');
  res.status(201).json(created);
};

exports.update = (req, res) => {
  const username = req.params.username;
  const exists = db.findOne(COLLECTION, { username });
  if (!exists) return res.status(404).json({ message: 'No encontrado' });
  const updated = db.upsert(COLLECTION, { ...exists, ...req.body, username }, 'username');
  res.json(updated);
};

exports.remove = (req, res) => {
  const ok = db.remove(COLLECTION, req.params.username, 'username');
  if (!ok) return res.status(404).json({ message: 'No encontrado' });
  res.json({ ok: true });
};
