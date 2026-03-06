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

const transporter = nodemailer.createTransport({
    service: "gmail",
    host:"",
    secure:"",
    port: 587,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
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


app.post("/register", async (req, response) => {
    // 1. You MUST get a dedicated connection from the pool first
    const connection = await dbconnection.getConnection();

    try {
        // 2. Start the transaction on THIS specific connection
        await connection.beginTransaction();

        const values = [
            req.body.GivenName, req.body.MiddleName, req.body.LastName,
            req.body.Sex, req.body.Birthday, req.body.PWD,
            req.body.email, req.body.PhoneNo
        ];

        // 3. Use 'connection.query', NOT 'dbconnection.query'
        const [residentResult] = await connection.query(
            "INSERT INTO residenttable (GivenName, MiddleName, LastName, Sex, Birthday, PWD, Email, PhoneNo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            values
        );

        const residentID = residentResult.insertId;
        const hashpass = await bcrypt.hash(req.body.password, 10);

        // 4. Use the SAME connection for the second insert
        await connection.query(
            "INSERT INTO accounttable(username, role, password, email, ResidentID) values(?,?,?,?,?)",
            [req.body.username, "resident", hashpass, req.body.email, residentID]
        );

        // 5. CRITICAL: You must commit to make the changes permanent
        await connection.commit();
        console.log("Transaction committed successfully!");

        response.status(200).json({ success: true, message: "Added Successfully" });

    } catch (err) {
        // 6. Undo everything if any step fails
        await connection.rollback();
        console.error("Transaction failed, rolled back:", err);
        response.status(500).json({ error: "Registration failed" });
    } finally {
        // 7. Always return the connection to the pool
        connection.release();
    }
});

app.get("/admin", async (req, res) => {
    const [records] = await dbconnection.query("SELECT * FROM accounttable");
    console.log(records);
    res.json(records);
})

app.post("/admin/register-account", async (request, response) => {
    const {username, password, role, email, residentID} = request.body;
    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        const [insertResult] = await dbconnection.query("INSERT INTO accounttable (username, password, role, email, ResidentID) VALUES (?, ?, ?,?,?)",
        [username, hashedPassword, role, email, residentID]);
        const newResidentID = insertResult.residentID;
        response.json({message: "Registration successful", accountId: newResidentID});
    } catch(error){
        console.error("Error during registration:", error); 
        response.status(500).json({error: "An error occurred during registration"});
    }
})

app.get("/admin/resident", async (request, response) => {
    const [records] = await dbconnection.query("SELECT * FROM residenttable");
    response.json(records);
})

app.post("/admin/add-resident", async (request, response) => {
    const {GivenName, MiddleName, LastName, Sex, Birthday, PWD, email, PhoneNo} = request.body;
    try{
        const [insertResult] = await dbconnection.query("INSERT INTO residenttable (GivenName, MiddleName, LastName, Sex, Birthday, PWD, Email, PhoneNo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [GivenName, MiddleName, LastName, Sex, Birthday, PWD, email, PhoneNo, new Date]);
        response.json(insertResult);
    } catch(error) {
        console.error("Error inserting resident:", error);
        response.status(500).json({error: "Failed to add resident"});
    }
})

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

        await dbconnection.query("DELETE FROM accounttable WHERE ResidentID = ?", [ResidentID]);
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

//Endpoint for forgot password but not have frontend to embedded
app.post("/forgot-password", (req, res) => {
    const { email } = req.body;

    const mailOptions = {
        from: process.env.EMAIL,
        to: process.env.TO_EMAIL,
        subject: 'TEST EMAIL USING NODEMAILER',
        text: 'Bading si Hero'
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if(err){
            console.log(err);
        } else {
            console.log("EMAIL SENT! ")
        }
    })
}) 

app.listen(3000, () => {
    console.log("Running on port 3000!");
})