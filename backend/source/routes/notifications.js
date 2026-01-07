const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const authMiddleware = require("../middleware/authMiddleware");

// All routes here should be protected
router.use(authMiddleware);

router.post("/subscribe", notificationController.saveSubscription);
router.delete("/subscribe", notificationController.deleteSubscription);
router.post("/test", notificationController.sendTestNotification);
router.get("/vapid-public-key", notificationController.getPublicKey);

module.exports = router;
