const { getPool } = require("../configuration/dbConfig");

class UserActivity {
  // Get recent activities for a user
  static async findByUserId(userId, limit = 10) {
    const pool = getPool();
    const result = await pool.query(
      `SELECT * FROM user_activity 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2`,
      [userId, limit]
    );
    return result.rows;
  }

  // Create activity
  static async create({ userId, activityType, activityDescription, xpEarned = 0 }) {
    const pool = getPool();
    const result = await pool.query(
      `INSERT INTO user_activity (user_id, activity_type, activity_description, xp_earned, created_at)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
       RETURNING *`,
      [userId, activityType, activityDescription, xpEarned]
    );
    return result.rows[0];
  }
}

module.exports = UserActivity;

