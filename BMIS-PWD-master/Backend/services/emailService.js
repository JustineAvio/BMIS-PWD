const transporter = require("../config/mailer.js");

const sendResetEmail = async(email, resetLink) => {
    const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: `Password Reset Request ${Date.now()}`, 
            text: `Click this link to reset your password: ${resetLink}`,
            html: `<p>You requested a password reset.</p><a href="${resetLink}">Click here to reset your password</a>`
        };

        await transporter.sendMail(mailOptions);
};

module.exports = { sendResetEmail };