const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.post('/register', userController.userRegister);

router.post('/login', userController.userLogin);

router.put('/:id', userController.update);

router.delete('/:id', userController.delete);

router.get('/all', userController.get);

router.get('/:id', userController.getById);

module.exports = router;