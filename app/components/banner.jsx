import React from 'react'
import Link from 'next/link'

const banner = () => {
  return (
    <section
  id="home"
  className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden"
>
  {/* Background Blur Circles */}
  <div className="absolute inset-0 bg-black opacity-10"></div>
  <div className="absolute inset-0">
    <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse"></div>
    <div className="absolute top-40 right-10 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse delay-[2000ms]"></div>
    <div className="absolute bottom-20 left-1/2 w-64 h-64 bg-cyan-500 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse delay-[4000ms]"></div>
  </div>

  {/* Main Content */}
  <div className="max-w-6xl mx-auto mt-10 relative z-10 text-center">
    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
      Master Chinese with <br />
      <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
        Fluent Flow : Chinese Hub
      </span>
    </h1>

    <p className="text-lg sm:text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
      Practice real conversations, scan real-world objects, and track your learning journey—all through an intelligent, gamified platform built for modern Chinese learners.
    </p>

    {/* Feature Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
      {/* Card 1 */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
        <div className="w-12 h-12 bg-blue-500 rounded_cstm flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">AI-Powered Lessons</h3>
        <p className="text-slate-400 text-sm">Personalized learning experience tailored to your progress and learning style</p>
      </div>

      {/* Card 2 */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
        <div className="w-12 h-12 bg-emerald-500 rounded_cstm flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">AR Vocabulary</h3>
        <p className="text-slate-400 text-sm">Scan objects to learn vocabulary with augmented reality</p>
      </div>

      {/* Card 3 */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
        <div className="w-12 h-12 bg-purple-500 rounded_cstm flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Smart Progress</h3>
        <p className="text-slate-400 text-sm">Track your journey with personalized insights and analytics</p>
      </div>
    </div>

    {/* Buttons */}
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
      <Link href="/demoexercise" scroll={false}>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded_cstm text-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/25">
          Start Free Trial
        </button>
      </Link>
      
      <Link href="/auth?tab=register" scroll={false}>
        <button className="bg-transparent border-2 border-white/20 hover:border-white/40 text-white font-medium py-3 px-8 rounded_cstm text-lg transition-all duration-300">
          Sign Up Now
        </button>
      </Link>
    </div>

    {/* Footer info */}
    <div className="text-center">
      <p className="text-slate-400 mb-4">Trusted by 10,000+ learners worldwide</p>
    </div>
  </div>
</section>

  )
}

export default banner