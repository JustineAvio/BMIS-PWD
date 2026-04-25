const express = require('express');
const path = require('path');
const router = express.Router();
const newsController = require('../controllers/NewsController.js');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', newsController.getNews);
router.post('/publish', upload.single('newsImage'), newsController.postNews);
router.put('/edit/:id', upload.single('newsImage'), newsController.editNews);
router.get('/:id', newsController.fetchSpecificNews);
router.delete('/delete/:id', newsController.deleteNews);

module.exports = router;