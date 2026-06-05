const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

const URLDB2=`mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
const dbconnection = mysql.createPool(URLDB2);

module.exports = dbconnection;