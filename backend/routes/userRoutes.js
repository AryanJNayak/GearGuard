const express = require("express");
const router = express.Router();
const { getAllUsers, getProfile, updateProfile } = require("../controllers/userController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// GET /api/users - See all registered users (Admin only)
router.get("/", verifyToken, isAdmin, getAllUsers);

// GET /api/users/me - profile for current user
router.get('/me', verifyToken, getProfile);

// PUT /api/users/me - update profile
router.put('/me', verifyToken, updateProfile);

module.exports = router;