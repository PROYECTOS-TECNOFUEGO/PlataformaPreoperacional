// backend/routes/vehiculos.cjs
const express = require('express');
const ctrl = require('../controllers/vehiculos.cjs');

const router = express.Router();

router.get('/', ctrl.list);
router.get('/:idOrPlaca', ctrl.getOne);      // 👈 nuevo
router.patch('/:idOrPlaca', ctrl.patchOne);  // 👈 nuevo

module.exports = router;
