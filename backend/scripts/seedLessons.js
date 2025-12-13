const fs = require("fs");
const path = require("path");
const { connectDB } = require("../source/configuration/dbConfig");
const Unit = require("../source/models/Unit");
const Lesson = require("../source/models/Lesson");
const Vocabulary = require("../source/models/Vocabulary");
const Question = require("../source/models/Question");
const MatchingTask = require("../source/models/MatchingTask");
const Achievement = require("../source/models/Achievement");

// Path to data directory (assuming it's in the parent directory)
const DATA_DIR = path.join(__dirname, "../../data");

async function seedDatabase() {
  try {
    await connectDB();
    console.log("📦 Starting database seed...");

    // Create units
    console.log("Creating units...");
    const unit1 = await Unit.create({
      unitNumber: 1,
      title: "UNIT 1: FOUNDATION",
      description: "Learn the essential Chinese sounds and tones through native audio, guided pinyin charts, and pronunciation practice.",
      icon: "chat",
      color: "blue"
    });

    const unit2 = await Unit.create({
      unitNumber: 2,
      title: "UNIT 2: Daily Life & Words",
      description: "Learn essential words and phrases for daily activities, shopping, food, transport, and common locations in Mandarin.",
      icon: "book",
      color: "green"
    });

    const unit3 = await Unit.create({
      unitNumber: 3,
      title: "UNIT 3: Elementary Mandarin",
      description: "Explore describing people, numbers, and technology, and practice vocabulary to build a solid foundation.",
      icon: "document",
      color: "purple"
    });

    console.log("✅ Units created");

    // Load lessons.json
    const lessonsData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "lessons.json"), "utf8"));
    
    // Create achievements
    console.log("Creating achievements...");
    await Achievement.create({
      achievementKey: "first_week",
      title: "First Week",
      description: "Complete 7 days of learning",
      icon: "🏆",
      xpReward: 100
    });

    await Achievement.create({
      achievementKey: "vocabulary_master",
      title: "Vocabulary Master",
      description: "Learn 300+ words",
      icon: "🎯",
      xpReward: 150
    });

    await Achievement.create({
      achievementKey: "perfect_score",
      title: "Perfect Score",
      description: "Score 100% on a quiz",
      icon: "⭐",
      xpReward: 50
    });

    console.log("✅ Achievements created");

    // Process each lesson
    for (const lessonMeta of lessonsData.lessons) {
      console.log(`Processing ${lessonMeta.title}...`);

      // Determine unit based on lesson ID
      let unit;
      if (lessonMeta.id >= 0 && lessonMeta.id <= 9) {
        unit = unit1;
      } else if (lessonMeta.id >= 10 && lessonMeta.id <= 17) {
        unit = unit2;
      } else {
        unit = unit3;
      }

      // Create lesson
      const lesson = await Lesson.create({
        unitId: unit.id,
        lessonNumber: lessonMeta.id,
        category: lessonMeta.category,
        title: lessonMeta.title,
        description: lessonMeta.desc,
        duration: lessonMeta.duration,
        path: lessonMeta.path,
        orderIndex: lessonMeta.id
      });

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
        }
      }

      console.log(`✅ ${lessonMeta.title} processed`);
    }

    console.log("🎉 Database seed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();

