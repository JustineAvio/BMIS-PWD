const express = require("express");
const router = express.Router();
const FormController = require("../controllers/FormController");

router.get("/", FormController.getForms);
router.post("/submit/:id", FormController.requestform);
router.put("/review/:id", FormController.reviewform);
router.put("/decision/:id", FormController.formdecision);


module.exports = router;