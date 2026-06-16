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

const count_age = async (req, res) => {
    try{

        let query = `SELECT CASE WHEN age < 18 THEN '0-17'
        WHEN age BETWEEN 18 AND 30 THEN '18-30'
        WHEN age BETWEEN 31 AND 50 THEN '31-50'
        ELSE '51+' END AS age_group, CAST(COUNT(*) AS SIGNED) AS count
        FROM ( SELECT TIMESTAMPDIFF(YEAR, Birthday, CURDATE()) AS age 
        FROM bmisdb.persontable ) AS subquery GROUP BY age_group; `

        const [count_record] = await db.query(query);
        res.json(count_record);
        
    } catch (error) {
        res.status(500).json({message: "Internal Server Error", error: error.message});
    }
}

const count_sex = async (req, res) => {
    try{
        let query = `SELECT Sex, CAST(COUNT(*) AS SIGNED) AS sex_count FROM persontable GROUP BY Sex;`;
        const [count_record] = await db.query(query);
        res.json(count_record);
    } catch (err) {
         res.status(500).json({message: "Internal Server Error", error: error.message});
    }
}

const count_news = async (req, res) => {
    try{
        let query = `SELECT CAST(COUNT(*) AS SIGNED) AS news_count FROM newstable GROUP BY NewsStatus = "Published";`;
        const [count_record] = await db.query(query);
        res.json(count_record);
    } catch (err) {
         res.status(500).json({message: "Internal Server Error", error: error.message});
    }
}

const count_residents = async (req, res) => {
    try{
        let query = `SELECT CAST(COUNT(*) AS SIGNED) AS resident_count FROM residenttable;`;
        const [count_record] = await db.query(query);
        res.json(count_record);
    } catch (err) {
         res.status(500).json({message: "Internal Server Error", error: error.message});
    }
}

const count_applications = async (req, res) => {
    try{
        let query = `SELECT CAST(COUNT(*) AS SIGNED) AS application_count FROM applicationtable`;
        const [count_record] = await db.query(query);
        res.json(count_record);
    } catch (err) {
         res.status(500).json({message: "Internal Server Error", error: error.message});
    }
}

module.exports = { fetch_account, count_age, count_sex, count_residents, count_applications, count_news};