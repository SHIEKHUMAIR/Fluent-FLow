const express = require("express");
const router = express.Router();
const lessonController = require("../controllers/lessonController");

// Get all units
router.get("/units", lessonController.getAllUnits);

// Get all lessons
router.get("/", lessonController.getAllLessons);

// Get lessons by unit
router.get("/unit/:unitId", lessonController.getLessonsByUnit);

// Get lesson by ID (complete data)
router.get("/:lessonId", lessonController.getLessonById);

// Get lesson by unit number and lesson number
router.get("/unit/:unitNumber/lesson/:lessonNumber", lessonController.getLessonByUnitAndNumber);

module.exports = router;

