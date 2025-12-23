const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const { connectDB } = require("../source/configuration/dbConfig");
const Unit = require("../source/models/Unit");
const Lesson = require("../source/models/Lesson");
const Vocabulary = require("../source/models/Vocabulary");
const Question = require("../source/models/Question");
const MatchingTask = require("../source/models/MatchingTask");

async function cleanUnit(unitNumber) {
  try {
    await connectDB();
    console.log(`🗑️  Starting cleanup for Unit ${unitNumber}...`);

    const unit = await Unit.findByUnitNumber(unitNumber);
    if (!unit) {
      console.log(`⚠️  Unit ${unitNumber} not found.`);
      process.exit(0);
    }

    // Find all lessons for this unit
    const lessons = await Lesson.findByUnitId(unit.id);
    console.log(`Found ${lessons.length} lessons to clean up.`);

    for (const lesson of lessons) {
      // Delete related data for each lesson
      await Vocabulary.deleteByLessonId(lesson.id);
      await Question.deleteByLessonId(lesson.id);
      await MatchingTask.deleteByLessonId(lesson.id);
      
      // Delete the lesson itself
      await Lesson.delete(lesson.id);
      console.log(`  ✅ Deleted lesson ${lesson.lesson_number}`);
    }

    // Delete the unit
    await Unit.delete(unit.id);
    console.log(`✅ Deleted Unit ${unitNumber} and all its data.`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error cleaning unit:", error);
    process.exit(1);
  }
}

const unitNumber = parseInt(process.argv[2]);
if (!unitNumber || isNaN(unitNumber)) {
  console.error("Usage: node cleanUnit.js <unitNumber>");
  process.exit(1);
}

cleanUnit(unitNumber);
