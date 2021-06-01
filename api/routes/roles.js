const express = require('express');
const router = express.Router();

const roleController = require('../controllers/roleController');

router.post('/', roleController.create);

router.put('/:id', roleController.update);

router.delete('/:id', roleController.delete);

router.get('/all', roleController.get);

router.get('/:id', roleController.getById);

module.exports = router;