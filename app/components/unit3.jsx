"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { apiGet, getUserId } from "../../lib/api";
import { API_ENDPOINTS } from "../../lib/config";

export default function Unit3() {
  const [progressMap, setProgressMap] = useState({});

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const userId = getUserId();
        if (!userId) return;

        const result = await apiGet(API_ENDPOINTS.PROGRESS.DASHBOARD(userId));
        if (result.success && result.data && result.data.progress) {
          const map = {};
          result.data.progress.forEach(p => {
            // Use lesson_number to match the hardcoded IDs in the lessons array
            const lessonId = p.lesson_number !== undefined ? p.lesson_number : (p.lesson_id || p.lessonId) - 1;
            const percentage = p.progress_percentage !== undefined ? p.progress_percentage : p.progressPercentage;
            map[lessonId] = percentage || 0;
          });
          setProgressMap(map);
        }
      } catch (error) {
        console.error("Error fetching progress:", error);
      }
    };

    fetchProgress();
  }, []);

  const lessons = [
    { id: 18, title: "Lesson 18 - Describing People", desc: "Learn how to describe people in Mandarin: appearance, age, and personality.", duration: "14 min", progress: 0, path: "/modules/unit03/lesson18" },
    { id: 19, title: "Lesson 19 - Feelings & Health", desc: "Learn how to express feelings, emotions, and talk about health.", duration: "13 min", progress: 0, path: "/modules/unit03/lesson19" },
    { id: 20, title: "Lesson 20 - Question Words", desc: "Learn basic question words to ask questions in Mandarin.", duration: "12 min", progress: 0, path: "/modules/unit03/lesson20" },
    { id: 21, title: "Lesson 21 - Numbers 11–100", desc: "Learn numbers from 11 to 100 and how to use them in sentences.", duration: "15 min", progress: 0, path: "/modules/unit03/lesson21" },
    { id: 22, title: "Lesson 22 - House & Rooms", desc: "Learn vocabulary related to houses, rooms, and furniture.", duration: "14 min", progress: 0, path: "/modules/unit03/lesson22" },
    { id: 23, title: "Lesson 23 - School & Learning", desc: "Learn words related to school, studying, exams, and classroom objects.", duration: "15 min", progress: 0, path: "/modules/unit03/lesson23" },
    { id: 24, title: "Lesson 24 - Technology", desc: "Learn vocabulary for technology, devices, internet, apps, and software.", duration: "16 min", progress: 0, path: "/modules/unit03/lesson24" },
    { id: 25, title: "Lesson 25 - Review & Speaking Project", desc: "Review previous lessons and practice speaking with projects.", duration: "18 min", progress: 0, path: "/modules/unit03/lesson25" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-6">
      <div className="max-w-6xl mx-auto">

        <div className="relative flex items-center justify-center mb-12">
          {/* Back Button */}
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
            Unit 03 <br /> Elementary Mandarin
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <span className="bg-purple-100 text-purple-700 text-sm font-semibold px-3 py-1.5 rounded-full">
                    Elementary
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
                    {lesson.duration}
                  </div>
                </div>

                {/* Title + Description */}
                <h3 className="text-2xl font-bold text-blue-900 mb-3">
                  {lesson.title.split('-').map((part, index) => (
                    <div key={index}>{part}</div>
                  ))}
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {lesson.desc}
                </p>

                {/* Progress Bar */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-full bg-slate-200 rounded-full h-3 max-w-[120px]">
                      <div
                        className={`h-3 rounded-full ${progressMap[lesson.id] === 100 ? 'bg-emerald-500' : 'bg-blue-900'}`}
                        style={{ width: `${progressMap[lesson.id] || 0}%` }}
                      />
                    </div>
                    <span className="text-sm text-slate-500 font-semibold">
                      {(progressMap[lesson.id] || 0) === 0
                        ? "Not Started"
                        : (progressMap[lesson.id] || 0) === 100
                          ? "Completed"
                          : `${progressMap[lesson.id] || 0}% Done`}
                    </span>
                  </div>
                </div>

                {/* Button */}
                <Link href={lesson.path}>
                  <button
                    className="w-full border-2 border-slate-300 bg-blue-900 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200"
                  >
                    Start Lesson
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
