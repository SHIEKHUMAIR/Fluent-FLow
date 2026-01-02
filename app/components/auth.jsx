'use client';
import React, { useState } from 'react';
import LoginForm from './loginForm';
import RegisterForm from './registerForm';

import { useSearchParams, useRouter } from 'next/navigation';

const Auth = ({ defaultTab = 'login' }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get initial tab from URL or default prop
  const currentTab = searchParams.get('tab') || defaultTab;
  const [activeTab, setActiveTab] = useState(currentTab);

  React.useEffect(() => {
    // Update local state when URL params change
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Optional: Update URL without refreshing
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', tab);
    router.push(`/auth?${newParams.toString()}`);
  };

  return (
    <section
      className="page-section min-h-screen flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 max-w-[720px] mx-auto"
      id="auth"
    >
      <div className="w-full space-y-6 mx-auto">
        {/* Logo & Headings */}
        <div className="text-center">
          <div className="mb-4 sm:mb-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#1e3a8a] rounded-2xl mx-auto flex items-center justify-center mb-3 sm:mb-4 shadow-lg">
              <img alt="Logo" className="w-12 h-12 sm:w-16 sm:h-16" src="./assets/mono.png" />
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-4xl font-extrabold bg-blue-900 bg-clip-text text-transparent mb-2 sm:mb-4">
            Welcome to Fluent Flow
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
            Start your Mandarin learning journey
          </p>
        </div>

        {/* Toggle Tabs */}
        <div className="bg-neutral-100/80 rounded-2xl flex flex-row backdrop-blur-md mb-6 shadow-inner ring-1 ring-white/40">
          <button
            className={`flex items-center justify-center gap-2 w-full sm:flex-1 py-3 px-4 text-sm font-semibold rounded-xl transition-all duration-300 ease-in-out ${activeTab === 'login'
              ? 'bg-white text-blue-900 shadow-lg ring-2 ring-blue-900'
              : 'text-gray-500 hover:text-blue-800 hover:bg-white/50'
              }`}
            onClick={() => handleTabChange('login')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            Sign In
          </button>

          <button
            className={`flex items-center justify-center gap-2 w-full sm:flex-1 py-3 px-4 text-sm font-semibold rounded-xl transition-all duration-300 ease-in-out ${activeTab === 'register'
              ? 'bg-white text-blue-900 shadow-lg ring-2 ring-blue-900'
              : 'text-gray-500 hover:text-blue-800 hover:bg-white/50'
              }`}
            onClick={() => handleTabChange('register')}
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
    </section>
  );
};

export default Auth;
