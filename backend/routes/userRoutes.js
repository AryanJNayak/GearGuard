const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Protected Routes
router.get('/me', verifyToken, userController.getProfile);
router.get('/', verifyToken, userController.getAllUsers); // Used for assigning equipment
router.put('/profile', verifyToken, userController.updateProfile);
module.exports = router;