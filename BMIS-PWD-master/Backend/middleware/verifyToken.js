const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log("Raw Auth Header:", authHeader); // <--- LOG THIS
    console.log("SECRET LOADED:", process.env.JWT_SECRET ? "YES" : "NO");
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Malformed Authorization Header" });
    }

    const token = authHeader.split(' ')[1];
    console.log("Token to verify:", token); 

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log("JWT Error Details:", err.message); 
            return res.status(403).json({ error: err.message });
        }
        req.user = decoded;
        next();
    });
};

module.exports = { verifyToken };