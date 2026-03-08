const express = require("express");
const router = express.Router();
const authController = require("../controllers/AuthController.js");

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/forgot-password", authController.forgotpass);
router.post("/reset-password/:token", authController.resetpass);
router.post("/admin-accounts", authController.admin_register);

module.exports = router;