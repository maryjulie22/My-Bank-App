const express = require('express');
const router = express.Router();
const accountController = require('../Controllers/AccountControllers');

router.post('/createaccount', accountController.createAccount);

module.exports = router;