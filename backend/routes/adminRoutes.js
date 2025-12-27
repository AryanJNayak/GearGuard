const express = require('express');
const router = express.Router();
const { resetDatabase } = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// POST /api/admin/reset
router.post('/reset', verifyToken, isAdmin, resetDatabase);

// POST /api/admin/promote - promote a user to admin
router.post('/promote', verifyToken, isAdmin, (req, res) => {
    // forward to controller
    const { promoteUser } = require('../controllers/adminController');
    return promoteUser(req, res);
});

module.exports = router;