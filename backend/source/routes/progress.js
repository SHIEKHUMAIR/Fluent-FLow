const express = require("express");
const router = express.Router();
const progressController = require("../controllers/progressController");

// Get dashboard data
router.get("/dashboard", progressController.getDashboard);

// Get user stats
router.get("/stats", progressController.getUserStats);

// Get user activities
router.get("/activities", progressController.getUserActivities);

// Get lesson progress
router.get("/lesson/:lessonId", progressController.getLessonProgress);

// Update progress
router.post("/update", progressController.updateProgress);

module.exports = router;

