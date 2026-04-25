const express = require("express");
const router = express.Router();
const authController = require("../controllers/AuthController.js");

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/forgot-password", authController.forgotpass);
router.post("/reset-password/:token", authController.resetpass);

module.exports = router;