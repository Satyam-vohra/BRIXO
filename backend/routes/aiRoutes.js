const express = require("express");
const router = express.Router();
const { suggestColors, generateContent } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

// Both endpoints require auth
router.post("/suggest-colors", protect, suggestColors);
router.post("/generate-content", protect, generateContent);

module.exports = router;
