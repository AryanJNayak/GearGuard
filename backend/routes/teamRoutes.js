const express = require("express");
const router = express.Router();
const { createTeam, addTeamMember, getAllTeams, getAllMembers, getMembersByTeamId } = require("../controllers/teamController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// Route: POST /api/teams
// Flow: verifyToken (Check Login) -> isAdmin (Check Role) -> createTeam (Do Logic)
// router.post("/", verifyToken, isAdmin, createTeam);
router.post("/", createTeam);
// router.post("/add-member", verifyToken, isAdmin, addTeamMember);
router.post("/add-member", addTeamMember);


// GET /api/teams - See all teams
// router.get("/", verifyToken, getAllTeams);
router.get("/", getAllTeams);

// GET /api/teams/members - See who is in which team
// router.get("/members", verifyToken, getAllMembers);
router.get("/members", getAllMembers);

// router.get("/members/:teamId", verifyToken, getMembersByTeamId);
router.get("/members/:teamId", getMembersByTeamId);

module.exports = router;