const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// All team management routes are Admin protected
router.post('/create', verifyToken, isAdmin, teamController.createTeam);
router.post('/add-member', verifyToken, isAdmin, teamController.addTeamMember);
router.get('/', verifyToken, teamController.getAllTeams);
router.get('/members/:teamId', verifyToken, teamController.getTeamMembers);

module.exports = router;