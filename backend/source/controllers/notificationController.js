const User = require("../models/User");
const { sendNotification } = require("../services/notificationService");

exports.saveSubscription = async (req, res) => {
  try {
    // Debug: Log what's in req.user
    console.log("--- Save Subscription Debug ---");
    console.log("req.user:", req.user);
    
    if (!req.user || !req.user.id) {
      console.error("❌ req.user or req.user.id is missing!");
      return res.status(401).json({ 
        error: "User ID not found in token. Please log in again.",
        debug: { hasUser: !!req.user, userId: req.user?.id }
      });
    }
    
    const { subscription } = req.body;
    
    if (!subscription) {
      return res.status(400).json({ error: "Subscription object is required" });
    }

    // Validate subscription structure
    if (!subscription.endpoint || !subscription.keys || !subscription.keys.p256dh || !subscription.keys.auth) {
      return res.status(400).json({ error: "Invalid subscription format: missing required fields" });
    }

    // User ID is in req.user from authMiddleware
    let userId = req.user.id;
    
    // Ensure userId is an integer
    if (typeof userId === 'string') {
        userId = parseInt(userId);
    }
    
    if (isNaN(userId)) {
        console.error("❌ Invalid userId:", req.user.id);
        return res.status(400).json({ 
            error: "Invalid user ID format",
            debug: { originalUserId: req.user.id, type: typeof req.user.id }
        });
    }
    
    console.log("Saving subscription for userId:", userId, "(type:", typeof userId, ")");

    await User.update(userId, { pushSubscription: subscription });

    res.status(200).json({ message: "Subscription saved successfully" });
  } catch (error) {
    console.error("Error saving subscription:", error);
    res.status(500).json({ error: "Failed to save subscription", details: error.message });
  }
};

exports.deleteSubscription = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ 
        error: "User ID not found in token. Please log in again."
      });
    }
    
    let userId = req.user.id;
    if (typeof userId === 'string') {
        userId = parseInt(userId);
    }
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }
    
    await User.update(userId, { pushSubscription: null });
    res.status(200).json({ message: "Subscription removed successfully" });
  } catch (error) {
    console.error("Error deleting subscription:", error);
    res.status(500).json({ error: "Failed to delete subscription", details: error.message });
  }
};

exports.sendTestNotification = async (req, res) => {
    try {
        // Debug: Log what's in req.user
        console.log("--- Test Notification Debug ---");
        console.log("req.user:", req.user);
        console.log("req.user.id:", req.user?.id);
        console.log("req.user type:", typeof req.user?.id);
        
        if (!req.user || !req.user.id) {
            console.error("❌ req.user or req.user.id is missing!");
            console.error("req.user:", JSON.stringify(req.user, null, 2));
            return res.status(401).json({ 
                error: "User ID not found in token. Please log in again.",
                debug: { hasUser: !!req.user, userId: req.user?.id }
            });
        }
        
        let userId = req.user.id;
        
        // Ensure userId is an integer
        if (typeof userId === 'string') {
            userId = parseInt(userId);
        }
        
        if (isNaN(userId)) {
            console.error("❌ Invalid userId:", req.user.id);
            return res.status(400).json({ 
                error: "Invalid user ID format",
                debug: { originalUserId: req.user.id, type: typeof req.user.id }
            });
        }
        
        console.log("Using userId:", userId, "(type:", typeof userId, ")");
        
        const user = await User.findById(userId);
        
        if (!user || !user.push_subscription) {
            return res.status(404).json({ error: "No subscription found. Please enable push notifications first." });
        }
        
        let subscription;
        try {
            subscription = typeof user.push_subscription === 'string' 
                ? JSON.parse(user.push_subscription) 
                : user.push_subscription;
        } catch (parseError) {
            console.error("Failed to parse subscription:", parseError);
            return res.status(400).json({ error: "Invalid subscription format" });
        }

        // Validate subscription structure
        if (!subscription.endpoint || !subscription.keys) {
            return res.status(400).json({ error: "Invalid subscription: missing endpoint or keys" });
        }
        
        await sendNotification(subscription, {
            title: "Test Notification",
            body: "This is a test notification from Fluent Flow!",
            icon: "/favicon.png",
            requireInteraction: true, // Keep notification visible until user clicks
            tag: "test-notification"
        });
        
        res.status(200).json({ message: "Test notification sent successfully!" });
    } catch (error) {
        console.error("Error sending test notification:", error);
        
        // Handle expired subscriptions
        if (error.expired || error.statusCode === 410) {
            // Remove invalid subscription from database
            try {
                await User.update(req.user.id, { pushSubscription: null });
            } catch (updateError) {
                console.error("Failed to remove expired subscription:", updateError);
            }
            return res.status(410).json({ 
                error: "Subscription expired. Please re-enable push notifications.",
                expired: true
            });
        }
        
        // Handle not found subscriptions
        if (error.notFound || error.statusCode === 404) {
            return res.status(404).json({ 
                error: "Subscription not found. Please re-enable push notifications.",
                notFound: true
            });
        }
        
        // Handle invalid subscriptions
        if (error.invalid || error.statusCode === 400) {
            return res.status(400).json({ 
                error: "Invalid subscription. Please re-enable push notifications.",
                invalid: true
            });
        }
        
        res.status(500).json({ 
            error: "Failed to send test notification", 
            details: error.message || "Unknown error occurred"
        });
    }
};

exports.getPublicKey = (req, res) => {
    const { getVapidPublicKey } = require("../services/notificationService");
    const key = getVapidPublicKey();
    
    if (!key) {
        return res.status(500).json({ error: "VAPID public key not configured" });
    }
    
    res.status(200).json({ publicKey: key });
};
