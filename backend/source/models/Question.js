const { getPool } = require("../configuration/dbConfig");

class Question {
  // Get all questions for a lesson
  static async findByLessonId(lessonId) {
    const pool = getPool();
    const result = await pool.query(
      "SELECT * FROM questions WHERE lesson_id = $1 ORDER BY order_index",
      [lessonId]
    );
    return result.rows;
  }

  // Get questions by type for a lesson
  static async findByLessonIdAndType(lessonId, questionType) {
    const pool = getPool();
    const result = await pool.query(
      "SELECT * FROM questions WHERE lesson_id = $1 AND question_type = $2 ORDER BY order_index",
      [lessonId, questionType]
    );
    return result.rows;
  }

  // Create questions (bulk insert)
  static async createMany(questionItems) {
    if (!questionItems || questionItems.length === 0) return [];

    const pool = getPool();
    const results = [];

    for (const item of questionItems) {
      const result = await pool.query(
        `INSERT INTO questions (lesson_id, question_id, question_type, image, text, chinese, audio_text, choices, correct_answer, order_index)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (lesson_id, question_id) DO UPDATE SET
           question_type = EXCLUDED.question_type,
           image = EXCLUDED.image,
           text = EXCLUDED.text,
           chinese = EXCLUDED.chinese,
           audio_text = EXCLUDED.audio_text,
           choices = EXCLUDED.choices,
           correct_answer = EXCLUDED.correct_answer,
           order_index = EXCLUDED.order_index
         RETURNING *`,
        [
          item.lessonId,
          item.questionId,
          item.questionType,
          item.image || null,
          item.text || null,
          item.chinese || null,
          item.audioText || null,
          JSON.stringify(item.choices),
          item.correctAnswer,
          item.orderIndex
        ]
      );
      const row = result.rows[0];
      results.push({
        ...row,
        choices: typeof row.choices === 'string' ? JSON.parse(row.choices) : row.choices
      });
    }

    return results;
  }

  // Delete all questions for a lesson
  static async deleteByLessonId(lessonId) {
    const pool = getPool();
    await pool.query("DELETE FROM questions WHERE lesson_id = $1", [lessonId]);
  }
}

module.exports = Question;

