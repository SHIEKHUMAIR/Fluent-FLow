const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const { connectDB, getPool } = require("../source/configuration/dbConfig");

async function ensureLesson0() {
  try {
    await connectDB();
    const pool = getPool();
    console.log("🔍 Checking for Lesson 0...");

    const check = await pool.query('SELECT * FROM lessons WHERE "lesson_number" = 0'); 
    
    if (check.rows.length === 0) {
        console.log("⚠️ Lesson 0 not found. Inserting default Lesson 0...");
        
        // Fetch Unit 1 ID
        const unitRes = await pool.query('SELECT id FROM units WHERE "unit_number" = 1');
        if (unitRes.rows.length === 0) {
            throw new Error("Unit 1 not found! Cannot insert Lesson 0.");
        }
        const unitId = unitRes.rows[0].id;

        const insertQuery = `
            INSERT INTO lessons (
                "unit_id", "lesson_number", "category", "title", "description", "duration", "path", "order_index"
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;
        
        const values = [
            unitId, 
            0, 
            'beginner', 
            'Lesson 0 - Introduction', 
            'Get started with Pinyin, tones, and Chinese pronunciation.', 
            '10 min', 
            '/modules/unit01/lesson0', 
            0
        ];

        const inserted = await pool.query(insertQuery, values);
        console.log("✅ Successfully inserted Lesson 0:", inserted.rows[0]);
    } else {
        console.log("✅ Lesson 0 already exists:", check.rows[0]);
    }
    process.exit(0);
  } catch (error) {
    console.error("❌ Error ensuring Lesson 0:", error);
    process.exit(1);
  }
}

ensureLesson0();
