const express = require("express");
const router = express.Router();

const {
  createWebsite,
  saveWebsite,
  getWebsite,
  updateWebsite,
  deleteWebsite,
  getUserWebsites,
  publishWebsite,
  saveAndPublishWebsite,
  unpublishWebsite
} = require("../controllers/websiteController");

const { protect } = require("../middleware/authMiddleware");

// RESTful protected website routes
router.post("/", protect, createWebsite);
router.get("/user/:userId", protect, getUserWebsites);

// Backward-compatible protected route aliases
router.post("/save", protect, saveWebsite);
router.put("/update", protect, updateWebsite);
router.post("/publish", protect, publishWebsite);
router.post("/save-and-publish", protect, saveAndPublishWebsite);

router.put("/:id", protect, updateWebsite);
router.delete("/:id", protect, deleteWebsite);
router.post("/:id/publish", protect, publishWebsite);
router.post("/:id/unpublish", protect, unpublishWebsite);

// Public route to view website configuration
router.get("/:id", getWebsite);

module.exports = router;
