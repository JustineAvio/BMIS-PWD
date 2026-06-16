const db = require("../config/db.js");
const bcrypt = require("bcrypt");
const { sendResetEmail } = require("../services/emailService.js");
const jwt = require("jsonwebtoken");
const { generateResetToken } = require("../utils/token.js");
const { LoginValidator, signUpValidator, forgotpassValidator, resetpassValidator } = require("../validators/AuthValidator.js");

exports.login = async (req, res) => {
    const { username, password } = req.body;
    const { error, value } = LoginValidator({ username, password });

    if (error) {
    const formattedErrors = error.details.reduce((acc, curr) => {
        acc[curr.path[0]] = curr.message.replace(/['"]+/g, "");
        return acc;
    }, {});

    return res.status(400).json({
        success: false,
        errors: formattedErrors
    });
}

    try{
        const [checkaccount] = await db.query("SELECT * FROM accounttable WHERE Username = ?", [username]);

        if(checkaccount.length === 0) {
            return res.status(401).json({success: false, message: "Invalid Username or Password"});
        } else if (checkaccount.length > 0){
            const user = checkaccount[0];
            const storedHash = user.Password;

            if(user.lock_until && new Date(user.lock_until) > new Date()){
                const remainingMs = new Date(user.lock_until) - new Date();
                const remainingMinutes = Math.ceil(remainingMs / 60000);

                return res.status(403).json({
                    success: false, 
                    message: `Account is temporarily locked. Try again in ${remainingMinutes} minutes`
                });

            } 
            
            if (user.lock_until && new Date(user.lock_until) <= new Date()){
                await db.query("UPDATE accounttable SET failed_attempts = 0, lock_until = NULL WHERE username = ?",
                [username]);

                user.failed_attempts = 0;
                user.lock_until = null;
            }

            if(!password || !storedHash){
                return res.status(400).json({success: false, error: "Missing password or hash data!"});
            }

            const passwordMatch = await bcrypt.compare(password, storedHash);

            if(passwordMatch){
                await db.query("UPDATE accounttable SET failed_attempts = 0, lock_until = NULL WHERE username = ?",
                [username]);

                const payload = {
                    id: user.AccountID,
                    username: user.username || user.Username || "Unknown User",
                    role: user.role
                }
                const accessToken = jwt.sign(
                    payload,
                    process.env.SECRET_KEY,
                    { expiresIn: "1h" }
                )

                const refreshToken = jwt.sign(
                    payload,
                    process.env.REFRESH_KEY,
                    { expiresIn: "1d"}
                )

                return res.json({
                    success: true,
                    username: user.username,
                    role: user.role,
                    accessToken,
                    refreshToken
                });
            } else { 
                const newAttempts = (user.failed_attempts || 0) + 1;
                let lockUntil = null;
                let message = "Invalid username or password";

                if (newAttempts >= 5) {
                    lockUntil = new Date(Date.now() + 15 * 60000); 
                    message = "Too many failed attempts. Account locked for 15 minutes.";
                } else {
                    const remaining = 5 - newAttempts;
                    message = `Wrong username or password. ${remaining} attempts remaining before lockout.`;
                }

                await db.query(
                    "UPDATE accounttable SET failed_attempts = ?, lock_until = ? WHERE username = ?",
                    [newAttempts, lockUntil, username]
                );

                return res.status(401).json({ success: false, message });
            }
        }
    } catch (error) {
        console.error(error);   
        return res.status(500).json({error: "Interval Server Error"});
    }
};

exports.register = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const values = req.body;
        const { error, value } = signUpValidator(values);

        if(error){
            const formattedErrors = error.details.reduce((acc, curr) => {
                acc[curr.path[0]] = curr.message;
                return acc;
            }, {})

            return res.status(400).json({
                success: false,
                errors: formattedErrors
            });
        }
        const [existingUser] = await db.query(`SELECT email FROM accounttable WHERE email = ?`, [values.email]);

        if(existingUser.length > 0){
            return res.status(409).json({
                success: false, 
                message: "This email is already registered. Please use different email or log in."
            });
        }

        const [Person] = await connection.query(`INSERT INTO persontable 
            (GivenName, MiddleName, LastName, Sex, Birthday, is_PWD) VALUES (?, ?, ?, ?, ?, ?)`,
            [values.GivenName, values.MiddleName, values.LastName, values.Sex, values.Birthday, values.PWD]);

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
            [PersonID, values.Address, values.PhoneNo, new Date()]);

        const ResidentID = ResidentInfo.insertId;
        const hashedPassword = await bcrypt.hash(values.password, 10);
        
        await connection.query(`INSERT INTO accounttable (username, password, email,role, ResidentID) VALUES (?, ?, ?, ?, ?)`,
            [values.username, hashedPassword, values.email, 'resident', ResidentID]);
             
        await connection.commit();
        res.status(201).json({ success: true, message: "Registration successful!" });
    } catch (error){
        await connection.rollback();
        console.error("Error during registration:", error);
        res.status(500).json({ error: "An error occurred during registration" });
    } finally {
        connection.release();
    }
}


exports.forgotpass = async (req, res) => {
    const email = req.body.email;
    const { error, values } = forgotpassValidator({email: email});

    if(error){
        console.error("Validation error:", error.details);
        return res.send(error.details);
    }

    try{
        const [checkEmail] = await db.query(`SELECT * FROM accounttable WHERE Email = ?`, [email]);

        if(checkEmail === 0){
            return res.status(400).json ({error: "Email not found!"})
        }

        const token = generateResetToken();

        const [result] =  await db.query(
            "UPDATE accounttable SET reset_token = ?, reset_expires = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE email = ?",
            [token, email]
        );

        if(result.affectedRows === 0){ 
            return res.status(400).json({error: "The token is failed to save."});
        }

        const resetLink = `http://localhost:5173/reset-password/${token}`;

        await sendResetEmail(email, resetLink);

        res.json({message: "Reset Links has been sent to your email"})
    } catch(error){
        return res.status(500).json({error: "Server Error"})
    }
}

exports.resetpass = async (req, res) => {
    const { token } = req.params;
    const { password: newPassword } = req.body;
    const { error, values } = resetpassValidator({password: newPassword});

    if(error){
        console.error("Validation error:", error.details);
        return res.send(error.details);
    }

    try{
        const [rows] = await db.query(
            "SELECT * FROM accounttable WHERE reset_token = ? AND reset_expires > NOW()",
            [token]
        );

        if(rows.length === 0){
            return res.status(400).json({message: "Invalid or expired token"});
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const [result] = await db.query("UPDATE accounttable SET password = ?, reset_token = NULL, reset_expires = NULL WHERE reset_token = ? ",
            [hashedPassword, token]
        );

        res.json({success: true, message: "Password successfully reset"}); 
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}