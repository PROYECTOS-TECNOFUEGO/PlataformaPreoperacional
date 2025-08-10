const express = require('express');

const formularios = require('./formularios.cjs');
const vehiculos = require('./vehiculos.cjs');
const usuarios = require('./usuarios.cjs');
const perfil = require('./perfil.cjs');

const router = express.Router();

router.use('/formularios', formularios);
router.use('/vehiculos', vehiculos);
router.use('/usuarios', usuarios);
router.use('/perfil', perfil);

module.exports = router;
