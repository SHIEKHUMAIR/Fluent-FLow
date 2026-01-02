const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const { connectDB, getPool } = require("../source/configuration/dbConfig");

// Path to data directory
const DATA_DIR = path.join(__dirname, "../../data");

async function updateLessonDetails() {
  try {
    await connectDB();
    console.log("📦 Starting lesson update...");

    // Load lessons.json
    const lessonsFilePath = path.join(DATA_DIR, "lessons.json");
    if (!fs.existsSync(lessonsFilePath)) {
      console.error("❌ lessons.json not found!");
      process.exit(1);
    }

    const lessonsData = JSON.parse(fs.readFileSync(lessonsFilePath, "utf8"));
    const pool = getPool();
    let updatedCount = 0;

    for (const lessonMeta of lessonsData.lessons) {
      // Update lesson in database
      const query = `
        UPDATE lessons 
        SET title = $1, description = $2, duration = $3, updated_at = CURRENT_TIMESTAMP 
        WHERE lesson_number = $4
        RETURNING id, title;
      `;
      
      const values = [
        lessonMeta.title, 
        lessonMeta.desc || lessonMeta.description, 
        lessonMeta.duration, 
        lessonMeta.id
      ];

      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        console.log(`✅ Updated: ${lessonMeta.title}`);
        updatedCount++;
      } else {
        console.warn(`⚠️ Lesson not found: ID ${lessonMeta.id} - ${lessonMeta.title}`);
      }
    }

    console.log(`🎉 Successfully updated ${updatedCount} lessons!`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error updating lessons:", error);
    process.exit(1);
  }
}

updateLessonDetails();
