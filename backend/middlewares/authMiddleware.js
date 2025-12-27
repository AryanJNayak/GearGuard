const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;


// 1. Verify the User is Logged In
exports.verifyToken = (req, res, next) => {
    // Get token from header (Format: "Bearer <token>")
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Remove "Bearer"
    console.log("Verfiy token", authHeader)
    if (!token) {
        return res.status(403).json({ message: "No token provided. Access denied." });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("Verfied")
        req.user = decoded; // Attach user data (id, isAdmin) to the request
        next(); // Move to the next function
    } catch (err) {
        return res.status(401).json({ message: "Invalid Token" });
    }
};

// 2. Verify the User is an Admin
exports.isAdmin = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        console.log("Not admin");
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next(); // User is Admin, allow them to proceed
};