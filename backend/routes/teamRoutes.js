const express = require("express");
const router = express.Router();
const { createTeam, addTeamMember, getAllTeams, getAllMembers, getMembersByTeamId } = require("../controllers/teamController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// Route: POST /api/teams
// Flow: verifyToken (Check Login) -> isAdmin (Check Role) -> createTeam (Do Logic)
router.post("/", verifyToken, isAdmin, createTeam);
router.post("/add-member", verifyToken, isAdmin, addTeamMember);


// GET /api/teams - See all teams (protected)
router.get("/", verifyToken, getAllTeams);

// GET /api/teams/members - See who is in which team (protected)
router.get("/members", verifyToken, getAllMembers);

router.get("/members/:teamId", verifyToken, getMembersByTeamId);

module.exports = router;