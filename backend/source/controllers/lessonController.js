const Unit = require("../models/Unit");
const Lesson = require("../models/Lesson");
const Vocabulary = require("../models/Vocabulary");
const Question = require("../models/Question");
const MatchingTask = require("../models/MatchingTask");

// Get all units
exports.getAllUnits = async (req, res) => {
  try {
    const units = await Unit.findAll();
    res.json({ success: true, data: units });
  } catch (error) {
    console.error("Error fetching units:", error);
    res.status(500).json({ success: false, message: "Failed to fetch units", error: error.message });
  }
};

// Get all lessons
exports.getAllLessons = async (req, res) => {
  try {
    const lessons = await Lesson.findAll();
    res.json({ success: true, data: lessons });
  } catch (error) {
    console.error("Error fetching lessons:", error);
    res.status(500).json({ success: false, message: "Failed to fetch lessons", error: error.message });
  }
};

// Get lessons by unit
exports.getLessonsByUnit = async (req, res) => {
  try {
    const { unitId } = req.params;
    const lessons = await Lesson.findByUnitId(unitId);
    res.json({ success: true, data: lessons });
  } catch (error) {
    console.error("Error fetching lessons by unit:", error);
    res.status(500).json({ success: false, message: "Failed to fetch lessons", error: error.message });
  }
};

// Get complete lesson data (with vocabulary, questions, matching tasks)
exports.getLessonById = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const lesson = await Lesson.findById(lessonId);
    
    if (!lesson) {
      return res.status(404).json({ success: false, message: "Lesson not found" });
    }

    const vocabulary = await Vocabulary.findByLessonId(lessonId);
    const mcqQuestions = await Question.findByLessonIdAndType(lessonId, "mcq");
    const audioQuestions = await Question.findByLessonIdAndType(lessonId, "audio");
    const matchingTasks = await MatchingTask.findByLessonId(lessonId);

    // Format matching tasks to match frontend structure
    const matchingTasksFormatted = {};
    matchingTasks.forEach(task => {
      matchingTasksFormatted[task.task_group] = {
        left: task.left_items,
        right: task.right_items
      };
    });

    res.json({
      success: true,
      data: {
        lesson,
        learningSlides: vocabulary,
        mcqQuestions: mcqQuestions.map(q => ({
          id: q.question_id,
          image: q.image,
          text: q.text,
          choices: q.choices,
          correct: q.correct_answer
        })),
        audioQuiz: audioQuestions.map(q => ({
          id: q.question_id,
          chinese: q.chinese,
          audioText: q.audio_text,
          choices: q.choices,
          correct: q.correct_answer
        })),
        matchingTasks: matchingTasksFormatted
      }
    });
  } catch (error) {
    console.error("Error fetching lesson:", error);
    res.status(500).json({ success: false, message: "Failed to fetch lesson", error: error.message });
  }
};

// Get lesson by unit and lesson number
exports.getLessonByUnitAndNumber = async (req, res) => {
  try {
    const { unitNumber, lessonNumber } = req.params;
    const lesson = await Lesson.findByUnitAndLessonNumber(parseInt(unitNumber), parseInt(lessonNumber));
    
    if (!lesson) {
      return res.status(404).json({ success: false, message: "Lesson not found" });
    }

    const vocabulary = await Vocabulary.findByLessonId(lesson.id);
    const mcqQuestions = await Question.findByLessonIdAndType(lesson.id, "mcq");
    const audioQuestions = await Question.findByLessonIdAndType(lesson.id, "audio");
    const matchingTasks = await MatchingTask.findByLessonId(lesson.id);

    // Format matching tasks to match frontend structure
    const matchingTasksFormatted = {};
    matchingTasks.forEach(task => {
      matchingTasksFormatted[task.task_group] = {
        left: task.left_items,
        right: task.right_items
      };
    });

    res.json({
      success: true,
      data: {
        lesson,
        learningSlides: vocabulary.map(v => ({
          id: v.vocabulary_id,
          chinese: v.chinese,
          pinyin: v.pinyin,
          english: v.english,
          image: v.image
        })),
        mcqQuestions: mcqQuestions.map(q => ({
          id: q.question_id,
          image: q.image,
          text: q.text,
          choices: q.choices,
          correct: q.correct_answer
        })),
        audioQuiz: audioQuestions.map(q => ({
          id: q.question_id,
          chinese: q.chinese,
          audioText: q.audio_text,
          choices: q.choices,
          correct: q.correct_answer
        })),
        matchingTasks: matchingTasksFormatted
      }
    });
  } catch (error) {
    console.error("Error fetching lesson:", error);
    res.status(500).json({ success: false, message: "Failed to fetch lesson", error: error.message });
  }
};

