const { getPool } = require("../configuration/dbConfig");

class Unit {
  // Get all units
  static async findAll() {
    const pool = getPool();
    const result = await pool.query(
      `SELECT u.*, COUNT(l.id) as lesson_count 
       FROM units u 
       LEFT JOIN lessons l ON u.id = l.unit_id 
       GROUP BY u.id 
       ORDER BY u.unit_number`
    );
    return result.rows;
  }

  // Find unit by ID
  static async findById(id) {
    const pool = getPool();
    const result = await pool.query("SELECT * FROM units WHERE id = $1", [id]);
    return result.rows[0] || null;
  }

  // Find unit by unit number
  static async findByUnitNumber(unitNumber) {
    const pool = getPool();
    const result = await pool.query("SELECT * FROM units WHERE unit_number = $1", [unitNumber]);
    return result.rows[0] || null;
  }

  // Create new unit
  static async create({ unitNumber, title, description, icon, color }) {
    const pool = getPool();
    const result = await pool.query(
      `INSERT INTO units (unit_number, title, description, icon, color, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING *`,
      [unitNumber, title, description, icon, color]
    );
    return result.rows[0];
  }

  // Update unit
  static async update(id, updates) {
    const pool = getPool();
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (updates.title) {
      fields.push(`title = $${paramCount++}`);
      values.push(updates.title);
    }
    if (updates.description) {
      fields.push(`description = $${paramCount++}`);
      values.push(updates.description);
    }
    if (updates.icon) {
      fields.push(`icon = $${paramCount++}`);
      values.push(updates.icon);
    }
    if (updates.color) {
      fields.push(`color = $${paramCount++}`);
      values.push(updates.color);
    }

    if (fields.length === 0) return null;

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await pool.query(
      `UPDATE units SET ${fields.join(", ")} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  // Delete unit
  static async delete(id) {
    const pool = getPool();
    await pool.query("DELETE FROM units WHERE id = $1", [id]);
    return true;
  }
}

module.exports = Unit;

