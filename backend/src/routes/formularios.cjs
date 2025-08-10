const express = require('express');
const ctrl = require('../controllers/formularios.cjs');
const router = express.Router();

router.get('/', ctrl.list);
router.get('/:id', ctrl.get);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.put('/:id/finalizar', ctrl.finalizar);
router.delete('/:id', ctrl.remove);

module.exports = router;
