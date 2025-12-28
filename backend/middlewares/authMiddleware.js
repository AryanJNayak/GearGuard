const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/backend-config');
// const jwt = require('jsonwebtoken');
// require('dotenv').config({ path: './config/.env' });

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    // FLAG: Robust extraction of "Bearer <token>"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Splits "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No Token Provided' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Attaches { id, role, ... } to the request object
        next();
    } catch (err) {
        res.status(403).json({ message: 'Invalid Token' });
    }
};

// Middleware to check if user is Admin
const isAdmin = (req, res, next) => {
    // FLAG: Ensure boolean check is strict
    if (req.user && req.user.is_admin) {
        next();
    } else {
        res.status(403).json({ message: 'Access Denied: Admins Only' });
    }
};

module.exports = { verifyToken, isAdmin };