const crypto = require("crypto");

// Use the .webcrypto or .randomUUID directly depending on Node version
const generateResetToken = () => {
    // This is the most compatible way in modern Node.js
    if (crypto.randomUUID) {
        return crypto.randomBytes(20).toString('hex');
    }
};

module.exports = { generateResetToken };