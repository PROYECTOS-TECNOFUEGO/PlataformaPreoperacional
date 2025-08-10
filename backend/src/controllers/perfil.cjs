const db = require('../models/db.cjs');

exports.getPerfil = (req, res) => {
  const perfil = db.findOne('perfiles', { username: req.params.username });
  if (!perfil) return res.status(404).json({ message: 'Perfil no encontrado' });
  // Tu front actual espera un OBJETO (no array)
  res.json(perfil);
};
