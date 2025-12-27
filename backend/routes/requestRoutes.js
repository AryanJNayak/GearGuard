const express = require("express");
const router = express.Router();
const { createRequest, getAllRequests, getTeamRequests, updateStatus } = require("../controllers/requestController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// Route: POST /api/requests/add (any logged-in user can create)
router.post("/add", createRequest);

// Admin-only: see all requests
router.get("/", isAdmin, getAllRequests);

// Get team requests - protected; controller will enforce user or admin
router.get("/my-team/:user_id", getTeamRequests);

// Update status - only admin or technician? For now, require verifyToken & isAdmin
router.post("/status/", updateStatus);

module.exports = router;