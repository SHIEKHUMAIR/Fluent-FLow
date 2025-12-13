"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { API_ENDPOINTS } from "../../lib/config";
import { apiGet, getUserId } from "../../lib/api";

export default function Unit1Overview() {
  const [lessons, setLessons] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Get unit ID (assuming unit 1)
        const unitsResult = await apiGet(API_ENDPOINTS.LESSONS.UNITS);
        if (!unitsResult.success) {
          setError("Failed to load units");
          return;
        }
        
        const unit1 = unitsResult.data.find(u => u.unit_number === 1);
        if (!unit1) {
          setError("Unit 1 not found");
          return;
        }

        // Get lessons for unit 1
        const lessonsResult = await apiGet(API_ENDPOINTS.LESSONS.BY_UNIT(unit1.id));
        if (lessonsResult.success) {
          setLessons(lessonsResult.data || []);
        }

        // Get user progress
        const userId = getUserId();
        if (userId) {
          const progressResult = await apiGet(API_ENDPOINTS.PROGRESS.DASHBOARD(userId));
          if (progressResult.success && progressResult.data.progress) {
            const progressMap = {};
            progressResult.data.progress.forEach(p => {
              progressMap[p.lesson_id] = p.progress_percentage;
            });
            setUserProgress(progressMap);
          }
        }
      } catch (err) {
        console.error("Error loading unit data:", err);
        setError("Failed to load lessons");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getProgress = (lessonId) => {
    return userProgress[lessonId] || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mb-4"></div>
          <p className="text-slate-600">Loading lessons...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-6 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-6">
      <div className="max-w-6xl mx-auto">
      
          <div className="relative flex items-center justify-center mb-12 ">
  {/* Back Button - stays on the left */}
  <Link href="/modules" className="absolute left-8">
    <button
      className="flex items-center gap-2 bg-blue-900 text-white hover:translate-x-2 font-medium px-4 py-2 rounded-full shadow-sm transition-all duration-200"
    >
      <img
        src="/assets/arrow-small.png"
        alt="Back"
        className="w-5 h-5"
      />
      <span className="hidden sm:inline">Back</span>
    </button>
  </Link>

  {/* Centered Title */}
  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-blue-900 bg-clip-text text-transparent text-center">
            Unit 01 <br /> Basics of Mandarin
          </h2>
</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {lessons.map((lesson) => {
            const progress = getProgress(lesson.id);
            return (
            <div
              key={lesson.id}
              className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <span className="bg-emerald-100 text-emerald-700 text-sm font-semibold px-3 py-1.5 rounded-full">
                    {lesson.category || 'Beginner'}
                  </span>
                  <div className="flex items-center text-sm text-slate-500">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {lesson.duration || '10 min'}
                  </div>
                </div>

                {/* Title + Description */}
                <h3 className="text-2xl font-bold text-blue-900 mb-3">
                  {lesson.title.split('-').map((part, index) => (
        <div key={index}>{part}</div>
    ))}
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {lesson.description || lesson.desc}
                </p>

                {/* Progress Bar */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-full bg-slate-200 rounded-full h-3 max-w-[120px]">
                      <div
                        className="bg-blue-900 h-3 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-sm text-slate-500 font-semibold">
                      {progress === 0
                        ? "Not Started"
                        : progress === 100
                        ? "Completed"
                        : `${progress}% Done`}
                    </span>
                  </div>
                </div>

                {/* Button */}
                <Link href={lesson.path || `/modules/unit01/lesson${lesson.lesson_number}`}>
                <button
                  className="w-full border-2 border-slate-300 bg-blue-900 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200"
                >
                  Start Lesson
                </button>
                </Link>
              </div>
            </div>
          )})}
        </div>
      </div>
    </div>
  );
}
