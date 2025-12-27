const express = require("express");
const router = express.Router();
const { getAllUsers } = require("../controllers/userController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// GET /api/users - See all registered users (Admin only)
router.get("/", getAllUsers);

module.exports = router;