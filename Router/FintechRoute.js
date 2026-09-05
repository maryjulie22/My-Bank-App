const express = require('express');
const router = express.Router();
const fintechController = require('../Controllers/FintechController');

router.post('/validate-bvn', fintechController.validateBvn);
router.post('/validate-nin', fintechController.validateNin);

module.exports = router;