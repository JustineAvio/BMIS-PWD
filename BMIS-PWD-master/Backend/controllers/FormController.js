const db = require("../config/db.js");

// 1. GET ALL FORMS (General List)
exports.getForms = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM applicationtable");
        res.json(rows);
    } catch (error) {
        console.error("Error fetching forms:", error);
        res.status(500).json({ error: "An error occurred while fetching forms." });
    }
};

exports.requestform = async (req, res) => {
    const { GivenName, MiddleName, LastName, AppType, ContactNo } = req.body;

    const DateofApplication = new Date();
    const defaultStatus = "Submitted";
    const fullname = `${GivenName} ${MiddleName ? MiddleName + " " : ""}${LastName}`;
    try {
        const query = "INSERT INTO applicationtable (AccountID, FullName, ApplicationType, PhoneNo, Status, DateSubmitted) VALUES (?, ?, ?, ?, ?, ?)";
        const [result] = await db.query(query, [3, fullname, AppType, ContactNo, defaultStatus, DateofApplication]);

        res.json({
            message: "Form submitted successfully",
            formId: result.insertId
        });
    } catch (error) {
        console.error("Error submitting form:", error);
        res.status(500).json({ error: "An error occurred while submitting the form." });
    }
};

// 3. ADMIN VIEWS FORM (Triggers "In Review" status)
exports.reviewform = async (req, res) => {
    const ApplicationID = req.params.id;

    try {
        const [rows] = await db.query("SELECT * FROM applicationtable WHERE ApplicationID = ?", [ApplicationID]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: "Form not found." });
        }

        let message = "Form has already been processed.";
        
        // FIX: Change 'formstatus' to 'Status' to match your DB column
        const currentStatus = rows[0].Status; 

        if (currentStatus === "Submitted") {
            await db.query(
                "UPDATE applicationtable SET Status = ? WHERE ApplicationID = ?", 
                ["In Review", ApplicationID]
            );
            rows[0].Status = "In Review"; // Update the object before returning
            message = "Form status updated to In Review";
        } else if (currentStatus === "In Review") {
            message = "Form is already under review";
        }

        res.json({ 
            message: message, 
            form: rows[0] 
        });
    } catch (error) {
        console.error("Error opening form for review:", error);
        res.status(500).json({ error: "An error occurred while opening the form." });
    }
};

// 4. ADMIN DECISION (Approve or Reject)
exports.formdecision = async (req, res) => {
    const ApplicationID = req.params.id;
    const { decision } = req.body; // Expecting "Approved" or "Rejected"

    // Validation to prevent garbage data in the status column
    const validDecisions = ["Approved", "Rejected"];
    if (!validDecisions.includes(decision)) {
        return res.status(400).json({ error: "Invalid decision. Use 'Approved' or 'Rejected'." });
    }

    try {
        const [result] = await db.query(
            "UPDATE applicationtable SET Status = ? WHERE ApplicationID = ?", 
            [decision, ApplicationID]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Form not found." });
        }

        res.json({ message: `Form has been successfully ${decision}.` });
    } catch (error) {
        console.error("Error making decision on form:", error);
        res.status(500).json({ error: "An error occurred while processing the decision." });
    }
};