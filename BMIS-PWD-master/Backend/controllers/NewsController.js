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
    const { newstitle, newscategory, newscontent, newsstatus} = req.body;
    let image =  null;

    try {
        if(req.file) {  
            image = `news-${Date.now()}.webp`;
            const uploadPath = path.join(__dirname, "..", "uploads", "news");

            if(!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }
            const uploadImage = path.join(uploadPath, image);

            try {
                await sharp(req.file.buffer)
                    .resize(800, 600, { fit: "inside" })
                    .webp({ quality: 80 })
                    .toFile(uploadImage);
            } catch (err) {
                console.log("SHARP ERROR:", err);
            }
        }
         await db.query(
            `INSERT INTO newstable
            (NewsTitle, NewsCategory, NewsContent, NewsStatus, NewsImage)
            VALUES (?, ?, ?, ?, ?)`,
            [newstitle, newscategory, newscontent, newsstatus, image]);

        res.status(201).json({ success: true, message: "News published successfully!"});
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(500).json({ error: "Check your database attribute lengths or constraints." });
    }
};

exports.editNews = async (req, res) => {
  const { id } = req.params;
  const {
    newstitle,
    newscategory,
    newscontent,
    newsstatus,
    existingImage
  } = req.body;

  let newsImage = existingImage;

  try {

    const uploadDir = path.join(__dirname, "..", "uploads", "news");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    if (req.file) {

      // ========================
      // 1. DELETE OLD IMAGE FIRST
      // ========================
      if (existingImage) {
        const oldFile = existingImage.includes("http")
          ? existingImage.split("/uploads/news/")[1]
          : existingImage;

        const oldPath = path.join(uploadDir, oldFile);

        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
          console.log("Deleted old image:", oldFile);
        }
      }

      // ========================
      // 2. SAVE NEW IMAGE
      // ========================
      const fileName = `news-${Date.now()}.webp`;
      const filePath = path.join(uploadDir, fileName);

      await sharp(req.file.buffer)
        .resize(800, 600, { fit: "inside" })
        .webp({ quality: 80 })
        .toFile(filePath);

      newsImage = fileName; // IMPORTANT: overwrite completely

      console.log("Saved new image:", fileName);
    }

    // ========================
    // 3. UPDATE DB (ONLY ONE IMAGE)
    // ========================
    await db.query(
      `UPDATE newstable
       SET NewsTitle=?,
           NewsCategory=?,
           NewsContent=?,
           NewsStatus=?,
           NewsImage=?
       WHERE NewsID=?`,
      [
        newstitle,
        newscategory,
        newscontent,
        newsstatus,
        newsImage,
        id
      ]
    );

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Edit failed" });
  }
};

exports.deleteNews = async (req, res) => {
    const { id } = req.params;

    console.log("Delete request received");
    console.log("ID:", id);

    try {
        const [rows] = await db.query(
            "SELECT NewsImage FROM newstable WHERE NewsID = ?",
            [id]
        );

        console.log("Rows found:", rows.length);

        if (rows.length === 0) {
            return res.status(404).json({
                error: "News not found"
            });
        }

        // rest of code...

        const image = rows[0].NewsImage;

        // 2. Build correct file path
        const uploadDir = path.join(__dirname, "..", "uploads", "news");

        if (image) {
            const fileName = image.includes("http")
                ? image.split("/uploads/news/")[1]
                : image;

            const filePath = path.join(uploadDir, fileName);

            // 3. Delete file if exists
            try {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            } catch (err) {
                console.error("File delete error:", err);
            }   
        }

        // 4. Delete DB record
        const [result] = await db.query(
                "DELETE FROM newstable WHERE NewsID = ?",
                [id]
            );

            console.log("Delete result:", result);

            return res.status(200).json({
                success: true,
                message: "News deleted successfully!"
            });

    } catch (error) {
        console.error("Delete News Error:", error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

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