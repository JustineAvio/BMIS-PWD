const db = require("../config/db");
const bcrypt = require('bcrypt');
const { AddResidentValidator, UpdateResidentValidator } = require("../validators/ResidentValidator");

exports.fetchresident = async (request, response) => {
   try{
        let query = `SELECT r.ResidentID, p.GivenName, p.MiddleName, p.LastName, p.Sex, 
        p.Birthday, p.is_PWD, r.address, r.ContactNo, r.RegistrationDate, a.Username, a.Email
        FROM residenttable AS r JOIN persontable AS p ON r.PersonID = p.PersonID
        JOIN accounttable AS a ON a.ResidentID = r.ResidentID`;
        const [records] = await db.query(query);
        response.json(records);
   } catch(error){
        return response.status(500).json({error: "Could not fetch residents"});
   }
}

exports.add_resident =  async (request, response) => {
    const connection = await db.getConnection();

    try{
        await connection.beginTransaction();
        const values = request.body;
        const { error, value } = AddResidentValidator(values);
        if(error){
            const formattedErrors = error.details.reduce((acc, curr) => {
                acc[curr.path[0]] = curr.message;
                return acc;
            }, {})

        return response.status(400).json({
            success: false,
            errors: formattedErrors
        });
     }
     
        const [existingUser] = await db.query(`SELECT email FROM accounttable WHERE email = ?`, [values.email]);

        if(existingUser.length > 0){
            return response.status(409).json({
                success: false,
                message: "This email is already registered. Please use different email or log in."
            });
        }
        const [Person] = await connection.query(`INSERT INTO persontable 
            (GivenName, MiddleName, LastName, Sex, Birthday, is_PWD) VALUES (?, ?, ?, ?, ?, ?)`,
            [values.GivenName, values.MiddleName || null, values.LastName, values.Sex, values.Birthday, values.PWD || values.is_PWD || "No"]);

        const PersonID = Person.insertId;

        // if(values.childGivenName) {
        //     await connection.query(`INSERT INTO persontable (
        //         GivenName, MiddleName, LastName, Sex, Birthday, is_PWD, ParentID)
        //         VALUES(?, ?, ?, ?, ?, ?, ?)`,
        //             [values.childGivenName, 
        //              values.childMiddleName, 
        //              values.childLastName, 
        //              values.childSex, 
        //              values.childBirthday, 
        //              values.childIsPWD, 
        //              PersonID
        //             ]
        //     );
        // }   

        const [ResidentInfo] = await connection.query(`INSERT INTO residenttable (PersonID, Address, ContactNo, RegistrationDate) VALUES (?, ?, ?, ?)`,
            [PersonID, values.address, values.PhoneNo || values.ContactNo, new Date()]);

        const ResidentID = ResidentInfo.insertId;
        const hashedPassword = await bcrypt.hash(values.password, 10);
        
        await connection.query(`INSERT INTO accounttable (username, password, email,role, ResidentID) VALUES (?, ?, ?, ?, ?)`,
            [values.username, hashedPassword, values.email, 'resident', ResidentID]);
             
        await connection.commit();

        response.status(200).json({ success: true, message: "Added Successfully" });
    } catch(error){
        await connection.rollback()
        response.status(500).json({error: "An error occurred during registration"});
    } finally {
        connection.release();
    }
}


exports.edit_resident = async (request, response) => {
    const { ResidentID } = request.params;
    const id = parseInt(ResidentID, 10);
    const values = request.body; 
    const { error, value } = UpdateResidentValidator(values);

    if (error) {
        const formattedErrors = error.details.reduce((acc, curr) => {
            acc[curr.path[0]] = curr.message;
            return acc;
        }, {});
        return response.status(400).json({
            success: false,
            errors: formattedErrors
        });
    }

    try{
        const editquery = `UPDATE residenttable r 
                            JOIN persontable p ON r.PersonID = p.PersonID 
                            JOIN accounttable a ON a.ResidentID = r.ResidentID
        SET p.GivenName = ?, p.MiddleName = ?, p.LastName = ?, p.Sex = ?, p.Birthday = ?, p.is_PWD = ?, r.Address = ?, r.ContactNo = ?, 
        a.email = ? WHERE r.ResidentID = ?`;

        const [updateResult] = await db.query(editquery,
        [values.GivenName, values.MiddleName, values.LastName, values.Sex, values.Birthday, values.PWD, values.address, values.ContactNo, values.email, ResidentID]);

        response.json(updateResult);
    } catch(error){
        response.status(500).json({error: "Failed to update resident"});
    }
}

exports.fetch_edit_resident =  async (req, res) => {
    try {
        const residentID = req.params.ResidentID;
        const query = `SELECT r.ResidentID, p.GivenName, p.MiddleName, p.LastName, 
        p.Sex, p.Birthday, p.is_PWD, r.address, r.ContactNo, r.RegistrationDate,
        a.email
        FROM residenttable AS r
        JOIN persontable AS p ON r.PersonID = p.PersonID
        JOIN accounttable AS a ON a.ResidentID = r.ResidentID 
        WHERE r.ResidentID = ?`;

        const [records] = await db.query(query, [residentID]);
        if (records.length === 0) {
            return res.status(404).json({ error: "Resident not found" });  
        }
        res.json(records[0] || null);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.delete_resident = async (request, response) => {

    const connection = await db.getConnection();

    try {

        const { ResidentID } = request.params;
        const resID = parseInt(ResidentID);

        const [resident] = await connection.query(
            "SELECT PersonID FROM residenttable WHERE ResidentID = ?",
            [resID]
        );

        if (resident.length === 0) {
            return response.status(404).json({
                error: "Resident not found"
            });
        }

        const personID = resident[0].PersonID;

        await connection.beginTransaction();

        // DELETE CHILD/RELATED RECORDS FIRST

        // Example related tables
        await connection.query(
            "DELETE FROM accounttable WHERE ResidentID = ?",
            [resID]
        );

        // DELETE RESIDENT
        await connection.query(
            "DELETE FROM residenttable WHERE ResidentID = ?",
            [resID]
        );

        // DELETE PERSON
        await connection.query(
            "DELETE FROM persontable WHERE PersonID = ?",
            [personID]
        );

        await connection.commit();

        response.json({
            message: "Resident deleted successfully"
        });

    } catch (error) {

        if (connection) {
            await connection.rollback();
        }

        if (error.code === "ER_ROW_IS_REFERENCED_2") {
            return response.status(400).json({
                error: "Cannot delete resident because related records still exist."
            });
        }

        response.status(500).json({
            error: "Failed to delete resident"
        });

    } finally {

        if (connection) {
            connection.release();
        }
    }
};