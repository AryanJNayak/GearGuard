const express = require("express");
const router = express.Router();
const { createCategory, addEquipment, getAutoFillDetails, getCategories, getEquipment } = require("../controllers/equipmentController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// Route: POST /api/equipment/categories
router.post("/categories", verifyToken, isAdmin, createCategory);
router.get("/categories", verifyToken, getCategories);

// Equipment add (regular users can add)
router.post("/add", verifyToken, addEquipment);
router.get("/", verifyToken, getEquipment);

router.get("/:id/autofill", verifyToken, getAutoFillDetails);

module.exports = router;