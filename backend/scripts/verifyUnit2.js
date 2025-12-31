
const { connectDB, getPool } = require("../source/configuration/dbConfig");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

async function verify() {
  await connectDB();
  const pool = getPool();

  const lessons = await pool.query("SELECT * FROM lessons WHERE unit_id = (SELECT id FROM units WHERE unit_number = 2) ORDER BY lesson_number");
  console.log("Lessons found:", lessons.rows.length);
  
  lessons.rows.forEach(l => {
        console.log(`    Lesson ${l.lesson_number}: ${l.title} - Category: ${l.category}`);
  });
  process.exit(0);
}

verify();
