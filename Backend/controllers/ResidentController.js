const db = require("../config/db");
const bcrypt = require('bcrypt');

exports.fetchresident = async (request, response) => {
    try{
    const [records] = await db.query("SELECT * FROM residenttable");
    response.json(records);
    }
    catch(error){
        console.error("Fetch Error:", error);
        response.status(500).json({ error: "Could not fetch residents" });
    }
}

exports.add_resident =  async (request, response) => {
     const connection = await db.getConnection();

    const {username, password, role, email, 
        GivenName, MiddleName, LastName, Birthday, Sex, PWD, PhoneNo, Address} = request.body;
    try{
        await connection.beginTransaction();

        const [residentQuery] = await connection.query("INSERT INTO residenttable (GivenName, MiddleName, LastName, Sex, Birthday, PWD, Email, PhoneNo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [ GivenName, MiddleName, LastName, Sex, Birthday, PWD, email, PhoneNo]
        )

        const newResidentID = residentQuery.insertId;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        await connection.query("INSERT INTO accounttable (username, password, role, email, ResidentID) VALUES (?, ?, ?,?,?)",
        [username, hashedPassword, "resident", email, newResidentID]);

        await connection.commit();
        response.status(200).json({ success: true, message: "Added Successfully" });
    } catch(error){
        await connection.rollback()
        console.error("Error during registration:", error); 
        response.status(500).json({error: "An error occurred during registration"});
    } finally {
        connection.release();
    }
}


exports.edit_resident = async (request, response) => {
    const {ResidentID} = request.params;
    const {GivenName, MiddleName, LastName, Sex, Birthday, PWD, email, PhoneNo} = request.body;
    try{
    const [updateResult] = 
    await db.query("UPDATE residenttable SET GivenName = ?, MiddleName = ?, LastName =? , Sex =? , Birthday =?, PWD =?, Email =?, PhoneNo =? WHERE ResidentID = ?",
    [GivenName, MiddleName, LastName, Sex, Birthday, PWD, email, PhoneNo, ResidentID]);
    response.json(updateResult);
    } catch(error){
        console.error("Error updating resident:", error);
        response.status(500).json({error: "Failed to update resident"});
    }
}

exports.fetch_edit_resident =  async (req, res) => {
    try {
        const residentID = req.params.ResidentID;
        const [rows] = await db.query("SELECT * FROM residenttable WHERE ResidentID = ?", [residentID]);
        if (rows.length === 0) return res.status(404).json({ error: "Not found" });
        res.json(rows[0] || null);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.delete_resident =  async (request, response) => { 

    const connection = await db.getConnection();

    try{
        const {ResidentID} = request.params;
        const resID = parseInt(ResidentID, 10)
        await connection.beginTransaction();

        await connection.query("DELETE FROM accounttable WHERE ResidentID = ?", [resID]);
        const [deleteResult] = await connection.query("DELETE FROM residenttable WHERE ResidentID = ?", [resID]); 
       

        if(deleteResult.affectedRows === 0){
            return response.status(404).json({error: "Resident not found"});
        }
        
        await connection.commit();
        response.json({message: "Resident deleted successfully"});
    } catch(error){
        if (connection) await connection.rollback();
        console.error("Error deleting resident:", error);
        response.status(500).json({error: "Failed to delete resident"});
    } finally {
        if (connection) connection.release();
    }
}