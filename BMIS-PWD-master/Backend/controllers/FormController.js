const db = require("../config/db.js");

// ===============================
// 1. GET ALL FORMS
// ===============================
exports.getForms = async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM applicationtable ORDER BY DateSubmitted DESC"
        );

        res.status(200).json(rows);

    } catch (error) {
        console.error("Error fetching forms:", error);

        res.status(500).json({
            success: false,
            message: "An error occurred while fetching forms."
        });
    }
};

// ===============================
// 2. SUBMIT APPLICATION FORM
// ===============================
exports.requestform = async (req, res) => {

    const { id } = req.params;

    const {
        GivenName,
        MiddleName,
        LastName,
        AppType,
        ContactNo
    } = req.body;

    // Basic Validation
    if (!GivenName || !LastName || !AppType || !ContactNo) {
        return res.status(400).json({
            success: false,
            message: "Please fill in all required fields."
        });
    }

    try {
        
        const [existing] = await db.query(
            `SELECT * FROM applicationtable 
             WHERE AccountID = ? 
             AND ApplicationType = ?
             AND Status IN ('Submitted', 'In Review')`,
            [id, AppType]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                message: "You already have a pending application of this type."
            });
        }

        const fullname =
            `${GivenName.trim()} ${MiddleName ? MiddleName.trim() + " " : ""}${LastName.trim()}`;

        const defaultStatus = "Submitted";

        const DateofApplication = new Date();

        const query = `
            INSERT INTO applicationtable
            (
                AccountID,
                FullName,
                ApplicationType,
                PhoneNo,
                Status,
                DateSubmitted
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(query, [
            id,
            fullname,
            AppType,
            ContactNo,
            defaultStatus,
            DateofApplication
        ]);

        res.status(201).json({
            success: true,
            message: "Form submitted successfully.",
            formId: result.insertId
        });

    } catch (error) {

        console.error("Error submitting form:", error);

        res.status(500).json({
            success: false,
            message: "An error occurred while submitting the form."
        });
    }
};

// ===============================
// 3. REVIEW FORM
// ===============================
exports.reviewform = async (req, res) => {

    const ApplicationID = req.params.id;

    try {

        const [rows] = await db.query(
            "SELECT * FROM applicationtable WHERE ApplicationID = ?",
            [ApplicationID]
        );

        // Check if form exists
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Form not found."
            });
        }

        const form = rows[0];

        let message = "";

        // Update only if submitted
        if (form.Status === "Submitted") {

            await db.query(
                "UPDATE applicationtable SET Status = ? WHERE ApplicationID = ?",
                ["In Review", ApplicationID]
            );

            form.Status = "In Review";

            message = "Form status updated to In Review.";

        } else if (form.Status === "In Review") {

            message = "Form is already under review.";

        } else {

            message = `Form already ${form.Status}.`;
        }

        res.status(200).json({
            success: true,
            message,
            form
        });

    } catch (error) {

        console.error("Error reviewing form:", error);

        res.status(500).json({
            success: false,
            message: "An error occurred while reviewing the form."
        });
    }
};

// ===============================
// 4. FORM DECISION
// ===============================
exports.formdecision = async (req, res) => {

    const ApplicationID = req.params.id;

    const { decision } = req.body;

    const validDecisions = ["Approved", "Rejected"];

    // Validate decision
    if (!validDecisions.includes(decision)) {
        return res.status(400).json({
            success: false,
            message: "Invalid decision. Use Approved or Rejected only."
        });
    }

    try {

        // Check first if form exists
        const [rows] = await db.query(
            "SELECT * FROM applicationtable WHERE ApplicationID = ?",
            [ApplicationID]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Form not found."
            });
        }

        // Prevent multiple decisions
        if (
            rows[0].Status === "Approved" ||
            rows[0].Status === "Rejected"
        ) {
            return res.status(400).json({
                success: false,
                message: `Form already ${rows[0].Status}.`
            });
        }

        // Update status
        await db.query(
            "UPDATE applicationtable SET Status = ? WHERE ApplicationID = ?",
            [decision, ApplicationID]
        );

        res.status(200).json({
            success: true,
            message: `Form has been successfully ${decision}.`
        });

    } catch (error) {

        console.error("Error making form decision:", error);

        res.status(500).json({
            success: false,
            message: "An error occurred while processing the decision."
        });
    }
};