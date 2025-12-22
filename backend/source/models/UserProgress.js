const { getPool } = require("../configuration/dbConfig");

class UserProgress {
  // Get user progress for a specific lesson
  static async findByUserAndLesson(userId, lessonId) {
    const pool = getPool();
    const result = await pool.query(
      "SELECT * FROM user_progress WHERE user_id = $1 AND lesson_id = $2",
      [userId, lessonId]
    );
    return result.rows[0] || null;
  }

  // Get all progress for a user
  static async findByUserId(userId) {
    const pool = getPool();
    const result = await pool.query(
      `SELECT up.*, l.title as lesson_title, l.category, l.unit_id, u.unit_number, l.lesson_number
       FROM user_progress up
       JOIN lessons l ON up.lesson_id = l.id
       JOIN units u ON l.unit_id = u.id
       WHERE up.user_id = $1
       ORDER BY u.unit_number, l.order_index`,
      [userId]
    );
    return result.rows;
  }

  // Create or update user progress
  static async upsert({ userId, lessonId, progressPercentage, completed, score, timeSpent }) {
    const pool = getPool();
    const result = await pool.query(
      `INSERT INTO user_progress (user_id, lesson_id, progress_percentage, completed, score, time_spent, last_accessed, completed_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, $7, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id, lesson_id)
       DO UPDATE SET
         progress_percentage = EXCLUDED.progress_percentage,
         completed = EXCLUDED.completed,
         score = EXCLUDED.score,
         time_spent = user_progress.time_spent + EXCLUDED.time_spent,
         last_accessed = CURRENT_TIMESTAMP,
         completed_at = EXCLUDED.completed_at,
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [userId, lessonId, progressPercentage, completed, score, timeSpent, completed ? new Date() : null]
    );
    return result.rows[0];
  }

  // Update progress percentage
  static async updateProgress(userId, lessonId, progressPercentage) {
    const pool = getPool();
    const result = await pool.query(
      `UPDATE user_progress 
       SET progress_percentage = $1, last_accessed = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $2 AND lesson_id = $3
       RETURNING *`,
      [progressPercentage, userId, lessonId]
    );
    return result.rows[0] || null;
  }
}

module.exports = UserProgress;

