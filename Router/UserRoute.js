const express = require('express');
const router = express.Router();
const userController = require('../Controllers/UsersController');

router.post('/createuser', userController.registerUser);
router.post('/login', userController.loginUser);

module.exports = router;