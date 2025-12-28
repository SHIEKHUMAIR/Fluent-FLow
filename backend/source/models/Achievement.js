const { getPool } = require("../configuration/dbConfig");

class Achievement {
  // Get all achievements
  static async findAll() {
    const pool = getPool();
    const result = await pool.query("SELECT * FROM achievements ORDER BY id");
    return result.rows;
  }

  // Find achievement by key
  static async findByKey(achievementKey) {
    const pool = getPool();
    const result = await pool.query(
      "SELECT * FROM achievements WHERE achievement_key = $1",
      [achievementKey]
    );
    return result.rows[0] || null;
  }

  // Create achievement
  static async create({ achievementKey, title, description, icon, xpReward }) {
    const pool = getPool();
    const result = await pool.query(
      `INSERT INTO achievements (achievement_key, title, description, icon, xp_reward, created_at)
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
       RETURNING *`,
      [achievementKey, title, description, icon, xpReward]
    );
    return result.rows[0];
  }

  // Get user achievements
  static async findByUserId(userId) {
    const pool = getPool();
    const result = await pool.query(
      `SELECT a.*, ua.earned_at, ua.is_seen
       FROM achievements a
       JOIN user_achievements ua ON a.id = ua.achievement_id
       WHERE ua.user_id = $1
       ORDER BY ua.earned_at DESC`,
      [userId]
    );
    return result.rows;
  }

  // Mark achievement as seen
  static async markAsSeen(userId, achievementId) {
    const pool = getPool();
    await pool.query(
      `UPDATE user_achievements 
       SET is_seen = TRUE 
       WHERE user_id = $1 AND achievement_id = $2`,
      [userId, achievementId]
    );
    return true;
  }

  // Award achievement to user
  static async awardToUser(userId, achievementId) {
    const pool = getPool();
    const result = await pool.query(
      `INSERT INTO user_achievements (user_id, achievement_id, earned_at)
       VALUES ($1, $2, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id, achievement_id) DO NOTHING
       RETURNING *`,
      [userId, achievementId]
    );
    return result.rows[0] || null;
  }
}

module.exports = Achievement;

