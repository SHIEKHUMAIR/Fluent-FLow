const { getPool } = require("../configuration/dbConfig");

class UserStats {
  // Get user stats
  static async findByUserId(userId) {
    const pool = getPool();
    const result = await pool.query(
      "SELECT * FROM user_stats WHERE user_id = $1",
      [userId]
    );
    return result.rows[0] || null;
  }

  // Initialize user stats
  static async initialize(userId) {
    const pool = getPool();
    const result = await pool.query(
      `INSERT INTO user_stats (user_id, total_xp, words_learned, lessons_completed, study_time_minutes, current_streak, longest_streak, created_at, updated_at)
       VALUES ($1, 0, 0, 0, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id) DO NOTHING
       RETURNING *`,
      [userId]
    );
    return result.rows[0] || await this.findByUserId(userId);
  }

  // Update user stats
  static async update(userId, updates) {
    const pool = getPool();
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (updates.totalXp !== undefined) {
      fields.push(`total_xp = total_xp + $${paramCount++}`);
      values.push(updates.totalXp);
    }
    if (updates.wordsLearned !== undefined) {
      fields.push(`words_learned = words_learned + $${paramCount++}`);
      values.push(updates.wordsLearned);
    }
    if (updates.lessonsCompleted !== undefined) {
      fields.push(`lessons_completed = lessons_completed + $${paramCount++}`);
      values.push(updates.lessonsCompleted);
    }
    if (updates.studyTimeMinutes !== undefined) {
      fields.push(`study_time_minutes = study_time_minutes + $${paramCount++}`);
      values.push(updates.studyTimeMinutes);
    }
    if (updates.currentStreak !== undefined) {
      fields.push(`current_streak = $${paramCount++}`);
      values.push(updates.currentStreak);
    }
    if (updates.longestStreak !== undefined) {
      fields.push(`longest_streak = GREATEST(longest_streak, $${paramCount++})`);
      values.push(updates.longestStreak);
    }
    if (updates.lastStudyDate) {
      fields.push(`last_study_date = $${paramCount++}`);
      values.push(updates.lastStudyDate);
    }

    if (fields.length === 0) return null;

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(userId);

    const result = await pool.query(
      `UPDATE user_stats SET ${fields.join(", ")} WHERE user_id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  // Update streak based on last study date
  static async updateStreak(userId) {
    const pool = getPool();
    const stats = await this.findByUserId(userId);
    if (!stats) return null;

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    let newStreak = stats.current_streak || 0;
    let longestStreak = stats.longest_streak || 0;

    if (!stats.last_study_date) {
      // First time studying
      newStreak = 1;
    } else if (stats.last_study_date === yesterday || stats.last_study_date === today) {
      // Continuing streak
      if (stats.last_study_date === yesterday) {
        newStreak = (stats.current_streak || 0) + 1;
      } else {
        newStreak = stats.current_streak || 1;
      }
    } else {
      // Streak broken
      newStreak = 1;
    }

    longestStreak = Math.max(longestStreak, newStreak);

    return await this.update(userId, {
      currentStreak: newStreak,
      longestStreak: longestStreak,
      lastStudyDate: today
    });
  }
}

module.exports = UserStats;

