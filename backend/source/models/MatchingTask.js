const { getPool } = require("../configuration/dbConfig");

class MatchingTask {
  // Get all matching tasks for a lesson
  static async findByLessonId(lessonId) {
    const pool = getPool();
    const result = await pool.query(
      "SELECT * FROM matching_tasks WHERE lesson_id = $1",
      [lessonId]
    );
    return result.rows.map(row => ({
      ...row,
      left_items: typeof row.left_items === 'string' ? JSON.parse(row.left_items) : row.left_items,
      right_items: typeof row.right_items === 'string' ? JSON.parse(row.right_items) : row.right_items
    }));
  }

  // Create matching tasks (bulk insert)
  static async createMany(taskItems) {
    if (!taskItems || taskItems.length === 0) return [];

    const pool = getPool();
    const results = [];

    for (const item of taskItems) {
      const result = await pool.query(
        `INSERT INTO matching_tasks (lesson_id, task_group, left_items, right_items)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (lesson_id, task_group) DO UPDATE SET
           left_items = EXCLUDED.left_items,
           right_items = EXCLUDED.right_items
         RETURNING *`,
        [
          item.lessonId,
          item.taskGroup,
          JSON.stringify(item.leftItems),
          JSON.stringify(item.rightItems)
        ]
      );
      const row = result.rows[0];
      results.push({
        ...row,
        left_items: typeof row.left_items === 'string' ? JSON.parse(row.left_items) : row.left_items,
        right_items: typeof row.right_items === 'string' ? JSON.parse(row.right_items) : row.right_items
      });
    }

    return results;
  }

  // Delete all matching tasks for a lesson
  static async deleteByLessonId(lessonId) {
    const pool = getPool();
    await pool.query("DELETE FROM matching_tasks WHERE lesson_id = $1", [lessonId]);
  }
}

module.exports = MatchingTask;

