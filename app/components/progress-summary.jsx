"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export function ProgressSummary({ progress, onRestart }) {
  const percentage = Math.round(
    (progress.score / progress.totalQuestions) * 100
  )

  const getEncouragement = () => {
    if (percentage >= 90) return "优秀! (Excellent!) 🎉"
    if (percentage >= 70) return "很好! (Very good!) ✨"
    if (percentage >= 50) return "不错! (Not bad!) 💪"
    return "继续努力! (Keep trying!) 🌱"
  }

  const getGrade = () => {
    if (percentage >= 90) return "A"
    if (percentage >= 80) return "B"
    if (percentage >= 70) return "C"
    if (percentage >= 60) return "D"
    return "F"
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 p-4 sm:p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10"
      >
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900 border-b pb-3 sm:pb-4 mb-6 sm:mb-8">
          📊 Progress Report
        </h1>

        {/* Report Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Left: Summary */}
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-blue-900">
              {getGrade()}
            </div>
            <div className="space-y-2 text-slate-700 text-base sm:text-lg">
              <p>
                <span className="font-semibold">Score:</span> {progress.score} / {progress.totalQuestions}
              </p>
              <p>
                <span className="font-semibold">Percentage:</span> {percentage}%
              </p>
              <p>{getEncouragement()}</p>
            </div>
          </div>

          {/* Right: Progress Bar */}
          <div className="flex flex-col justify-center">
            <p className="mb-2 sm:mb-3 text-slate-600 font-medium text-sm sm:text-base">
              Overall Progress
            </p>
            <div className="w-full bg-slate-200 rounded-full h-4 sm:h-5 md:h-6 shadow-inner overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-900"
              />
            </div>
            <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-slate-500">
              You answered {progress.score} out of {progress.totalQuestions} correctly.
            </p>
          </div>
        </div>

        {/* Footer: Actions */}
        <div className="mt-8 sm:mt-10 md:mt-12 flex flex-col items-center justify-center gap-4 sm:gap-6">
          {/* Leading Line */}
          <p className="text-base sm:text-lg md:text-xl font-medium text-slate-700 text-center">
            Unlock full potential with personalized learning & progress tracking
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            {/* Retry Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRestart}
              className="group flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl 
                         bg-emerald-500 text-white text-base sm:text-lg font-semibold 
                         transition-all w-full sm:w-auto"
            >
              Try Again
              <img
                src="/assets/retry.png"
                alt="Retry"
                className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:rotate-180"
              />
            </motion.button>

            {/* Sign Up Button */}
            <Link href="/auth?tab=register" scroll={false} className="w-full sm:w-auto">
              <motion.button
              whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl 
                           bg-blue-900 text-white text-base sm:text-lg font-semibold shadow-lg 
                           hover:shadow-xl transition-all w-full sm:w-auto"
              >
                Sign Up Now
                <img
                  src="/assets/arrow-up-right.png"
                  alt="arrow"
                  className="w-5 h-5 sm:w-6 sm:h-6 transform transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
