const express = require('express');
const ctrl = require('../controllers/perfil.cjs');
const router = express.Router();

router.get('/:username', ctrl.getPerfil);

module.exports = router;
