const express = require('express');
const router = express.Router();
const accountController = require('../Controllers/AccountControllers');
const authenticateUser = require("../Middleware/AuthMiddleware");


router.post('/createaccount', authenticateUser, accountController.createAccount);

module.exports = router;