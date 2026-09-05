const express = require('express');
const router = express.Router();
const accountController = require('../Controllers/AccountControllers');
const authenticateUser = require("../Middleware/AuthMiddleware");


router.post('/createaccount', authenticateUser, accountController.createAccount);
router.get('/name-enquiry/:accountNumber', accountController.nameEnquiry);
router.get('/balance-enquiry/:accountNumber', accountController.accountBalanceEnquiry);

module.exports = router;