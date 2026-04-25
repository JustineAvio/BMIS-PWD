const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

const dbconnection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    timezone: '+08:00'
})

module.exports = dbconnection;