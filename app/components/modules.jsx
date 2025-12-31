import React from 'react';
import Link from 'next/link'
const modules = () => {
  return (
    <section
      id="modules"
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-blue-900 bg-clip-text text-transparent pb-6">
            Learning Modules
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Begin your Chinese learning journey with structured, beginner-friendly modules that build your foundation step by step.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {/* Pinyin & Pronunciation Basics */}
          <div className="group bg-white/90 hover:bg-white shadow-lg hover:shadow-2xl border border-white/50 rounded-3xl p-8 transition-all duration-300 transform hover:scale-105 hover:cursor-pointer">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">UNIT 1 <br /> Foundation</h3>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Learn Mandarin sounds, tones, and pinyin step by step. Build accurate pronunciation and listening skills.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 font-medium">10 lessons</span>
              <Link href="/modules/unit01" scroll={false}>
                <button className="bg-blue-900 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
                  Start Module
                </button>
              </Link>
            </div>
          </div>


          {/* Essential Words, Daily Life & Conversation */}
          <div className="group bg-white/90 hover:bg-white shadow-lg hover:shadow-2xl border border-white/50 rounded-3xl p-8 transition-all duration-300 transform hover:scale-105 hover:cursor-pointer">
            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">UNIT 2 <br /> Daily Life & Words</h3>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Learn essential words for food, colors, places, and activities. Build everyday vocabulary for common situations.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 font-medium">8 lessons</span>
              <Link href="/modules/unit02" scroll={false}>
                <button className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg">
                  Start Module
                </button>
              </Link>
            </div>
          </div>


          {/* Intro to Sentence Structure */}
          <div className="group bg-white/90 hover:bg-white shadow-lg hover:shadow-2xl border border-white/50 rounded-3xl p-8 transition-all duration-300 transform hover:scale-105 hover:cursor-pointer">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-4">UNIT 3 <br /> Elementary Mandarin</h3>

            <p className="text-slate-600 mb-6 leading-relaxed">
              Learn to describe people, feelings, and numbers. Understand basic questions and simple expressions.
            </p>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 font-medium">8 lessons</span>
              <Link href="/modules/unit03" scroll={false}>
                <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg">
                  Start Module
                </button>
              </Link>
            </div>
          </div>


          {/* Work & Travel */}
          <div className="group bg-white/90 hover:bg-white shadow-lg hover:shadow-2xl border border-white/50 rounded-3xl p-8 transition-all duration-300 transform hover:scale-105 hover:cursor-pointer">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-4">UNIT 4<br /> Work & Travel</h3>

            <p className="text-slate-600 mb-6 leading-relaxed">
              Learn practical words for shopping, travel, directions, and emergencies. Handle situations with confidence.
            </p>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 font-medium">8 lessons</span>
              <Link href="/modules/unit04" scroll={false}>
                <button className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg">
                  Start Module
                </button>
              </Link>
            </div>
          </div>


          <div className="group bg-white/90 hover:bg-white shadow-lg hover:shadow-2xl border border-white/50 rounded-3xl p-8 transition-all duration-300 transform hover:scale-105 hover:cursor-pointer">
            <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-4">UNIT 5<br /> Culture & Society</h3>

            <p className="text-slate-600 mb-6 leading-relaxed">
              Understand Chinese culture, festivals, and social etiquette. Learn how language is used in cultural contexts.
            </p>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 font-medium">5 lessons</span>
              <Link href="/modules/unit05" scroll={false}>
                <button className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg">
                  Start Module
                </button>
              </Link>
            </div>
          </div>

          {/* Advanced Topics */}
          <div className="group bg-white/90 hover:bg-white shadow-lg hover:shadow-2xl border border-white/50 rounded-3xl p-8 transition-all duration-300 transform hover:scale-105 hover:cursor-pointer">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-4">UNIT 6 <br /> Practical Conversation</h3>

            <p className="text-slate-600 mb-6 leading-relaxed">
              Learn Mandarin sentences for daily communication. Understand conversations in common situations.
            </p>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 font-medium">8 lessons</span>
              <Link href="/modules/unit06" scroll={false}>
                <button className="bg-gradient-to-r from-cyan-600 to-cyan-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg">
                  Start Module
                </button>
              </Link>
            </div>
          </div>

        </div>

        {/* Learning Path Recommendation */}
        <div className="bg-blue-900 rounded-3xl p-12 text-white text-center shadow-2xl">
          <h3 className="text-3xl font-bold mb-6">Not Sure Where to Start?</h3>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
            Take our quick assessment to get a personalized learning path tailored to your current level and goals.
          </p>
          <Link href="/assessment">
            <button className="bg-white text-blue-900 hover:bg-gray-50 font-bold py-4 px-10 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
              Take Assessment
            </button>
          </Link>
        </div>
      </div>
    </section >
  );
};

export default modules;
