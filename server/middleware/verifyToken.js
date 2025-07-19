const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(401).json({ status: "FAILED", message: "No token provided. Please login." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ status: "FAILED", message: "Invalid token. Please login again." });
        }
        req.user = decoded;
        next(); 
    });
};

module.exports = verifyToken;
