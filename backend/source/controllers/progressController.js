const UserProgress = require("../models/UserProgress");
const UserStats = require("../models/UserStats");
const UserActivity = require("../models/UserActivity");
const Achievement = require("../models/Achievement");
const Lesson = require("../models/Lesson");

// Get user dashboard data
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user?.id || req.body?.userId || req.query?.userId;
    
    if (!userId) {
      return res.status(401).json({ success: false, message: "User ID is required" });
    }

    // Ensure userId is an integer
    const userIdInt = parseInt(userId);
    if (isNaN(userIdInt)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    // Initialize stats if they don't exist
    await UserStats.initialize(userIdInt);

    // Validate streak based on timezone if provided
    const timezoneOffset = req.query.timezoneOffset ? parseInt(req.query.timezoneOffset) : null;
    if (timezoneOffset !== null && !isNaN(timezoneOffset)) {
       await UserStats.validateStreak(userIdInt, timezoneOffset);
    }

    const stats = await UserStats.findByUserId(userIdInt);
    const progress = await UserProgress.findByUserId(userIdInt);
    const activities = await UserActivity.findByUserId(userIdInt, 5);
    const achievements = await Achievement.findByUserId(userIdInt);


    // Get all lessons to calculate total progress
    const Lesson = require("../models/Lesson");
    const allLessons = await Lesson.findAll();

    // Create a map of progress by lesson ID
    const progressMap = {};
    progress.forEach(p => {
      progressMap[p.lesson_id] = p;
    });

    // Calculate progress by category - include all lessons
    const progressByCategory = {
      beginner: { completedPercentage: 0, totalLessons: 0 },
      intermediate: { completedPercentage: 0, totalLessons: 0 },
      elementary: { completedPercentage: 0, totalLessons: 0 }
    };

    // Count all lessons and sum progress
    allLessons.forEach(lesson => {
      const category = lesson.category;
      if (progressByCategory[category]) {
        progressByCategory[category].totalLessons++;
        
        const userProgress = progressMap[lesson.id];
        let lessonProgress = 0;
        
        if (userProgress) {
            // Add the actual percentage (0-100)
            lessonProgress = parseFloat(userProgress.progress_percentage || 0);
        }
        
        progressByCategory[category].completedPercentage += lessonProgress;
      }
    });

    // Finalize percentages (Average across all lessons in category)
    Object.keys(progressByCategory).forEach(cat => {
        const data = progressByCategory[cat];
        if (data.totalLessons > 0) {
            // e.g. (Sum of Percentages) / Total Lessons
            // If 2 lessons, one 100%, one 50%, sum=150. 150/2 = 75% total progress.
            data.percentage = Math.round(data.completedPercentage / data.totalLessons);
        } else {
            data.percentage = 0;
        }
    });

    // Calculate words learned from completed lessons
    const Vocabulary = require("../models/Vocabulary");
    let wordsLearned = 0;
    for (const p of progress) {
      if (p.completed) {
        const vocab = await Vocabulary.findByLessonId(p.lesson_id);
        wordsLearned += vocab.length;
      }
    }

    res.json({
      success: true,
      data: {
        stats: {
          totalXp: stats?.total_xp || 0,
          wordsLearned: wordsLearned || stats?.words_learned || 0,
          lessonsCompleted: stats?.lessons_completed || 0,
          studyTime: stats?.study_time_minutes || 0,
          currentStreak: stats?.current_streak || 0,
          dailyStudyTimeMinutes: stats?.daily_study_time_minutes || 0,
          dailyXp: stats?.daily_xp || 0,
          consecutiveGoalDays: stats?.consecutive_goal_days || 0,
          frozenStreak: stats?.frozen_streak || 0,
          streakRecoveryBadges: stats?.streak_recovery_badges || 0
        },
        progress,
        progressByCategory,
        recentActivities: activities,
        achievements
      }
    });
  } catch (error) {
    console.error("Error fetching dashboard:", error);
    res.status(500).json({ success: false, message: "Failed to fetch dashboard", error: error.message });
  }
};

// Update lesson progress
exports.updateProgress = async (req, res) => {
  try {
    const userId = req.user?.id || req.body?.userId || req.query?.userId;
    const { lessonId, progressPercentage, completed, score, timeSpent, timezoneOffset } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "User ID is required" });
    }

    // Ensure userId is an integer
    const userIdInt = parseInt(userId);
    if (isNaN(userIdInt)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    if (lessonId === undefined || lessonId === null) {
      return res.status(400).json({ success: false, message: "Lesson ID is required" });
    }

    // Calculate XP based on improvement (3 XP per new correct answer)
    // 1. Fetch old progress to get previous high score
    const oldProgress = await UserProgress.findByUserAndLesson(userIdInt, lessonId);
    const oldScore = oldProgress ? oldProgress.score : 0;
    const newScore = parseInt(score) || 0;
    
    // Fetch lesson details to check for Lesson 0
    const currentLesson = await Lesson.findById(lessonId);

    // 2. Calculate improvement
    // Only award XP if the new score is higher than the previous best AND it's not Lesson 0
    let xpEarned = 0;
    if (newScore > oldScore && (!currentLesson || currentLesson.lesson_number !== 0)) {
       xpEarned = (newScore - oldScore) * 3;
    }

    // Update or create progress (Model handles keeping high score)
    const progress = await UserProgress.upsert({
      userId: userIdInt,
      lessonId,
      progressPercentage: progressPercentage || 0,
      completed: completed || false,
      score: score || 0,
      timeSpent: timeSpent || 0
    });

    // Update user stats
    const statsUpdates = {};
    if (timeSpent) {
      statsUpdates.studyTimeMinutes = timeSpent;
    }
    
    // Only update XP if earned
    if (xpEarned > 0) {
      statsUpdates.totalXp = xpEarned;
      
      // Fetch lesson details for the activity description
      const lesson = await Lesson.findById(lessonId);
      const lessonTitle = lesson ? lesson.title : "lesson";

      // Create activity
      await UserActivity.create({
        userId: userIdInt,
        activityType: "lesson_completed",
        activityDescription: oldProgress 
           ? `Improved score in "${lessonTitle}" (+${xpEarned} XP)`
           : `Completed "${lessonTitle}" (+${xpEarned} XP)`,
        xpEarned: xpEarned
      });
    }

    if (completed && (!oldProgress || !oldProgress.completed)) {
       // Just marking as completed for stats if it's the first time
       statsUpdates.lessonsCompleted = 1;
    }

    if (Object.keys(statsUpdates).length > 0) {
      await UserStats.update(userIdInt, statsUpdates);
      const timeSpentMinutes = timeSpent || 0;
      await UserStats.updateDailyProgress(userIdInt, timezoneOffset, timeSpentMinutes, xpEarned);
    }

    // --- ACHIEVEMENT CHECKS ---
    
    // Skip achievements for Lesson 0 (Introduction)
    if (currentLesson && currentLesson.lesson_number === 0) {
        return res.json({ success: true, data: { ...progress, newAchievements: [] } });
    }

    const newStats = await UserStats.findByUserId(userIdInt);
    const awardedBadges = [];

    // Helper to award and track
    const checkAndAward = async (key) => {
        const ach = await Achievement.findByKey(key);
        if (ach) {
            const result = await Achievement.awardToUser(userIdInt, ach.id);
            if (result) { // If inserted (not already owned)
                awardedBadges.push(ach);
            }
        }
    };
    
    // 1. First Step (1 lesson completed)
    if (newStats.lessons_completed === 1) {
        await checkAndAward('first_step');
    }
    
    // 2. Unbroken Flow (7 day streak)
    if (newStats.current_streak >= 7) {
        await checkAndAward('unbroken_flow');
    }

    // 3. Wordsmith (50 words)
    if (newStats.words_learned >= 50) {
        await checkAndAward('wordsmith');
    }

    // 4. Perfectionist (100% score)
    if (completed) {
        await checkAndAward('perfectionist');
    }

    // 5 & 6. Challenges (Weekly 750 XP, Monthly 2500 XP)
    if (xpEarned > 0) {
        const getXpSince = async (days) => {
            const date = new Date();
            date.setDate(date.getDate() - days);
            const pool = require("../configuration/dbConfig").getPool();
            const res = await pool.query(
                `SELECT SUM(xp_earned) as total FROM user_activity WHERE user_id = $1 AND created_at >= $2`,
                [userIdInt, date]
            );
            return parseInt(res.rows[0].total) || 0;
        };

        const weeklyXp = await getXpSince(7);
        if (weeklyXp >= 750) {
            await checkAndAward('dedicated_learner');
        }

        const monthlyXp = await getXpSince(30);
        if (monthlyXp >= 2500) {
            await checkAndAward('monthly_master');
        }
    }

    res.json({ success: true, data: { ...progress, newAchievements: awardedBadges } });
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ success: false, message: "Failed to update progress", error: error.message });
  }
};

// Mark achievement as seen
exports.markInternalAchievementSeen = async (req, res) => {
  try {
    const userId = req.user?.id || req.body?.userId;
    const { achievementId } = req.body;

    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!achievementId) return res.status(400).json({ success: false, message: "Achievement ID required" });

    await Achievement.markAsSeen(userId, achievementId);
    res.json({ success: true });
  } catch (error) {
    console.error("Error marking achievement seen:", error);
    res.status(500).json({ success: false, message: "Failed" });
  }
};

// Get user progress for a specific lesson
exports.getLessonProgress = async (req, res) => {
  try {
    const userId = req.user?.id || req.query?.userId;
    const { lessonId } = req.params;

    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    // Ensure userId is an integer
    const userIdInt = parseInt(userId);
    if (isNaN(userIdInt)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    const progress = await UserProgress.findByUserAndLesson(userIdInt, lessonId);
    res.json({ success: true, data: progress || { progressPercentage: 0, completed: false, score: 0 } });
  } catch (error) {
    console.error("Error fetching lesson progress:", error);
    res.status(500).json({ success: false, message: "Failed to fetch progress", error: error.message });
  }
};

// Get user stats
exports.getUserStats = async (req, res) => {
  try {
    const userId = req.user?.id || req.query?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    // Ensure userId is an integer
    const userIdInt = parseInt(userId);
    if (isNaN(userIdInt)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    await UserStats.initialize(userIdInt);
    const stats = await UserStats.findByUserId(userIdInt);
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ success: false, message: "Failed to fetch stats", error: error.message });
  }
};

// Get user activities
exports.getUserActivities = async (req, res) => {
  try {
    const userId = req.user?.id || req.query?.userId;
    const limit = parseInt(req.query?.limit) || 10;

    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    // Ensure userId is an integer
    const userIdInt = parseInt(userId);
    if (isNaN(userIdInt)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    const activities = await UserActivity.findByUserId(userIdInt, limit);
    res.json({ success: true, data: activities });
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ success: false, message: "Failed to fetch activities", error: error.message });
  }
};

// Recover streak
exports.recoverStreak = async (req, res) => {
  try {
    const userId = req.user?.id || req.body?.userId;
    const { timezoneOffset } = req.body; // Need offset to set date correctly

    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }
    
    const userIdInt = parseInt(userId);
    const result = await UserStats.recoverStreakWithTimezone(userIdInt, timezoneOffset);
    
    if (result) {
        res.json({ success: true, message: "Streak recovered successfully" });
    } else {
        res.status(400).json({ success: false, message: "Could not recover streak (No badges or frozen streak)" });
    }
  } catch (error) {
    console.error("Error recovering streak:", error);
    res.status(500).json({ success: false, message: "Failed to recover streak", error: error.message });
  }
};

