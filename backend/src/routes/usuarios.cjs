const express = require('express');
const ctrl = require('../controllers/usuarios.cjs');
const router = express.Router();

router.get('/', ctrl.list);
router.post('/', ctrl.create);
router.put('/:username', ctrl.update);
router.delete('/:username', ctrl.remove);

module.exports = router;
