const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const { connectDB, getPool } = require("../source/configuration/dbConfig");

async function checkLesson0ID() {
  try {
    await connectDB();
    const pool = getPool();
    const res = await pool.query('SELECT id, "lesson_number", title FROM lessons WHERE "lesson_number" = 0');
    if (res.rows.length > 0) {
        console.log("FOUND LESSON 0:", res.rows[0]);
    } else {
        console.log("LESSON 0 NOT FOUND");
    }
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
checkLesson0ID();
