const db = require("../config/db.js");
const bcrypt = require("bcrypt");
const { sendResetEmail } = require("../services/emailService.js");
const jwt = require("jsonwebtoken");
const { generateResetToken } = require("../utils/token.js");

exports.login = async (request, response) => {
    const { username, password } = request.body;

    if (!username || !password) {
        return response.status(400).json({ error: "Username and password are required" });
    }

    try {
        const [accounts] = await db.query("SELECT * FROM accounttable WHERE username = ?",
            [username]);

        if (accounts.length === 0) {
            return response.status(404).json({ error: "Username not found" });
        }

        const user = accounts[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            const accessToken = jwt.sign(
                {
                    "username": user.username,
                    "role": user.role
                },
                process.env.SECRET_KEY,
                { expiresIn: "1h" }
            )

            const refreshToken = jwt.sign(
                {
                    "username": user.username,
                    "role": user.role
                },
                process.env.REFRESH_KEY,
                { expiresIn: "1d" }
            )

            return response.json({
                success: true,
                username: user.username,
                role: user.role,
                accessToken,
                refreshToken
            });

            // if(user.role === "admin"){
            //     return response.json({
            //         success: true,
            //         role: user.role
            //     })
            // }
            // if(user.role === "staff"){
            //     return response.json({
            //         success: true,
            //         role: user.role
            //     })
            // }
            // if(user.role === "resident"){
            //     return response.json({
            //         success: true,
            //         role: user.role
            //     })
            // }
        } else {
            response.status(401).json({ error: "Invalid username or password" });
        }
    } catch (error) {
        console.error("Error during login:", error);
        response.status(500).json({ error: "An error occurred during login" });
    }
};

exports.register = async (req, response) => {

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const values = [
            req.body.GivenName, req.body.MiddleName, req.body.LastName,
            req.body.Sex, req.body.Birthday, req.body.PWD,
            req.body.email, req.body.PhoneNo
        ];

        const [residentResult] = await connection.query(
            "INSERT INTO residenttable (GivenName, MiddleName, LastName, Sex, Birthday, PWD, Email, PhoneNo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            values
        );

        const residentID = residentResult.insertId;
        const hashpass = await bcrypt.hash(req.body.password, 10);

        await connection.query(
            "INSERT INTO accounttable(username, role, password, email, ResidentID) values(?,?,?,?,?)",
            [req.body.username, "resident", hashpass, req.body.email, residentID]
        );
        await connection.commit();
        console.log("Transaction committed successfully!");
        response.status(200).json({ success: true, message: "Added Successfully" });

    } catch (err) {
        await connection.rollback();
        console.error("Transaction failed, rolled back:", err);
        response.status(500).json({ error: "Registration failed" });
    } finally {
        connection.release();
    }
}


exports.forgotpass = async (req, res) => {
    // 1. Always trim the email to avoid hidden spaces
    const email = req.body.email;

    try {
        // 2. Check if user exists
        const [rows] = await db.query(
            "SELECT * FROM accounttable WHERE email = ?", [email]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Email not found" });
        }

        const token = generateResetToken();

        // 4. Run the UPDATE
        const [result] = await db.query(
            "UPDATE accounttable SET reset_token = ?, reset_expires = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE email = ?",
            [token, email]
        );

        // 5. CRITICAL: Stop if the database didn't actually change
        if (result.affectedRows === 0) {
            console.log("Database found user but failed to update token.", email);
            return res.status(500).json({ message: "Failed to save reset token." });
        }

        // 6. Only send email if DB update was successful
        const resetLink = `http://localhost:5173/reset-password/${token}`;

        await sendResetEmail(email, resetLink);


        res.json({ message: "RESET PASSWORD EMAIL LINK SENT SUCCESSFULLY!" });

    } catch (err) {
        console.error("SERVER ERROR:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

exports.resetpass = async (req, res) => {
    const { token } = req.params;
    const { password: newPassword } = req.body;

    // Log the incoming data to make sure frontend is sending it right
    console.log("Attempting reset for token:", token);
    if (!newPassword) {
        return res.status(400).json({ message: "New password is required" });
    }

    try {
        const [rows] = await db.query(
            "SELECT * FROM accounttable WHERE reset_token = ? AND reset_expires > NOW()",
            [token]
        );

        if (rows.length === 0) {
            console.log("Token not found or expired in DB");
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const [result] = await db.query(
            "UPDATE accounttable SET password = ?, reset_token = NULL, reset_expires = NULL WHERE reset_token = ?",
            [hashedPassword, token]
        );

        console.log("Update successful. Rows affected:", result.affectedRows);
        res.json({ message: "Password successfully reset" });

    } catch (err) {
        console.log("ERROR TRIGGERED:");
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}