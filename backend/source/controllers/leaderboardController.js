const User = require("../models/User");
const UserStats = require("../models/UserStats");
const UserActivity = require("../models/UserActivity");
const { getPool } = require("../configuration/dbConfig");

// Get leaderboard data
exports.getLeaderboard = async (req, res) => {
  try {
    const { period = "week" } = req.query; // week, month, alltime
    const userId = req.user?.id || req.body?.userId || req.query?.userId;

    const pool = getPool();
    let leaderboardQuery;

    if (period === "alltime") {
      // All time leaderboard - use total_xp from user_stats
      leaderboardQuery = `
        SELECT 
          u.id,
          u.first_name,
          u.last_name,
          u.profile_image,
          COALESCE(us.total_xp, 0) as xp,
          COALESCE(us.current_streak, 0) as streak,
          COALESCE(us.lessons_completed, 0) as lessons_completed
        FROM users u
        LEFT JOIN user_stats us ON u.id = us.user_id
        ORDER BY COALESCE(us.total_xp, 0) DESC, u.id ASC
        LIMIT 100
      `;
    } else if (period === "month") {
      // Monthly leaderboard - sum XP from activities in the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      leaderboardQuery = `
        SELECT 
          u.id,
          u.first_name,
          u.last_name,
          u.profile_image,
          COALESCE(SUM(ua.xp_earned), 0) as xp,
          COALESCE(MAX(us.current_streak), 0) as streak,
          COALESCE(MAX(us.lessons_completed), 0) as lessons_completed
        FROM users u
        LEFT JOIN user_activity ua ON u.id = ua.user_id 
          AND ua.created_at >= $1
        LEFT JOIN user_stats us ON u.id = us.user_id
        GROUP BY u.id, u.first_name, u.last_name, u.profile_image
        ORDER BY xp DESC, u.id ASC
        LIMIT 100
      `;
    } else {
      // Weekly leaderboard - sum XP from activities in the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      leaderboardQuery = `
        SELECT 
          u.id,
          u.first_name,
          u.last_name,
          u.profile_image,
          COALESCE(SUM(ua.xp_earned), 0) as xp,
          COALESCE(MAX(us.current_streak), 0) as streak,
          COALESCE(MAX(us.lessons_completed), 0) as lessons_completed
        FROM users u
        LEFT JOIN user_activity ua ON u.id = ua.user_id 
          AND ua.created_at >= $1
        LEFT JOIN user_stats us ON u.id = us.user_id
        GROUP BY u.id, u.first_name, u.last_name, u.profile_image
        ORDER BY xp DESC, u.id ASC
        LIMIT 100
      `;
    }

    let result;
    if (period === "alltime") {
      result = await pool.query(leaderboardQuery);
    } else {
      const dateParam = period === "month" 
        ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      result = await pool.query(leaderboardQuery, [dateParam]);
    }

    // Format the leaderboard data
    const leaderboard = result.rows.map((row, index) => ({
      rank: index + 1,
      userId: row.id,
      firstName: row.first_name,
      lastName: row.last_name,
      fullName: `${row.first_name || ''} ${row.last_name || ''}`.trim() || 'Anonymous',
      initials: `${(row.first_name || '').charAt(0)}${(row.last_name || '').charAt(0)}`.toUpperCase() || 'U',
      profileImage: row.profile_image,
      xp: parseInt(row.xp) || 0,
      streak: parseInt(row.streak) || 0,
      lessonsCompleted: parseInt(row.lessons_completed) || 0,
      isCurrentUser: userId && parseInt(userId) === row.id
    }));

    // Get current user's position if logged in
    let currentUserRank = null;
    let currentUserData = null;
    if (userId) {
      const userIndex = leaderboard.findIndex(u => u.userId === parseInt(userId));
      if (userIndex !== -1) {
        currentUserRank = userIndex + 1;
        currentUserData = leaderboard[userIndex];
      } else {
        // User not in top 100, get their individual stats
        let userXp = 0;
        if (period === "alltime") {
          const userStats = await UserStats.findByUserId(parseInt(userId));
          userXp = userStats?.total_xp || 0;
        } else {
          const dateParam = period === "month" 
            ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          
          const userActivityResult = await pool.query(
            `SELECT COALESCE(SUM(xp_earned), 0) as xp 
             FROM user_activity 
             WHERE user_id = $1 AND created_at >= $2`,
            [parseInt(userId), dateParam]
          );
          userXp = parseInt(userActivityResult.rows[0]?.xp) || 0;
        }

        // Get count of users with more XP
        let rankResult;
        if (period === "alltime") {
          rankResult = await pool.query(
            `SELECT COUNT(*) as rank
             FROM user_stats
             WHERE total_xp > $1`,
            [userXp]
          );
        } else {
          const dateParam = period === "month" 
            ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          
          rankResult = await pool.query(
            `SELECT COUNT(DISTINCT user_id) as rank
             FROM (
               SELECT user_id, SUM(xp_earned) as total_xp
               FROM user_activity
               WHERE created_at >= $2
               GROUP BY user_id
               HAVING SUM(xp_earned) > $1
             ) as user_totals`,
            [userXp, dateParam]
          );
        }

        currentUserRank = parseInt(rankResult.rows[0]?.rank) + 1 || null;
        
        // Get user info
        const user = await User.findById(parseInt(userId));
        if (user) {
          const userStats = await UserStats.findByUserId(parseInt(userId));
          currentUserData = {
            rank: currentUserRank,
            userId: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            fullName: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Anonymous',
            initials: `${(user.first_name || '').charAt(0)}${(user.last_name || '').charAt(0)}`.toUpperCase() || 'U',
            profileImage: user.profile_image,
            xp: userXp,
            streak: userStats?.current_streak || 0,
            lessonsCompleted: userStats?.lessons_completed || 0,
            isCurrentUser: true
          };
        }
      }
    }

    res.json({
      success: true,
      data: {
        leaderboard,
        currentUser: currentUserData,
        period
      }
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch leaderboard", 
      error: error.message 
    });
  }
};

