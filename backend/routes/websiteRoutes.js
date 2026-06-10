const express = require("express");
const router = express.Router();

const {
  saveWebsite,
  getWebsite,
  updateWebsite,
  publishWebsite,
  saveAndPublishWebsite
} = require("../controllers/websiteController");

const { protect } = require("../middleware/authMiddleware");

// Protected routes (require JWT authorization)
router.post("/save", protect, saveWebsite);
router.put("/update", protect, updateWebsite);
router.post("/publish", protect, publishWebsite);
router.post("/save-and-publish", protect, saveAndPublishWebsite);

// Public route to view website configuration
router.get("/:id", getWebsite);

module.exports = router;
