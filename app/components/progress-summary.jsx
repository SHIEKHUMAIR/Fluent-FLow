"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./custom-card"

export function ProgressSummary({ progress, onRestart }) {
  const percentage = Math.round((progress.score / progress.totalQuestions) * 100)

  const getEncouragement = () => {
    if (percentage >= 90) return "优秀! (Excellent!)"
    if (percentage >= 70) return "很好! (Very good!)"
    if (percentage >= 50) return "不错! (Not bad!)"
    return "继续努力! (Keep trying!)"
  }

  const getGrade = () => {
    if (percentage >= 90) return "A"
    if (percentage >= 80) return "B"
    if (percentage >= 70) return "C"
    if (percentage >= 60) return "D"
    return "F"
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4">
      <Card className="w-full max-w-md shadow-lg flex flex-col">
        <CardHeader className="text-center border-b-0">
          <div className="text-5xl mb-2">🏆</div>
          <CardTitle className="text-xl font-semibold text-slate-800">
            Exercise Complete!
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center justify-center text-center flex-grow gap-6">
          {/* Grade */}
          <div className="text-7xl font-bold text-blue-900">{getGrade()}</div>

          {/* Score */}
          <div className="text-2xl font-semibold text-slate-700">
            {progress.score}/{progress.totalQuestions}
          </div>

          {/* Percentage */}
          <div className="text-lg text-slate-500">{percentage}% Correct</div>

          {/* Encouragement */}
          <div className="text-xl font-medium text-emerald-600">
            {getEncouragement()}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-blue-900 h-4 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Restart Button */}
          <button
            onClick={onRestart}
            className="w-full mt-4 py-3 px-6 bg-blue-900 text-white rounded-lg font-medium text-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition"
          >
            🔄 Try Again
          </button>
        </CardContent>
      </Card>
    </div>
  )
}
