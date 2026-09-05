const express = require("express");
const router = express.Router();

const adminController = require("../Controllers/Admin");

router.post("/insertBvn", adminController.insertBvn);
router.post("/insertNin", adminController.insertNin);
router.get("/accounts", adminController.getAllAccounts);

module.exports = router;