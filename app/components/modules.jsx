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
  <h3 className="text-2xl font-bold text-slate-900 mb-4">UNIT 1: FOUNDATION</h3>
  <p className="text-slate-600 mb-6 leading-relaxed">
    Learn the essential Chinese sounds and tones through native audio, guided pinyin charts, and AI-powered pronunciation practice.
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
  <h3 className="text-2xl font-bold text-slate-900 mb-4">UNIT 2: Daily Life & Words</h3>
  <p className="text-slate-600 mb-6 leading-relaxed">
    Learn essential words and phrases for daily activities, shopping, food, transport, and common locations in Mandarin.
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
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Intro to Sentence Structure</h3>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Learn how basic Chinese sentences are built using simple grammar rules, including question formation, negation, and word order.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 font-medium">30 grammar rules</span>
              <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg">
                Start Module
              </button>
            </div>
          </div>
        </div>

        {/* Learning Path Recommendation */}
        <div className="bg-blue-900 rounded-3xl p-12 text-white text-center shadow-2xl">
          <h3 className="text-3xl font-bold mb-6">Not Sure Where to Start?</h3>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
            Take our quick assessment to get a personalized learning path tailored to your current level and goals.
          </p>
          <button className="bg-white text-blue-900 hover:bg-gray-50 font-bold py-4 px-10 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
            Take Assessment
          </button>
        </div>
      </div>
    </section>
  );
};

export default modules;
