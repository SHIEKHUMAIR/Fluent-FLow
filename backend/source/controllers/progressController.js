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
      beginner: { completed: 0, total: 0 },
      intermediate: { completed: 0, total: 0 },
      elementary: { completed: 0, total: 0 }
    };

    // Count all lessons by category
    allLessons.forEach(lesson => {
      const category = lesson.category;
      if (progressByCategory[category]) {
        progressByCategory[category].total++;
        const userProgress = progressMap[lesson.id];
        if (userProgress && userProgress.completed) {
          progressByCategory[category].completed++;
        }
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

    if (!lessonId) {
      return res.status(400).json({ success: false, message: "Lesson ID is required" });
    }

    // Calculate XP based on improvement (3 XP per new correct answer)
    // 1. Fetch old progress to get previous high score
    const oldProgress = await UserProgress.findByUserAndLesson(userIdInt, lessonId);
    const oldScore = oldProgress ? oldProgress.score : 0;
    const newScore = parseInt(score) || 0;
    
    // 2. Calculate improvement
    // Only award XP if the new score is higher than the previous best
    let xpEarned = 0;
    if (newScore > oldScore) {
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

    if (completed && !oldProgress) {
       // Just marking as completed for stats if it's the first time
       statsUpdates.lessonsCompleted = 1;
    }

    if (Object.keys(statsUpdates).length > 0) {
      await UserStats.update(userIdInt, statsUpdates);
      // New method handles streak, daily time, and badges
      const timeSpentMinutes = timeSpent || 0;
      await UserStats.updateDailyProgress(userIdInt, timezoneOffset, timeSpentMinutes);
    }

    res.json({ success: true, data: progress });
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ success: false, message: "Failed to update progress", error: error.message });
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

