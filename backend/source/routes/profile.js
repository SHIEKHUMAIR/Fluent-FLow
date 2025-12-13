const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");

// Get user profile
router.get("/", profileController.getProfile);

// Update user profile
router.post("/update", profileController.updateProfile);
router.put("/update", profileController.updateProfile);

module.exports = router;

