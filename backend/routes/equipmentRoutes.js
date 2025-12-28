const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipmentController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// Category Routes (Admin Only)
router.post('/categories', verifyToken, isAdmin, equipmentController.createCategory);
router.get('/categories', verifyToken, equipmentController.getCategories);

// Equipment Routes
router.post('/add', verifyToken, isAdmin, equipmentController.addEquipment);
router.get('/', verifyToken, equipmentController.getAllEquipment);

// Auto-Fill Route (Open to any authenticated user creating a request)
router.get('/:id/autofill', verifyToken, equipmentController.getAutoFillDetails);

module.exports = router;