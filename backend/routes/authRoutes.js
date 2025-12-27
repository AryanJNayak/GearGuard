const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/authController");
const { forgotPassword, resetPassword } = require("../controllers/authResetController");

// Route: POST /api/auth/signup
router.post("/signup", signup);

// Route: POST /api/auth/login
router.post("/login", login);

// Route: POST /api/auth/forgot
router.post('/forgot', forgotPassword);

// Route: POST /api/auth/reset
router.post('/reset', resetPassword);

module.exports = router;