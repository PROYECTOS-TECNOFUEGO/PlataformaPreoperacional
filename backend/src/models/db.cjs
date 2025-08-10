const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../db.json');

function readDb() {
  if (!fs.existsSync(DB_PATH)) return {};
  const raw = fs.readFileSync(DB_PATH, 'utf8');
  return raw ? JSON.parse(raw) : {};
}

function writeDb(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
}

function getAll(collection) {
  const db = readDb();
  return Array.isArray(db[collection]) ? db[collection] : [];
}

function getById(collection, id) {
  const list = getAll(collection);
  return list.find((x) => String(x.id ?? x.codigo) === String(id));
}

function upsert(collection, obj, idField = 'id') {
  const db = readDb();
  db[collection] = Array.isArray(db[collection]) ? db[collection] : [];
  const list = db[collection];
  const id = obj[idField];

  const idx = list.findIndex((x) => String(x[idField]) === String(id));
  if (idx >= 0) list[idx] = { ...list[idx], ...obj };
  else list.push(obj);

  writeDb(db);
  return obj;
}

function create(collection, obj, idField = 'id') {
  const db = readDb();
  db[collection] = Array.isArray(db[collection]) ? db[collection] : [];
  const list = db[collection];

  // si no viene id, generamos uno simple
  if (obj[idField] == null) {
    obj[idField] = String(Date.now());
  }
  list.push(obj);
  writeDb(db);
  return obj;
}

function remove(collection, id, idField = 'id') {
  const db = readDb();
  db[collection] = Array.isArray(db[collection]) ? db[collection] : [];
  const before = db[collection].length;
  db[collection] = db[collection].filter((x) => String(x[idField]) !== String(id));
  const after = db[collection].length;
  writeDb(db);
  return before !== after;
}

function findOne(collection, query) {
  const list = getAll(collection);
  return list.find((row) =>
    Object.entries(query).every(([k, v]) => String(row[k]) === String(v))
  );
}

module.exports = {
  readDb,
  writeDb,
  getAll,
  getById,
  upsert,
  create,
  remove,
  findOne,
};
