const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const { connectDB } = require("../source/configuration/dbConfig");
const Unit = require("../source/models/Unit");
const Lesson = require("../source/models/Lesson");
const Vocabulary = require("../source/models/Vocabulary");
const Question = require("../source/models/Question");
const MatchingTask = require("../source/models/MatchingTask");

// Path to data directory
const DATA_DIR = path.join(__dirname, "../../data");

async function seedUnit(unitNumber) {
  try {
    await connectDB();
    console.log(`📦 Starting seed for Unit ${unitNumber}...`);

    // Load lessons.json
    const lessonsData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "lessons.json"), "utf8"));

    // Find or create unit
    let unit = await Unit.findByUnitNumber(unitNumber);
    if (!unit) {
      const unitConfigs = {
        1: {
          title: "UNIT 1: FOUNDATION",
          description: "Learn the essential Chinese sounds and tones through native audio, guided pinyin charts, and pronunciation practice.",
          icon: "chat",
          color: "blue"
        },
        2: {
          title: "UNIT 2: Daily Life & Words",
          description: "Learn essential words and phrases for daily activities, shopping, food, transport, and common locations in Mandarin.",
          icon: "book",
          color: "green"
        },
        3: {
          title: "UNIT 3: Elementary Mandarin",
          description: "Explore describing people, numbers, and technology, and practice vocabulary to build a solid foundation.",
          icon: "document",
          color: "purple"
        },
        4: {
          title: "UNIT 4: Work & Travel",
          description: "Master vocabulary for work, business, travel, and emergency situations.",
          icon: "briefcase",
          color: "orange"
        },
        5: {
          title: "UNIT 5: Culture & Society",
          description: "Learn about Chinese festivals, customs, and social etiquette.",
          icon: "globe",
          color: "red"
        },
        6: {
          title: "UNIT 6: Advanced Topics",
          description: "Discuss complex topics like environment, economy, and technology.",
          icon: "lightbulb",
          color: "cyan"
        }
      };

      const config = unitConfigs[unitNumber];
      if (!config) {
        console.error(`❌ Invalid unit number: ${unitNumber}`);
        process.exit(1);
      }

      unit = await Unit.create({
        unitNumber: unitNumber,
        ...config
      });
      console.log(`✅ Created unit ${unitNumber}`);
    } else {
      console.log(`✅ Unit ${unitNumber} already exists`);
    }

    // Determine lesson range for this unit
    let lessonRange;
    if (unitNumber === 1) {
      lessonRange = { start: 0, end: 9 };
    } else if (unitNumber === 2) {
      lessonRange = { start: 10, end: 17 };
    } else if (unitNumber === 3) {
      lessonRange = { start: 18, end: 25 };
    } else if (unitNumber === 4) {
      lessonRange = { start: 26, end: 33 };
    } else if (unitNumber === 5) {
      lessonRange = { start: 34, end: 41 };
    } else if (unitNumber === 6) {
      lessonRange = { start: 42, end: 49 };
    } else {
      console.error(`❌ Invalid unit number: ${unitNumber}`);
      process.exit(1);
    }

    // Process lessons for this unit
    const unitLessons = lessonsData.lessons.filter(
      lesson => lesson.id >= lessonRange.start && lesson.id <= lessonRange.end
    );

    for (const lessonMeta of unitLessons) {
      console.log(`Processing ${lessonMeta.title}...`);

      // Check if lesson already exists
      let lesson = await Lesson.findByUnitAndLessonNumber(unitNumber, lessonMeta.id);
      
      if (!lesson) {
        // Create lesson
        lesson = await Lesson.create({
          unitId: unit.id,
          lessonNumber: lessonMeta.id,
          category: lessonMeta.category,
          title: lessonMeta.title,
          description: lessonMeta.desc,
          duration: lessonMeta.duration,
          path: lessonMeta.path,
          orderIndex: lessonMeta.id
        });
        console.log(`  ✅ Created lesson ${lessonMeta.id}`);
      } else {
        console.log(`  ⏭️  Lesson ${lessonMeta.id} already exists, skipping...`);
        continue;
      }

      // Load lesson JSON file
      const lessonFileName = `lesson${lessonMeta.id}.json`;
      const lessonFilePath = path.join(DATA_DIR, lessonFileName);

      if (fs.existsSync(lessonFilePath)) {
        const lessonData = JSON.parse(fs.readFileSync(lessonFilePath, "utf8"));

        // Insert vocabulary (learning slides)
        if (lessonData.learningSlides && lessonData.learningSlides.length > 0) {
          const vocabularyItems = lessonData.learningSlides.map((slide, index) => ({
            lessonId: lesson.id,
            vocabularyId: slide.id,
            chinese: slide.chinese,
            pinyin: slide.pinyin,
            english: slide.english,
            image: slide.image,
            orderIndex: index
          }));
          await Vocabulary.createMany(vocabularyItems);
          console.log(`    ✅ Added ${vocabularyItems.length} vocabulary items`);
        }

        // Insert MCQ questions
        if (lessonData.mcqQuestions && lessonData.mcqQuestions.length > 0) {
          const mcqItems = lessonData.mcqQuestions.map((q, index) => ({
            lessonId: lesson.id,
            questionId: q.id,
            questionType: "mcq",
            image: q.image || null,
            text: q.text || null,
            choices: q.choices,
            correctAnswer: q.correct,
            orderIndex: index
          }));
          await Question.createMany(mcqItems);
          console.log(`    ✅ Added ${mcqItems.length} MCQ questions`);
        }

        // Insert audio quiz questions
        if (lessonData.audioQuiz && lessonData.audioQuiz.length > 0) {
          const audioItems = lessonData.audioQuiz.map((q, index) => ({
            lessonId: lesson.id,
            questionId: q.id,
            questionType: "audio",
            chinese: q.chinese || null,
            audioText: q.audioText || null,
            choices: q.choices,
            correctAnswer: q.correct,
            orderIndex: index
          }));
          await Question.createMany(audioItems);
          console.log(`    ✅ Added ${audioItems.length} audio quiz questions`);
        }

        // Insert matching tasks
        if (lessonData.matchingTasks) {
          const matchingItems = Object.entries(lessonData.matchingTasks).map(([taskGroup, taskData]) => ({
            lessonId: lesson.id,
            taskGroup: taskGroup,
            leftItems: taskData.left || taskData.leftItems || [],
            rightItems: taskData.right || taskData.rightItems || []
          }));
          await MatchingTask.createMany(matchingItems);
          console.log(`    ✅ Added ${matchingItems.length} matching tasks`);
        }
      } else {
        console.log(`    ⚠️  Lesson file not found: ${lessonFileName}`);
      }

      console.log(`  ✅ ${lessonMeta.title} completed`);
    }

    console.log(`🎉 Unit ${unitNumber} seed completed successfully!`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding unit:", error);
    process.exit(1);
  }
}

// Get unit number from command line argument
const unitNumber = parseInt(process.argv[2]);

if (!unitNumber || isNaN(unitNumber) || unitNumber < 1 || unitNumber > 6) {
  console.error("Usage: node seedUnit.js <unitNumber>");
  console.error("Example: node seedUnit.js 1");
  console.error("Valid unit numbers: 1 to 6");
  process.exit(1);
}

seedUnit(unitNumber);

