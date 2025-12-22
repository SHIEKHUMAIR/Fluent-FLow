'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import lessonsData from '../../data/lessons.json';
import { API_ENDPOINTS } from "../../lib/config";
import { apiGet, getUserId } from "../../lib/api";

const Lessons = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const userId = getUserId();
        if (!userId) {
          setLoading(false);
          return;
        }

        const result = await apiGet(API_ENDPOINTS.PROGRESS.DASHBOARD(userId));
        if (result.success && result.data && result.data.progress) {
          const map = {};
          result.data.progress.forEach(p => {
            // Use lesson_number (from DB query join) which matches lessons.json ID
            // Fallback to p.lesson_id - 1 if lesson_number is missing (though model update ensures it's there)
            const lessonId = p.lesson_number !== undefined ? p.lesson_number : (p.lesson_id || p.lessonId) - 1;
            const percentage = p.progress_percentage !== undefined ? p.progress_percentage : p.progressPercentage;
            map[lessonId] = percentage || 0;
          });
          setProgressMap(map);
        }
      } catch (error) {
        console.error("Error fetching lesson progress:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const categories = ['All', 'Beginner', 'Elementary', 'Intermediate'];

  const filteredLessons = activeCategory === 'All'
    ? lessonsData.lessons
    : lessonsData.lessons.filter(lesson => lesson.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8" id="lessons">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-blue-900 bg-clip-text text-transparent mb-6">
            Lessons
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Progress through structured lessons designed to build your Mandarin skills step by step.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar / Categories */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 shadow-lg sticky top-8">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Categories</h3>
              <div className="space-y-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`w-full text-left px-5 py-4 rounded-xl font-semibold transition-all duration-200 ${activeCategory === category
                      ? 'bg-blue-900 text-white shadow-md transform scale-105'
                      : 'text-slate-700 hover:bg-slate-100'
                      }`}
                  >
                    {category === 'All' ? 'All Lessons' : category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Lessons Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  // CHANGE 1: Added 'flex flex-col h-full' to make the card stretch and organize vertically
                  className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex flex-col h-full"
                >
                  {/* CHANGE 2: Added 'flex flex-col flex-grow' to make the content fill the card height */}
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex items-center justify-between mb-6">
                      <span className={`text-sm font-semibold px-3 py-1.5 rounded-full ${lesson.category === 'beginner' ? 'bg-emerald-100 text-emerald-700' :
                        lesson.category === 'elementary' ? 'bg-purple-100 text-purple-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                        {lesson.category.charAt(0).toUpperCase() + lesson.category.slice(1)}
                      </span>
                      <div className="flex items-center text-sm text-slate-500">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {lesson.duration}
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 mb-3">
                      {lesson.title}
                    </h3>
                    <p className="text-slate-600 mb-6 leading-relaxed">
                      {lesson.desc}
                    </p>

                    {/* Progress Bar */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3 w-full">
                        <div className="w-full bg-slate-200 rounded-full h-3 max-w-[120px]">
                          <div
                            className={`h-3 rounded-full ${progressMap[lesson.id] === 100 ? 'bg-emerald-500' : 'bg-blue-900'}`}
                            style={{ width: `${progressMap[lesson.id] || 0}%` }}
                          />
                        </div>
                        <span className={`text-sm font-semibold ${progressMap[lesson.id] === 100 ? 'text-emerald-600' : 'text-slate-500'}`}>
                          {(progressMap[lesson.id] || 0) === 0 ? 'Not Started' : (progressMap[lesson.id] === 100 ? 'Complete' : `${progressMap[lesson.id]}%`)}
                        </span>
                      </div>
                    </div>

                    {/* CHANGE 3: Added 'mt-auto' to the Link to push it to the bottom of the flex container */}
                    <Link href={lesson.path} className="mt-auto">
                      <button className="w-full bg-blue-900 hover:bg-blue-800 py-3 px-6 rounded-xl font-semibold transition-all duration-200 text-white">
                        {(progressMap[lesson.id] || 0) === 0 ? 'Start Lesson' : 'Continue Lesson'}
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {filteredLessons.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-500 text-lg">No lessons found in this category.</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
};

export default Lessons;