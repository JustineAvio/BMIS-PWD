const db = require("../config/db");

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
    const {GivenName, MiddleName, LastName, Sex, Birthday, PWD, email, PhoneNo} = request.body;
    try{
        const [insertResult] = await db.query("INSERT INTO residenttable (GivenName, MiddleName, LastName, Sex, Birthday, PWD, Email, PhoneNo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [GivenName, MiddleName, LastName, Sex, Birthday, PWD, email, PhoneNo]);
        response.json(insertResult);
    } catch(error) {
        console.error("Error inserting resident:", error);
        response.status(500).json({error: "Failed to add resident"});
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
    try{
        const {ResidentID} = request.params;

        await db.query("DELETE FROM accounttable WHERE ResidentID = ?", [ResidentID]);
        const [deleteResult] = await db.query("DELETE FROM residenttable WHERE ResidentID = ?", [ResidentID]); 

        if(deleteResult.affectedRows === 0){
            return response.status(404).json({error: "Resident not found"});
        }
        response.json({message: "Resident deleted successfully"});
    } catch(error){
        console.error("Error deleting resident:", error);
        response.status(500).json({error: "Failed to delete resident"});
    }
}