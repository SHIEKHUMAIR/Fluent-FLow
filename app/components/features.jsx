import React from 'react';

const Features = () => {
  return (
    <section
      id="features"
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-blue-900 bg-clip-text text-transparent pb-6">
            Smart Features for Faster Learning
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience AI-powered technology designed to accelerate your Mandarin mastery through
            interactive and personalized learning.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {/* AI Chatbot */}
          <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
            <div className="flex items-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">AI Chatbot</h3>
                <p className="text-blue-600 font-medium text-sm">Get Instant Feedback</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              A focused, AI-driven chatbot that guides you through lesson-specific dialogues with
              real-time grammar feedback and task-based conversation.
            </p>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500 font-medium">AI Chatbot</span>
              </div>
              <div className="text-sm text-gray-700 bg-white rounded-xl p-3 shadow-sm">
                Write any query you have...
              </div>
            </div>
          </div>

          {/* AR Learning */}
          <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-200">
            <div className="flex items-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">AR Learning</h3>
                <p className="text-green-600 font-medium text-sm">Scan & Learn Instantly</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Point your camera at objects to instantly learn Mandarin names and pronunciation. Your
              world becomes your classroom.
            </p>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-500 font-medium">Scan Mode Active</span>
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              </div>
              <div className="text-center py-3">
                <div className="w-12 h-12 border-2 border-dashed border-green-300 rounded-xl mx-auto flex items-center justify-center bg-white">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Game Rewards */}
          <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200">
            <div className="flex items-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Game Rewards</h3>
                <p className="text-purple-600 font-medium text-sm">Points & Achievements</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Earn points, unlock badges, and climb leaderboards. Transform learning into an
              engaging game that motivates daily practice.
            </p>
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl p-4 border border-purple-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-sm">🏆</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">1,250 XP</span>
                </div>
                <div className="text-sm text-purple-600 font-semibold bg-purple-100 px-2 py-1 rounded-full">
                  7-day streak!
                </div>
              </div>
              <div className="flex space-x-2">
                <div className="w-7 h-7 bg-gradient-to-r from-blue-400 to-blue-500 rounded_cstm flex items-center justify-center text-sm shadow-sm">🎯</div>
                <div className="w-7 h-7 bg-gradient-to-r from-green-400 to-green-500 rounded_cstm flex items-center justify-center text-sm shadow-sm">⭐</div>
                <div className="w-7 h-7 bg-gradient-to-r from-purple-400 to-purple-500 rounded_cstm flex items-center justify-center text-sm shadow-sm">🚀</div>
              </div>
            </div>
          </div>

          {/* Smart Progress */}
          <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-orange-200">
            <div className="flex items-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Smart Progress</h3>
                <p className="text-orange-600 font-medium text-sm">Personalized Dashboard</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Get customized paths based on your goals and pace. Track improvement with detailed
              analytics and adaptive recommendations.
            </p>
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-4 border border-orange-100">
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 font-medium">Overall Progress</span>
                  <span className="text-orange-600 font-bold">68%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-gradient-to-r from-orange-400 to-orange-500 h-2.5 rounded-full shadow-sm" style={{ width: '68%' }}></div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="text-center bg-white rounded_cstm p-2">
                  <div className="text-gray-500 font-medium">Vocabulary</div>
                  <div className="font-bold text-gray-800 text-sm">245</div>
                </div>
                <div className="text-center bg-white rounded_cstm p-2">
                  <div className="text-gray-500 font-medium">Grammar</div>
                  <div className="font-bold text-gray-800 text-sm">12</div>
                </div>
                <div className="text-center bg-white rounded_cstm p-2">
                  <div className="text-gray-500 font-medium">Speaking</div>
                  <div className="font-bold text-gray-800 text-sm">Level 3</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-blue-900 rounded-3xl p-12 shadow-2xl">
          <h3 className="text-3xl font-bold text-white mb-4">Ready to Start Learning?</h3>
          <p className="text-blue-100 mb-8 text-lg max-w-2xl mx-auto">
            Join thousands of learners mastering Mandarin with our AI-powered platform.
          </p>
          <button className="bg-white hover:bg-gray-50 text-blue-900 font-bold py-4 px-10 rounded-2xl text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
            Start Free Trial
          </button>
        </div>
      </div>
    </section>
  );
};

export default Features;
