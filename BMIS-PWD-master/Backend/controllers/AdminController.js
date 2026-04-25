const db = require("../config/db.js");

const fetch_account = async (req, res) => {
    try {
        const [records] = await db.query("SELECT * FROM accounttable");
        res.json(records);
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

module.exports = { fetch_account };