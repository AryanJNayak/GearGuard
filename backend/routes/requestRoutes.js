const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// 1. Create Request (Any logged-in user)
router.post('/add', verifyToken, requestController.createRequest);

// 2. View All Requests (Admin Only)
router.get('/', verifyToken, isAdmin, requestController.getAllRequests);

// 3. View My Team's Requests (Team Members)
router.get('/my-team', verifyToken, requestController.getTeamRequests);

// 4. Update Status (Protected by internal controller logic)
router.post('/status', verifyToken, requestController.updateStatus);
router.get('/stats', verifyToken, requestController.getDashboardStats);
module.exports = router;