const express = require("express");
const router = express.Router();
const accountController = require("../controllers/AdminController.js");

router.get("/", accountController.fetch_account);   

module.exports = router;

