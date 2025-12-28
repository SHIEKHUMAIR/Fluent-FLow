const express = require("express");
const router = express.Router();
const progressController = require("../controllers/progressController");
const authMiddleware = require("../middleware/authMiddleware");

// Get dashboard data
router.get("/dashboard", progressController.getDashboard);

// Get user stats
router.get("/stats", progressController.getUserStats);

// Get user activities
router.get("/activities", progressController.getUserActivities);

// Get lesson progress
router.get("/lesson/:lessonId", authMiddleware, progressController.getLessonProgress);

// Update progress
router.post("/update", authMiddleware, progressController.updateProgress);

// Mark achievement as seen
router.post('/mark-seen', authMiddleware, progressController.markInternalAchievementSeen);

// Recover streak
router.post("/recover-streak", progressController.recoverStreak);

module.exports = router;

