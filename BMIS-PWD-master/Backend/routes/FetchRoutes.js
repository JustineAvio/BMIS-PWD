const express = require("express");
const router = express.Router();
const fetchController = require("../controllers/FetchController.js");

router.get("/", fetchController.fetch_account); 
router.get("/count-age", fetchController.count_age);
router.get("/count-sex", fetchController.count_sex);  
router.get("/count-residents", fetchController.count_residents);
router.get("/count-application", fetchController.count_applications);
router.get("/count-news", fetchController.count_news)
module.exports = router;

