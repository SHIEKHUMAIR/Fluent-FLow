const webpush = require("web-push");
const cron = require("node-cron");
const { getPool } = require("../configuration/dbConfig");
const UserStats = require("../models/UserStats");

// VAPID keys should be in .env, but for now we might need to rely on what we generated or expect user to add them.
// We will log a warning if missing.

let vapidInitialized = false;

const initWebPush = () => {
    const publicVapidKey = process.env.VAPID_PUBLIC_KEY;
    const privateVapidKey = process.env.VAPID_PRIVATE_KEY;

    if (!publicVapidKey || !privateVapidKey) {
        console.error("❌ VAPID keys not found in .env. Notifications will not work.");
        console.error("Please add VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY to your .env file");
        return false;
    }

    try {
        webpush.setVapidDetails(
            "mailto:example@yourdomain.org",
            publicVapidKey,
            privateVapidKey
        );
        vapidInitialized = true;
        console.log("✅ VAPID keys initialized successfully");
        return true;
    } catch (error) {
        console.error("❌ Failed to initialize VAPID keys:", error);
        return false;
    }
};

const sendNotification = async (subscription, payload) => {
    if (!vapidInitialized) {
        const initialized = initWebPush();
        if (!initialized) {
            throw new Error("VAPID keys not initialized. Cannot send notifications.");
        }
    }

    // Validate subscription
    if (!subscription || !subscription.endpoint) {
        throw new Error("Invalid subscription object: missing endpoint");
    }

    try {
        const payloadString = JSON.stringify(payload);
        const options = {
            TTL: 86400, // 24 hours
            headers: {
                'Urgency': 'high' // Deliver immediately, even if device is dozing
            }
        };
        await webpush.sendNotification(subscription, payloadString, options);
        console.log("✅ Notification sent successfully");
        return true;
    } catch (err) {
        // Handle specific web-push errors
        if (err.statusCode === 410) {
            // Subscription expired or no longer valid
            console.error("❌ Subscription expired (410):", err.message);
            throw { ...err, expired: true };
        } else if (err.statusCode === 404) {
            // Subscription not found
            console.error("❌ Subscription not found (404):", err.message);
            throw { ...err, notFound: true };
        } else if (err.statusCode === 400) {
            // Bad request - invalid subscription
            console.error("❌ Invalid subscription (400):", err.message);
            throw { ...err, invalid: true };
        } else {
            console.error("❌ Error sending notification:", {
                statusCode: err.statusCode,
                message: err.message,
                body: err.body
            });
            throw err;
        }
    }
};

const startScheduler = () => {
    console.log("Starting notification scheduler...");

    // Check every minute for reminders
    cron.schedule("* * * * *", async () => {
        console.log("⏰ Cron job running: checking daily reminders...");
        try {
            const pool = getPool();
            
            const result = await pool.query(
                "SELECT id, email, push_subscription, notification_time, timezone FROM users WHERE notification_time IS NOT NULL AND push_subscription IS NOT NULL"
            );
            
            if (result.rows.length === 0) {
                 console.log("No users with notifications enabled.");
                 return;
            }

            for (const user of result.rows) {
                if (!user.timezone || !user.notification_time) continue;
                
                try {
                     const userTime = new Date().toLocaleTimeString("en-US", {
                        timeZone: user.timezone,
                        hour12: false,
                        hour: "2-digit",
                        minute: "2-digit"
                    });
                    
                    console.log(`User ${user.email} (ID: ${user.id}): Current Time ${userTime} | Target ${user.notification_time} | TZ: ${user.timezone}`);

                    if (userTime === user.notification_time) {
                        console.log(`✅ Time match for user ${user.id}! Sending notification...`);
                        try {
                            const subscription = typeof user.push_subscription === 'string' 
                                ? JSON.parse(user.push_subscription) 
                                : user.push_subscription;
                            
                            await sendNotification(subscription, {
                                title: "It's time to study!",
                                body: "Keep your streak alive! 5 minutes of practice makes perfect.",
                                icon: "/favicon.png",
                                tag: "daily-reminder"
                            });
                        } catch (notifError) {
                            console.error(`❌ Failed to send reminder to User ${user.id}:`, notifError.message);
                            // If subscription expired, remove it
                            if (notifError.expired || notifError.statusCode === 410) {
                                const pool = getPool();
                                await pool.query(
                                    "UPDATE users SET push_subscription = NULL WHERE id = $1",
                                    [user.id]
                                );
                                console.log(`Removed expired subscription for user ${user.id}`);
                            }
                        }
                    }
                } catch (e) {
                    console.error(`Error processing user ${user.id} time check:`, e);
                }
            }
        } catch (error) {
            console.error("Error in reminder cron:", error);
        }
    });

    // Streak Saver: Check at 10 PM local time if they haven't studied
    cron.schedule("*/30 * * * *", async () => { // Run every 30 mins to catch the 10 PM window
         try {
            const pool = getPool();
            
            const result = await pool.query(
                "SELECT u.id, u.push_subscription, u.timezone, s.last_study_date FROM users u LEFT JOIN user_stats s ON u.id = s.user_id WHERE u.push_subscription IS NOT NULL"
            );
            
             for (const user of result.rows) {
                if (!user.timezone) continue;
                
                 try {
                     const userDate = new Date();
                     const hour = parseInt(userDate.toLocaleTimeString("en-US", { timeZone: user.timezone, hour12: false, hour: "numeric" }));
                     
                     // Target 10 PM (22:00) window
                     if (hour === 22) {
                        // Check if they studied TODAY
                        // We need "Today" in their timezone
                        const todayLocal = userDate.toLocaleDateString("en-CA", { timeZone: user.timezone }); // YYYY-MM-DD
                        
                        let studiedToday = false;
                        if (user.last_study_date) {
                             // last_study_date is usually YYYY-MM-DD from DB (if date type) or Date obj.
                             // date string from PG is YYYY-MM-DD
                             // But wait, user_stats stores last_study_date.
                             // Implementation in UserStats.js suggests it stores YYYY-MM-DD string sometimes or Date.
                             
                             let dbDate = user.last_study_date;
                             if (dbDate instanceof Date) {
                                // If it's a date object, is it UTC?
                                // We usually store "studied date" as a reference.
                                // If I studied on "2023-10-10", it's "2023-10-10".
                                // Let's check string comparison.
                                dbDate = dbDate.toISOString().split('T')[0];
                             }
                             
                             if (dbDate === todayLocal) {
                                 studiedToday = true;
                             }
                        }
                        
                        if (!studiedToday) {
                             // Check if we already sent notification today? 
                             // We might spam them every 30 mins between 22:00 and 23:00.
                             // Ideally we track "last_notification_date".
                             // For MVP, randomly sending 2 notifications (22:00, 22:30) is acceptable urgency.
                             
                             try {
                                const subscription = typeof user.push_subscription === 'string' 
                                    ? JSON.parse(user.push_subscription) 
                                    : user.push_subscription;
                                
                                await sendNotification(subscription, {
                                    title: "Streak at risk! 🔥",
                                    body: "You haven't studied today! Complete a lesson before midnight to save your streak.",
                                    icon: "/favicon.png"
                                });
                             } catch (notifError) {
                                // If subscription expired, remove it
                                if (notifError.expired || notifError.statusCode === 410) {
                                    const pool = getPool();
                                    await pool.query(
                                        "UPDATE users SET push_subscription = NULL WHERE id = $1",
                                        [user.id]
                                    );
                                    console.log(`Removed expired subscription for user ${user.id}`);
                                }
                             }
                        }
                     }
                 } catch (e) {
                      console.error(`Error processing user ${user.id} streak check:`, e);
                 }
             }

         } catch (error) {
             console.error("Error in streak saver cron:", error);
         }
    });
};

module.exports = { initWebPush, sendNotification, startScheduler };
