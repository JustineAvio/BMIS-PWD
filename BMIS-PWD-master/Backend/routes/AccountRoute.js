const express = require('express');
const router = express.Router();

const accountController = require('../controllers/AccountController');

router.put("/change-role/:id", accountController.changeUserRole);

module.exports = router;