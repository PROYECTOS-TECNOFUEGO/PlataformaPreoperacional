const express = require('express');
const cors = require('cors');
const fs = require('fs/promises');
const path = require('path');
const { nanoid } = require('nanoid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const dataDir = path.join(__dirname, 'data');

const readJSON = async (file) => {
  const p = path.join(dataDir, file);
  const txt = await fs.readFile(p, 'utf-8');
  return JSON.parse(txt || '[]');
};

const writeJSON = async (file, data) => {
  const p = path.join(dataDir, file);
  await fs.writeFile(p, JSON.stringify(data, null, 2), 'utf-8');
};

/* ----------------------------- FORMULARIOS ----------------------------- */
// GET /api/formularios
app.get('/api/formularios', async (_req, res) => {
  const rows = await readJSON('formularios.json');
  res.json(rows);
});

// GET /api/formularios/:id
app.get('/api/formularios/:id', async (req, res) => {
  const rows = await readJSON('formularios.json');
  const row = rows.find(r => r.id === req.params.id || r.codigo === req.params.id);
  if (!row) return res.status(404).json({ message: 'No encontrado' });
  res.json(row);
});

// POST /api/formularios
app.post('/api/formularios', async (req, res) => {
  const rows = await readJSON('formularios.json');

  const now = new Date();
  const today = now.toISOString().split('T')[0];

  const input = req.body || {};
  const id = input.id || nanoid(10);
  const codigo = input.codigo || `F-${String(Math.floor(Math.random()*1000)).padStart(3,'0')}`;

  // Defaults de estado (para el flujo principal/relevo)
  const tieneRelevo = !!input.tieneRelevo;
  const estadoGeneral = 'En proceso';
  const estadoPrincipal = 'En curso';
  const estadoRelevo = tieneRelevo ? 'Pendiente' : 'No aplica';

  const row = {
    ...input,
    id,
    codigo,
    fecha: input.fecha || today,
    estadoGeneral: input.estadoGeneral || estadoGeneral,
    estadoPrincipal: input.estadoPrincipal || estadoPrincipal,
    estadoRelevo: input.estadoRelevo || estadoRelevo,
    tieneRelevo
  };

  rows.push(row);
  await writeJSON('formularios.json', rows);
  res.status(201).json(row);
});

// PUT /api/formularios/:id (actualiza todo el objeto)
app.put('/api/formularios/:id', async (req, res) => {
  const rows = await readJSON('formularios.json');
  const idx = rows.findIndex(r => r.id === req.params.id || r.codigo === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'No encontrado' });
  rows[idx] = { ...rows[idx], ...req.body, id: rows[idx].id }; // conserva id
  await writeJSON('formularios.json', rows);
  res.json(rows[idx]);
});

// PUT /api/formularios/:id/finalizar?actor=principal|relevo
app.put('/api/formularios/:id/finalizar', async (req, res) => {
  const { actor } = req.query; // 'principal' | 'relevo'
  const rows = await readJSON('formularios.json');
  const idx = rows.findIndex(r => r.id === req.params.id || r.codigo === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'No encontrado' });

  const row = rows[idx];
  if (actor === 'principal') {
    row.estadoPrincipal = 'Terminado';
    // si NO hay relevo -> finaliza todo
    if (!row.tieneRelevo) {
      row.estadoGeneral = 'Finalizado';
    }
  } else if (actor === 'relevo') {
    row.estadoRelevo = 'Terminado';
    // si relevo termina -> finaliza todo
    row.estadoGeneral = 'Finalizado';
  } else {
    return res.status(400).json({ message: 'actor inválido' });
  }

  rows[idx] = row;
  await writeJSON('formularios.json', rows);
  res.json(row);
});

/* -------------------------------- VEHÍCULOS ------------------------------- */
app.get('/api/vehiculos', async (_req, res) => {
  const rows = await readJSON('vehiculos.json');
  res.json(rows);
});
// PATCH /api/vehiculos/:idOrPlaca { estado: 'Activo' | 'Mantenimiento' | 'Inactivo' }
app.patch('/api/vehiculos/:idOrPlaca', async (req, res) => {
  const rows = await readJSON('vehiculos.json');
  const key = req.params.idOrPlaca;

  const idx = rows.findIndex(
    v => String(v.id) === key || String(v.placa) === key
  );

  if (idx === -1) {
    return res.status(404).json({ message: 'No encontrado' });
  }

  const patch = req.body || {};
  rows[idx] = { ...rows[idx], ...patch };
  await writeJSON('vehiculos.json', rows);
  res.json(rows[idx]);
});

/* -------------------------------- USUARIOS -------------------------------- */
app.get('/api/usuarios', async (_req, res) => {
  const rows = await readJSON('usuarios.json');
  res.json(rows);
});

app.post('/api/usuarios', async (req, res) => {
  const rows = await readJSON('usuarios.json');
  const u = req.body || {};
  if (!u.username) return res.status(400).json({ message: 'username requerido' });
  if (rows.some(x => x.username === u.username)) {
    return res.status(409).json({ message: 'Usuario ya existe' });
  }
  rows.push({ username: u.username, password: u.password || '123456', rol: u.rol || 'conductor' });
  await writeJSON('usuarios.json', rows);
  res.status(201).json({ ok: true });
});

app.put('/api/usuarios/:username', async (req, res) => {
  const rows = await readJSON('usuarios.json');
  const idx = rows.findIndex(x => x.username === req.params.username);
  if (idx === -1) return res.status(404).json({ message: 'No encontrado' });
  rows[idx] = { ...rows[idx], ...req.body, username: rows[idx].username };
  await writeJSON('usuarios.json', rows);
  res.json(rows[idx]);
});

app.delete('/api/usuarios/:username', async (req, res) => {
  const rows = await readJSON('usuarios.json');
  const next = rows.filter(x => x.username !== req.params.username);
  await writeJSON('usuarios.json', next);
  res.json({ ok: true });
});

/* --------------------------------- PERFIL --------------------------------- */
// GET /api/perfil/:username  -> devuelve un objeto (no array)
app.get('/api/perfil/:username', async (req, res) => {
  const rows = await readJSON('perfiles.json');
  const p = rows.find(x => x.username === req.params.username);
  if (!p) return res.status(404).json({ message: 'No encontrado' });
  res.json(p);
});

/* --------------------------------- LOGIN ---------------------------------- */
// POST /api/login { username, password }
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body || {};
  const users = await readJSON('usuarios.json');
  const u = users.find(x => x.username === username && x.password === password);
  if (!u) return res.status(401).json({ message: 'Credenciales inválidas' });
  // retorno simple (sin JWT por ahora)
  res.json({ username: u.username, rol: u.rol, token: 'fake-token' });
});

app.listen(PORT, () => {
  console.log(`JSON API running on http://localhost:${PORT}`);
});
