'use client';
import React, { useState } from 'react';
import LoginForm from './loginForm';
import RegisterForm from './registerForm';

const Auth = ({ defaultTab = 'login' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  return (
    <section
      className="page-section min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 max-w-[720px] mx-auto"
      id="auth"
    >
      <div className="space-y-6 mx-auto">
        <div className="text-center">
          <div className="mb-6">
            <div className="w-24 h-24 bg-[#1e3a8a] rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg">
              <img alt="Logo" className="w-16 h-16" src="./assets/group11.png" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-xl lg:text-4xl font-extrabold bg-blue-900 bg-clip-text text-transparent mb-4">
            Welcome to Fluent Flow
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Start your Mandarin learning journey
          </p>
        </div>

        {/* Toggle Tabs */}
       <div>
  <div className="bg-neutral-100/80 rounded-2xl flex backdrop-blur-md mb-6 shadow-inner ring-1 ring-white/40">
    <button
      className={`flex items-center justify-center gap-2 flex-1 py-3 px-4 mr-2 text-sm font-semibold rounded-xl transition-all duration-300 ease-in-out ${
        activeTab === 'login'
          ? 'bg-white text-blue-900 shadow-lg ring-2 ring-blue-900'
          : 'text-gray-500 hover:text-blue-800 hover:bg-white/50'
      }`}
      onClick={() => setActiveTab('login')}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
      </svg>
      Sign In
    </button>

    <button
      className={`flex items-center justify-center gap-2 flex-1 py-3 px-4 text-sm font-semibold rounded-xl transition-all duration-300 ease-in-out ${
        activeTab === 'register'
          ? 'bg-white text-blue-900 shadow-lg ring-2 ring-blue-900'
          : 'text-gray-500 hover:text-blue-800 hover:bg-white/50'
      }`}
      onClick={() => setActiveTab('register')}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
      Sign Up
    </button>
  </div>

  {/* Conditional Rendering */}
  {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
</div>


        {/* Features Section */}
        <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
          <p className="text-sm text-neutral-700 font-medium mb-6">
            Join thousands learning Mandarin with AI-powered tools
          </p>
          <div className="flex justify-center space-x-8 text-sm text-neutral-600">
            {['AI Chatbot', 'AR Learning', 'Gamification'].map((item, i) => (
              <div className="flex items-center" key={i}>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-2">
                  <svg
                    className="h-4 w-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M5 13l4 4L19 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Auth;
