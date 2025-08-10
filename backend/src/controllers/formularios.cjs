const db = require('../models/db.cjs');
const { nanoid } = require('nanoid'); // 👈 asegúrate de tener nanoid instalado: npm i nanoid

const COLLECTION = 'formularios';

exports.list = (req, res) => {
  const rows = db.getAll(COLLECTION);
  res.json(rows);
};

exports.get = (req, res) => {
  const row = db.getById(COLLECTION, req.params.id);
  if (!row) return res.status(404).json({ message: 'No encontrado' });
  res.json(row);
};

exports.create = (req, res) => {
  const body = req.body || {};

  // fecha / código por defecto
  const now = new Date();
  if (!body.fecha) body.fecha = now.toISOString().split('T')[0];
  if (!body.codigo) {
    body.codigo = `F-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
  }

  // grupoId para vincular principal/relevo
  body.grupoId = body.grupoId || nanoid(8);

  // Estados por defecto según reglas
  const tieneRelevo = !!body.tieneRelevo;
  const rolEtapa = body.rolEtapa === 'relevo' ? 'relevo' : 'principal';

  if (!body.estadoGeneral) body.estadoGeneral = 'En proceso';
  if (!body.estadoPrincipal) {
    body.estadoPrincipal = rolEtapa === 'relevo' ? 'Terminado' : 'En curso';
  }
  if (!body.estadoRelevo) {
    body.estadoRelevo = tieneRelevo ? (rolEtapa === 'relevo' ? 'En curso' : 'Pendiente') : 'No aplica';
  }

  const created = db.create(COLLECTION, body, 'id');
  res.status(201).json(created);
};

exports.update = (req, res) => {
  const id = req.params.id;
  const exists = db.getById(COLLECTION, id);
  if (!exists) return res.status(404).json({ message: 'No encontrado' });

  const updated = db.upsert(COLLECTION, { ...exists, ...req.body, id }, 'id');
  res.json(updated);
};

exports.finalizar = (req, res) => {
  const id = req.params.id;
  const actor = String(req.query.actor || '').toLowerCase(); // 'principal' | 'relevo'

  const row = db.getById(COLLECTION, id);
  if (!row) return res.status(404).json({ message: 'No encontrado' });

  if (actor === 'principal') {
    row.estadoPrincipal = 'Terminado';
    row.estadoGeneral = row.tieneRelevo ? 'En proceso' : 'Finalizado';
    if (row.tieneRelevo && !row.estadoRelevo) row.estadoRelevo = 'Pendiente';
  } else if (actor === 'relevo') {
    row.estadoRelevo = 'Terminado';
    row.estadoPrincipal = row.estadoPrincipal || 'Terminado';
    row.estadoGeneral = 'Finalizado';
  } else {
    return res.status(400).json({ message: 'actor inválido (use principal|relevo)' });
  }

  db.upsert(COLLECTION, row, 'id');
  res.json(row);
};

exports.remove = (req, res) => {
  const ok = db.remove(COLLECTION, req.params.id, 'id');
  if (!ok) return res.status(404).json({ message: 'No encontrado' });
  res.json({ ok: true });
};
