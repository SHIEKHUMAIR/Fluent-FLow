const { getPool } = require("../configuration/dbConfig");

class Vocabulary {
  // Get all vocabulary for a lesson
  static async findByLessonId(lessonId) {
    const pool = getPool();
    const result = await pool.query(
      "SELECT * FROM vocabulary WHERE lesson_id = $1 ORDER BY order_index",
      [lessonId]
    );
    return result.rows;
  }

  // Create vocabulary items (bulk insert)
  static async createMany(vocabularyItems) {
    if (!vocabularyItems || vocabularyItems.length === 0) return [];

    const pool = getPool();
    const results = [];

    for (const item of vocabularyItems) {
      const result = await pool.query(
        `INSERT INTO vocabulary (lesson_id, vocabulary_id, chinese, pinyin, english, image, order_index)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (lesson_id, vocabulary_id) DO UPDATE SET
           chinese = EXCLUDED.chinese,
           pinyin = EXCLUDED.pinyin,
           english = EXCLUDED.english,
           image = EXCLUDED.image,
           order_index = EXCLUDED.order_index
         RETURNING *`,
        [item.lessonId, item.vocabularyId, item.chinese, item.pinyin, item.english, item.image, item.orderIndex]
      );
      results.push(result.rows[0]);
    }

    return results;
  }

  // Delete all vocabulary for a lesson
  static async deleteByLessonId(lessonId) {
    const pool = getPool();
    await pool.query("DELETE FROM vocabulary WHERE lesson_id = $1", [lessonId]);
  }
}

module.exports = Vocabulary;

