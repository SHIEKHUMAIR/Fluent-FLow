const { Pool } = require("pg");

let pool;

async function connectDB() {
  try {
    pool = new Pool({
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || "fluent_flow",
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "",
      ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
    });

    // Test connection
    const client = await pool.connect();
    console.log("✅ Connected to PostgreSQL (fluent_flow)");
    
    // Create users table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        profile_image TEXT,
        phone VARCHAR(50),
        date_of_birth DATE,
        country VARCHAR(100),
        residence_country VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Add profile columns if they don't exist (for existing databases)
    await client.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='profile_image') THEN
          ALTER TABLE users ADD COLUMN profile_image TEXT;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='phone') THEN
          ALTER TABLE users ADD COLUMN phone VARCHAR(50);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='date_of_birth') THEN
          ALTER TABLE users ADD COLUMN date_of_birth DATE;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='country') THEN
          ALTER TABLE users ADD COLUMN country VARCHAR(100);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='residence_country') THEN
          ALTER TABLE users ADD COLUMN residence_country VARCHAR(100);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='push_subscription') THEN
          ALTER TABLE users ADD COLUMN push_subscription TEXT;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='notification_time') THEN
          ALTER TABLE users ADD COLUMN notification_time VARCHAR(10);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='timezone') THEN
          ALTER TABLE users ADD COLUMN timezone VARCHAR(100);
        END IF;
      END $$;
    `);
    
    // Create index on email for faster lookups
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
    `);
    
    // Create units table
    await client.query(`
      CREATE TABLE IF NOT EXISTS units (
        id SERIAL PRIMARY KEY,
        unit_number INTEGER UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        icon VARCHAR(50),
        color VARCHAR(50),
        lesson_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create lessons table
    await client.query(`
      CREATE TABLE IF NOT EXISTS lessons (
        id SERIAL PRIMARY KEY,
        lesson_number INTEGER NOT NULL,
        unit_id INTEGER REFERENCES units(id) ON DELETE CASCADE,
        category VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        duration VARCHAR(50),
        path VARCHAR(255),
        order_index INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(unit_id, lesson_number)
      )
    `);

    // Create vocabulary table (learning slides)
    await client.query(`
      CREATE TABLE IF NOT EXISTS vocabulary (
        id SERIAL PRIMARY KEY,
        lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
        vocabulary_id VARCHAR(100) NOT NULL,
        chinese VARCHAR(255) NOT NULL,
        pinyin VARCHAR(255) NOT NULL,
        english VARCHAR(255) NOT NULL,
        image VARCHAR(500),
        order_index INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(lesson_id, vocabulary_id)
      )
    `);

    // Create questions table (MCQ and Audio Quiz)
    await client.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id SERIAL PRIMARY KEY,
        lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
        question_id VARCHAR(100) NOT NULL,
        question_type VARCHAR(50) NOT NULL CHECK (question_type IN ('mcq', 'audio')),
        image VARCHAR(500),
        text TEXT,
        chinese VARCHAR(255),
        audio_text VARCHAR(255),
        choices JSONB NOT NULL,
        correct_answer INTEGER NOT NULL,
        order_index INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(lesson_id, question_id)
      )
    `);

    // Create matching_tasks table
    await client.query(`
      CREATE TABLE IF NOT EXISTS matching_tasks (
        id SERIAL PRIMARY KEY,
        lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
        task_group VARCHAR(100) NOT NULL,
        left_items JSONB NOT NULL,
        right_items JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(lesson_id, task_group)
      )
    `);

    // Create user_progress table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_progress (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
        progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
        completed BOOLEAN DEFAULT FALSE,
        score INTEGER DEFAULT 0,
        time_spent INTEGER DEFAULT 0,
        last_accessed TIMESTAMP,
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, lesson_id)
      )
    `);

    // Create user_stats table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_stats (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE,
        total_xp INTEGER DEFAULT 0,
        words_learned INTEGER DEFAULT 0,
        lessons_completed INTEGER DEFAULT 0,
        study_time_minutes INTEGER DEFAULT 0,
        current_streak INTEGER DEFAULT 0,
        longest_streak INTEGER DEFAULT 0,
        last_study_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create user_activity table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_activity (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        activity_type VARCHAR(50) NOT NULL,
        activity_description TEXT NOT NULL,
        xp_earned INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create achievements table
    await client.query(`
      CREATE TABLE IF NOT EXISTS achievements (
        id SERIAL PRIMARY KEY,
        achievement_key VARCHAR(100) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        icon VARCHAR(50),
        xp_reward INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create user_achievements table (many-to-many)
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_achievements (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        achievement_id INTEGER REFERENCES achievements(id) ON DELETE CASCADE,
        earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, achievement_id)
      )
    `);

    // Add daily goals columns to user_stats if they don't exist
    await client.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_stats' AND column_name='daily_study_time_minutes') THEN
          ALTER TABLE user_stats ADD COLUMN daily_study_time_minutes INTEGER DEFAULT 0;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_stats' AND column_name='consecutive_goal_days') THEN
          ALTER TABLE user_stats ADD COLUMN consecutive_goal_days INTEGER DEFAULT 0;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_stats' AND column_name='frozen_streak') THEN
          ALTER TABLE user_stats ADD COLUMN frozen_streak INTEGER DEFAULT 0;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_stats' AND column_name='last_goal_met_date') THEN
          ALTER TABLE user_stats ADD COLUMN last_goal_met_date DATE;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_stats' AND column_name='streak_recovery_badges') THEN
          ALTER TABLE user_stats ADD COLUMN streak_recovery_badges INTEGER DEFAULT 0;
        END IF;
      END $$;
    `);

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_lessons_unit_id ON lessons(unit_id);
      CREATE INDEX IF NOT EXISTS idx_lessons_order ON lessons(unit_id, order_index);
      CREATE INDEX IF NOT EXISTS idx_vocabulary_lesson_id ON vocabulary(lesson_id);
      CREATE INDEX IF NOT EXISTS idx_questions_lesson_id ON questions(lesson_id);
      CREATE INDEX IF NOT EXISTS idx_matching_tasks_lesson_id ON matching_tasks(lesson_id);
      CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
      CREATE INDEX IF NOT EXISTS idx_user_progress_lesson_id ON user_progress(lesson_id);
      CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);
      CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON user_activity(user_id, created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
    `);
    
    client.release();
    console.log("✅ All database tables ready");
  } catch (err) {
    console.error("❌ PostgreSQL connection error:", err.message);
    process.exit(1);
  }
}

function getPool() {
  if (!pool) {
    throw new Error("Database pool not initialized. Call connectDB() first.");
  }
  return pool;
}

module.exports = { connectDB, getPool };
