const express = require("express");
const router = express.Router();
const residentController = require("../controllers/ResidentController.js");

router.get("/", residentController.fetchresident);
router.get("/:ResidentID", residentController.fetch_edit_resident);
router.post("/add-resident", residentController.add_resident);
router.put("/update-resident/:ResidentID", residentController.edit_resident);
router.delete("/:ResidentID", residentController.delete_resident);

module.exports = router;