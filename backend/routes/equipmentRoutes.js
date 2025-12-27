const express = require("express");
const router = express.Router();
const { createCategory, addEquipment, getAutoFillDetails } = require("../controllers/equipmentController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// Route: POST /api/equipment/categories
// router.post("/categories", verifyToken, isAdmin, equipmentController.createCategory);
router.post("/categories", createCategory);
router.post("/add", addEquipment);
router.get("/:id/autofill", getAutoFillDetails);

module.exports = router;