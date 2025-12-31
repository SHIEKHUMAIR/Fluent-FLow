const { getPool } = require("../configuration/dbConfig");

class User {
  // Find user by email
  static async findByEmail(email) {
    const pool = getPool();
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email.toLowerCase().trim()]
    );
    return result.rows[0] || null;
  }

  // Find user by ID
  static async findById(id) {
    const pool = getPool();
    const result = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [id]
    );
    return result.rows[0] || null;
  }

  // Create new user
  static async create({ firstName, lastName, email, password }) {
    const pool = getPool();
    const result = await pool.query(
      `INSERT INTO users (first_name, last_name, email, password, created_at, updated_at)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING *`,
      [firstName.trim(), lastName.trim(), email.toLowerCase().trim(), password]
    );
    return result.rows[0];
  }

  // Update user
  static async update(id, updates) {
    const pool = getPool();
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (updates.firstName) {
      fields.push(`first_name = $${paramCount++}`);
      values.push(updates.firstName.trim());
    }
    if (updates.lastName) {
      fields.push(`last_name = $${paramCount++}`);
      values.push(updates.lastName.trim());
    }
    if (updates.email) {
      fields.push(`email = $${paramCount++}`);
      values.push(updates.email.toLowerCase().trim());
    }
    if (updates.password) {
      fields.push(`password = $${paramCount++}`);
      values.push(updates.password);
    }
    if (updates.profileImage !== undefined) {
      fields.push(`profile_image = $${paramCount++}`);
      values.push(updates.profileImage);
    }
    if (updates.phone !== undefined) {
      fields.push(`phone = $${paramCount++}`);
      values.push(updates.phone);
    }
    if (updates.dateOfBirth !== undefined) {
      fields.push(`date_of_birth = $${paramCount++}`);
      values.push(updates.dateOfBirth);
    }
    if (updates.country !== undefined) {
      fields.push(`country = $${paramCount++}`);
      values.push(updates.country);
    }
    if (updates.residenceCountry !== undefined) {
      fields.push(`residence_country = $${paramCount++}`);
      values.push(updates.residenceCountry);
    }
    if (updates.notificationTime !== undefined) {
      fields.push(`notification_time = $${paramCount++}`);
      values.push(updates.notificationTime);
    }
    if (updates.timezone !== undefined) {
      fields.push(`timezone = $${paramCount++}`);
      values.push(updates.timezone);
    }
    if (updates.pushSubscription !== undefined) {
      fields.push(`push_subscription = $${paramCount++}`);
      values.push(typeof updates.pushSubscription === 'string' ? updates.pushSubscription : JSON.stringify(updates.pushSubscription));
    }

    if (fields.length === 0) return null;

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await pool.query(
      `UPDATE users SET ${fields.join(", ")} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  // Delete user
  static async delete(id) {
    const pool = getPool();
    const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
    return result.rows[0] || null;
  }

  // Convert database row to safe user object (without password)
  static toSafeUser(user) {
    if (!user) return null;
    return {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      profileImage: user.profile_image,
      phone: user.phone,
      dateOfBirth: user.date_of_birth,
      country: user.country,
      residenceCountry: user.residence_country,
      notificationTime: user.notification_time,
      timezone: user.timezone,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };
  }
}

module.exports = User;
