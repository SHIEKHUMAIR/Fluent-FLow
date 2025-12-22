"use client";
import Link from "next/link";

export default function LessonSummary({ score, unitNumber }) {
  return (
    <div className="bg-gradient-to-br from-white via-slate-50 to-blue-50 rounded-2xl shadow-lg border border-slate-200 p-10 mt-10 text-center max-w-xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-blue-900 mb-2">
          Lesson Complete
        </h2>
        <p className="text-slate-600">
          Excellent work! You’ve mastered this lesson’s concepts.
        </p>
      </div>

      {/* Score Display */}
      <div className="bg-white border border-blue-100 shadow-inner rounded-2xl p-8 mb-8 inline-block">
        <div className="text-6xl font-extrabold text-blue-900">{score}</div>
        <div className="text-sm text-slate-500 font-medium tracking-wide">
          Points Earned
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-3 border-2 border-slate-300 rounded-xl text-slate-700 font-semibold hover:bg-slate-50 transition-all duration-200"
        >
          Retry Lesson
        </button>
        <Link href={`/modules/unit${(unitNumber || 1).toString().padStart(2, '0')}`}>
          <button
            className="px-8 py-3 bg-blue-900 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            Continue
          </button>
        </Link>
      </div>

      {/* Subtle line divider */}
      <div className="mt-8 border-t border-slate-200 pt-4 text-sm text-slate-500">
        Keep learning — each step brings you closer to fluency.
      </div>
    </div>
  );
}
