const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const dbconnection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

async function testDBConnection() {
    try{
        const connection = await dbconnection.getConnection();
        console.log("Database connection successful!");
        connection.release();
    } catch (error) {
        console.error("Database connection failed:", error);
    }
}

testDBConnection();

//Endpoint for Login (Checked) for User and Admin panel 
app.post("/login", async (request, response) => {
    const {username, password} = request.body;
    const [accounts] = await dbconnection.query("SELECT * FROM accounttable WHERE username = ?", 
    [username]);

    try{
    if(accounts.length > 0){
        const user = accounts[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if(passwordMatch){
            if(user.role === "admin"){
                return response.json({
                    success: true,
                    role: user.role
                })
            }
            if(user.role === "staff"){
                return response.json({
                    success: true,
                    role: user.role
                })
            }
            if(user.role === "resident"){
                return response.json({
                    success: true,
                    role: user.role
                })
            }
        } else {
            response.status(401).json({error: "Invalid username or password"});
        }
    }
    } catch(error){
        console.error("Error during login:", error);
        response.status(500).json({error: "An error occurred during login"});
    }
});

//Endpoint for Register Panel 
app.post("/user/add-resident", async (request, response) => {
    const {GivenName, MiddleName, LastName, Sex, Birthday, PWD, email, PhoneNo} = request.body;
    try{
        const [insertResult] = await dbconnection.query("INSERT INTO residenttable (GivenName, MiddleName, LastName, Sex, Birthday, PWD, Email, PhoneNo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [GivenName, MiddleName, LastName, Sex, Birthday, PWD, email, PhoneNo]);
        response.json(insertResult);
    } catch(error) {
        console.error("Error inserting resident:", error);
        response.status(500).json({error: "Failed to add resident"});
    }
})



/*RESIDENT CRUD*/

//Endpoint for Admin Dashboard - Account Registration with the roles (Checked)
app.post("/admin/register-account", async (request, response) => {
    const {username, password, role} = request.body;
    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        const [insertResult] = await dbconnection.query("INSERT INTO accounttable (username, password, role) VALUES (?, ?, ?)",
        [username, hashedPassword, role]);
        response.json({message: "Registration successful", accountId: insertResult.insertId});
    } catch(error){
        console.error("Error during registration:", error);
        response.status(500).json({error: "An error occurred during registration"});
    }
})

//Endpoint for Admin Dashboard - Displaying Resident Information (Checked)
app.get("/admin/resident", async (request, response) => {
    const [records] = await dbconnection.query("SELECT * FROM residenttable");
    response.json(records);
})

//Endpoint for Admin Dashboard - Displaying Accounts (Checked)
app.get("/admin", async (request, response) => {
    const [accounts] = await dbconnection.query("SELECT * FROM accounttable");
    response.json(accounts);
})
 
//Endpoint for Admin Dashboard - Adding Resident Accounts during Registration (Checked)
app.post("/admin/add-resident", async (request, response) => {
    const {GivenName, MiddleName, LastName, Sex, Birthday, PWD, email, PhoneNo} = request.body;
    try{
        const [insertResult] = await dbconnection.query("INSERT INTO residenttable (GivenName, MiddleName, LastName, Sex, Birthday, PWD, Email, PhoneNo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [GivenName, MiddleName, LastName, Sex, Birthday, PWD, email, PhoneNo]);
        response.json(insertResult);
    } catch(error) {
        console.error("Error inserting resident:", error);
        response.status(500).json({error: "Failed to add resident"});
    }
})

//Endpoint for Admin Dashboard - Updating Accounts after Editing Personal Details (Checked)
app.put("/admin/resident/update-resident/:ResidentID", async (request, response) => {
    const {ResidentID} = request.params;
    const {GivenName, MiddleName, LastName, Sex, Birthday, PWD, email, PhoneNo} = request.body;
    try{
    const [updateResult] = 
    await dbconnection.query("UPDATE residenttable SET GivenName = ?, MiddleName = ?, LastName =? , Sex =? , Birthday =?, PWD =?, Email =?, PhoneNo =? WHERE ResidentID = ?",
    [GivenName, MiddleName, LastName, Sex, Birthday, PWD, email, PhoneNo, ResidentID]);
    response.json(updateResult);
    } catch(error){
        console.error("Error updating resident:", error);
        response.status(500).json({error: "Failed to update resident"});
    }
})

//Endpoint for Admin Dashboard - Fetching Single Account Details when Editing Personal Details (Checked)
app.get("/admin/resident/:ResidentID", async (req, res) => {
    try {
        const [rows] = await dbconnection.query("SELECT * FROM residenttable WHERE ResidentID = ?", [req.params.ResidentID]);
        if (rows.length === 0) return res.status(404).json({ error: "Not found" });
        res.json(rows[0] || null);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Endpoint for Admin Dashboard - Deleting Accounts (Checked)
app.delete("/admin/resident/:ResidentID", async (request, response) => { 
    try{
        const {ResidentID} = request.params;
        const [deleteResult] = await dbconnection.query("DELETE FROM residenttable WHERE ResidentID = ?", [ResidentID]); 

        if(deleteResult.affectedRows === 0){
            return response.status(404).json({error: "Resident not found"});
        }
        response.json({message: "Resident deleted successfully"});
    } catch(error){
        console.error("Error deleting resident:", error);
        response.status(500).json({error: "Failed to delete resident"});
    }
})
/*END OF CRUD FUNCTION */

app.listen(3000, () => {
    console.log("Running on port 3000!");
})