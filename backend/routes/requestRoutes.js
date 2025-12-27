const express = require("express");
const router = express.Router();
const { createRequest, getAllRequests, getTeamRequests, updateStatus } = require("../controllers/requestController");
// const { verifyToken } = require("../middleware/authMiddleware");

// Route: POST /api/requests/add
router.post("/add", createRequest);

router.get("/", getAllRequests);
router.get("/my-team/:user_id", getTeamRequests);
router.get("/my-team/:user_id", getTeamRequests);
router.post("/status/", updateStatus);

module.exports = router;