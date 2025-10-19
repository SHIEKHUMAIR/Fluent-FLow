"use client";

import Link from "next/link";

export default function Unit1Overview() {
  

  const lessons = [
    { id: 0, title: "Lesson 0 - Introduction", desc: "Get started with Pinyin, tones, and Chinese pronunciation.", duration: "10 min", progress: 0, path: "/unit1lesson0" },
    { id: 1, title: "Lesson 1 - Tones", desc: "Learn the 4 tones of Mandarin with examples and practice audio.", duration: "12 min", progress: 0, path: "/unit1lesson1" },
    { id: 2, title: "Lesson 2 - Basic Greetings", desc: "Learn greetings, introductions, and farewells in Chinese.", duration: "15 min", progress: 0, path: "/unit1lesson2" },
    { id: 3, title: "Lesson 3 - Relationships", desc: "Explore family and relationship words in Mandarin.", duration: "14 min", progress: 0, path: "/unit1lesson3" },
    { id: 4, title: "Lesson 4 - Pronouns", desc: "Learn I, You, He, She, and They in Chinese.", duration: "9 min", progress: 0, path: "/unit1lesson4" },
    { id: 5, title: "Lesson 5 - Numbers 0 to 10", desc: "Master counting from 1 to 10 in Chinese.", duration: "11 min", progress: 0, path: "/unit1lesson5" },
    { id: 6, title: "Lesson 6 - Yes / No Basics", desc: "Understand how to say yes and no in conversations.", duration: "8 min", progress: 0, path: "/unit1lesson6" },
    { id: 7, title: "Lesson 7 - Polite Phrases & Needs", desc: "Say please, thank you, and express needs politely.", duration: "13 min", progress: 0, path: "/unit1lesson7" },
    { id: 8, title: "Lesson 8 - Days & Time", desc: "Talk about days, weeks, and time in Chinese.", duration: "12 min", progress: 0, path: "/unit1lesson8" },
    { id: 9, title: "Lesson 9 - Country & Introduction", desc: "Learn to say where you’re from and your nationality.", duration: "14 min", progress: 0, path: "/unit1lesson9" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-6">
      <div className="max-w-6xl mx-auto">
       <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-blue-900 bg-clip-text text-transparent pb-12 text-center">
            Unit 01 <br /> Basics of Mandarin
          </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <span className="bg-emerald-100 text-emerald-700 text-sm font-semibold px-3 py-1.5 rounded-full">
                    Beginner
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
                        className="bg-slate-300 h-3 rounded-full"
                        style={{ width: `${lesson.progress}%` }}
                      />
                    </div>
                    <span className="text-sm text-slate-500 font-semibold">
                      {lesson.progress === 0
                        ? "Not Started"
                        : lesson.progress === 100
                        ? "Completed"
                        : `${lesson.progress}% Done`}
                    </span>
                  </div>
                </div>

                {/* Button */}
                <Link href ={lesson.path}  >
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
