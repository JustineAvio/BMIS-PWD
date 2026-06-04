const db = require("../config/db.js");
const path = require("path");
const sharp = require("sharp");
const fs = require("fs");

exports.getNews = async (req, res) => {
 try{
    const [rows] = await db.query("SELECT * FROM newstable");
    res.json(rows); 
 } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching news." });
    console.error("Error fetching news:", error);
 }
};

exports.getNewsPerPage = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query("SELECT * FROM newstable WHERE NewsID = ?", [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "News not found" });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching news." });
        console.error("Error fetching news:", error);
    }
}

exports.postNews = async (req, res) => {
    const { id } = req.params;
    const { newstitle, newscategory, newscontent, newsstatus, existingImage } = req.body;
    let image = existingImage || null;

    try {
        if(req.file) {
            image = `news-${Date.now()}.webp`;
            const uploadPath = path.join(__dirname, "..", "uploads", "news", image);
            if(!fs.existsSync(uploadPath)) {
                fs.mkdirSync(path.dirname(uploadPath), { recursive: true });
            }
            await sharp(req.file.buffer)
                .resize(800, 600, { fit: 'inside' })
                .toFile(uploadPath);
        }
        const query = `INSERT INTO newstable (AccountID, NewsTitle, NewsCategory, NewsContent, NewsStatus, NewsImage) 
                       VALUES (?, ?, ?, ?, ?, ?)`;
        
        const params = [id, newstitle, newscategory, newscontent, newsstatus, image];
        
        await db.query(query, params);
        res.json({ success: true, message: "News saved successfully!" });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(500).json({ error: "Check your database attribute lengths or constraints." });
    }
};

exports.editNews = async (req, res) => {
  const { id } = req.params;
  const values = req.body;
  let query, params;

  try{
    if (req.file) {
        const newsImage = req.file ? req.file.filename : values.existingImage;
        query = 'UPDATE newstable SET NewsTitle=?, NewsContent=?, NewsCategory=?, NewsStatus=?, NewsImage=? WHERE NewsID=?';
        params = [values.newstitle, values.newscontent, values.newscategory, values.newsstatus, newsImage, id];
    } else {
        query = 'UPDATE newstable SET NewsTitle=?, NewsContent=?, NewsCategory=?, NewsStatus=? WHERE NewsID=?';
        params = [values.newstitle, values.newscontent, values.newscategory, values.newsstatus, id];
    }

    await db.query(query, params);
    res.status(200).json({ message: "News updated successfully!" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  };
}

exports.deleteNews = async (req, res) => {
    const { id } = req.params;

    try{
        const [image] = await db.query("SELECT NewsImage FROM newstable WHERE NewsID = ?", [id]);
        if (image.length > 0 && image[0].NewsImage) {
            const imagePath = path.join(__dirname, "../uploads/", image[0].NewsImage);
            if(fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await db.query("DELETE FROM newstable WHERE NewsID = ?", [id]);
        res.json({ message: "News deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting news." });
    }
}

exports.fetchSpecificNews = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query("SELECT * FROM newstable WHERE NewsID = ?", [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "News not found" });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error("Error fetching news for edit:", error);
        res.status(500).json({ error: "An error occurred while fetching news for edit." });
    }
};