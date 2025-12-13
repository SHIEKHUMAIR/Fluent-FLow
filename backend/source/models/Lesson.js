const { getPool } = require("../configuration/dbConfig");

class Lesson {
  // Get all lessons
  static async findAll() {
    const pool = getPool();
    const result = await pool.query(
      `SELECT l.*, u.unit_number, u.title as unit_title
       FROM lessons l
       JOIN units u ON l.unit_id = u.id
       ORDER BY u.unit_number, l.order_index`
    );
    return result.rows;
  }

  // Find lesson by ID
  static async findById(id) {
    const pool = getPool();
    const result = await pool.query(
      `SELECT l.*, u.unit_number, u.title as unit_title
       FROM lessons l
       JOIN units u ON l.unit_id = u.id
       WHERE l.id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  // Find lessons by unit ID
  static async findByUnitId(unitId) {
    const pool = getPool();
    const result = await pool.query(
      `SELECT l.*, u.unit_number, u.title as unit_title
       FROM lessons l
       JOIN units u ON l.unit_id = u.id
       WHERE l.unit_id = $1
       ORDER BY l.order_index`,
      [unitId]
    );
    return result.rows;
  }

  // Find lesson by unit number and lesson number
  static async findByUnitAndLessonNumber(unitNumber, lessonNumber) {
    const pool = getPool();
    const result = await pool.query(
      `SELECT l.*, u.unit_number, u.title as unit_title
       FROM lessons l
       JOIN units u ON l.unit_id = u.id
       WHERE u.unit_number = $1 AND l.lesson_number = $2`,
      [unitNumber, lessonNumber]
    );
    return result.rows[0] || null;
  }

  // Create new lesson
  static async create({ unitId, lessonNumber, category, title, description, duration, path, orderIndex }) {
    const pool = getPool();
    const result = await pool.query(
      `INSERT INTO lessons (unit_id, lesson_number, category, title, description, duration, path, order_index, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING *`,
      [unitId, lessonNumber, category, title, description, duration, path, orderIndex]
    );
    return result.rows[0];
  }

  // Update lesson
  static async update(id, updates) {
    const pool = getPool();
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (updates.category) {
      fields.push(`category = $${paramCount++}`);
      values.push(updates.category);
    }
    if (updates.title) {
      fields.push(`title = $${paramCount++}`);
      values.push(updates.title);
    }
    if (updates.description) {
      fields.push(`description = $${paramCount++}`);
      values.push(updates.description);
    }
    if (updates.duration) {
      fields.push(`duration = $${paramCount++}`);
      values.push(updates.duration);
    }
    if (updates.path) {
      fields.push(`path = $${paramCount++}`);
      values.push(updates.path);
    }
    if (updates.orderIndex !== undefined) {
      fields.push(`order_index = $${paramCount++}`);
      values.push(updates.orderIndex);
    }

    if (fields.length === 0) return null;

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await pool.query(
      `UPDATE lessons SET ${fields.join(", ")} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }
}

module.exports = Lesson;

