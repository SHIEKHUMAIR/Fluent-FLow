const express = require("express");
const router = express.Router();
const chatbotController = require("../controllers/chatbotController");
const authMiddleware = require("../middleware/authMiddleware");

// POST /api/chatbot/generate-roadmap
router.post("/generate-roadmap", authMiddleware, chatbotController.generateRoadmap);

module.exports = router;
