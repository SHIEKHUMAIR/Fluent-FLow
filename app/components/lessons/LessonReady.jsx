"use client";

import { motion } from "framer-motion";

export default function LessonReady({ onStartQuiz, onReview }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-lg p-10 mt-12 text-center border border-slate-200"
    >
      {/* Header */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-3xl font-extrabold text-blue-900 mb-3 tracking-tight">
          You’re Ready for the Quiz
        </h2>
        <p className="text-slate-600 text-base max-w-xl mx-auto leading-relaxed">
          You’ve completed the lesson successfully. Let’s test your understanding
          and reinforce what you’ve learned before moving forward.
        </p>
      </motion.div>

      {/* Divider Line */}
      <div className="mt-6 mb-8 flex items-center justify-center">
        <div className="h-[2px] w-24 bg-gradient-to-r from-blue-400 to-blue-900 rounded-full" />
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
          onClick={onReview}
          className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-blue-900 text-blue-900 rounded-2xl font-semibold transition-all hover:bg-blue-50 hover:shadow-md"
        >
          Review Lesson
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStartQuiz}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500  to-blue-900 text-white rounded-2xl font-semibold shadow-md hover:shadow-lg transition-all"
        >
          Start Quiz
          <img src="/assets/arrow-small-right.png" alt="Next" className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Footer text */}
      <p className="text-sm text-slate-500 mt-10">
        Proceed when you’re confident with all lesson concepts.
      </p>
    </motion.div>
  );
}
