const express = require('express');
const router = express.Router();
const transactionController = require('../Controllers/TransactionController');
const authenticateUser = require("../Middleware/AuthMiddleware");

router.post('/inter-transfer', transactionController.interBankTransfer);
router.post('/intra-transfer',transactionController.intraBankTransfer);
router.get('/status/:transactionId', transactionController.getTransactionStatus);
module.exports = router;