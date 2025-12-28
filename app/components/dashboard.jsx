'use client';

import React, { useState, useEffect } from 'react'
import { API_ENDPOINTS } from '../../lib/config'
import { apiGet, apiPost, getUserId } from '../../lib/api'

const dashboard = () => {
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dashboard data
  const [stats, setStats] = useState({
    totalXp: 0,
    wordsLearned: 0,
    lessonsCompleted: 0,
    studyTime: 0,
    currentStreak: 0,
    dailyStudyTime: 0,
    streakRecoveryBadges: 0,
    frozenStreak: 0
  });
  const [progressByCategory, setProgressByCategory] = useState({
    beginner: { percentage: 0 },
    intermediate: { percentage: 0 },
    elementary: { percentage: 0 }
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedName = localStorage.getItem('userName');
        if (storedName) {
          setUserName(storedName);
        } else {
          // Try to fetch from profile API if not in localStorage
          const userId = getUserId();
          if (userId) {
            try {
              const profileResult = await apiGet(API_ENDPOINTS.PROFILE.GET(userId));
              if (profileResult.success && profileResult.data) {
                const user = profileResult.data;
                const fullName = user.firstName && user.lastName
                  ? `${user.firstName} ${user.lastName}`.trim()
                  : user.firstName || user.lastName || '';
                if (fullName) {
                  setUserName(fullName);
                  localStorage.setItem('userName', fullName);
                }
              }
            } catch (profileErr) {
              console.error('Error fetching profile:', profileErr);
              // Continue without user name
            }
          }
        }
      } catch (err) {
        console.error('Error loading user data in dashboard:', err);
      }
    };

    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const userId = getUserId();
        if (!userId) {
          setError('Please login to view your dashboard');
          setLoading(false);
          return;
        }

        const timezoneOffset = new Date().getTimezoneOffset();
        const result = await apiGet(API_ENDPOINTS.PROGRESS.DASHBOARD(userId, timezoneOffset));

        if (result.success && result.data) {
          // Set stats with proper defaults
          setStats({
            totalXp: result.data.stats?.totalXp || 0,
            wordsLearned: result.data.stats?.wordsLearned || 0,
            lessonsCompleted: result.data.stats?.lessonsCompleted || 0,
            studyTime: result.data.stats?.studyTime || 0,
            currentStreak: result.data.stats?.currentStreak || 0,
            dailyStudyTime: result.data.stats?.dailyStudyTimeMinutes || 0,
            streakRecoveryBadges: result.data.stats?.streakRecoveryBadges || result.data.stats?.streak_recovery_badges || 0,
            frozenStreak: result.data.stats?.frozenStreak || result.data.stats?.frozen_streak || 0
          });

          // Set progress by category
          if (result.data.progressByCategory) {
            setProgressByCategory(result.data.progressByCategory);
          }

          // Set recent activities (ensure proper field mapping)
          const activities = (result.data.recentActivities || []).map(activity => ({
            ...activity,
            activity_description: activity.activity_description || activity.activityDescription || 'Activity',
            created_at: activity.created_at || activity.createdAt,
            xp_earned: activity.xp_earned || activity.xpEarned || 0
          }));
          setRecentActivities(activities);

          // Set achievements
          setAchievements(result.data.achievements || []);
        } else {
          setError(result.error || result.message || 'Failed to load dashboard data');
        }
      } catch (err) {
        console.error('Error loading dashboard:', err);
        setError(err.message || 'Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    const initializeDashboard = async () => {
      await loadUserData();
      await loadDashboardData();
    };

    initializeDashboard();

    // Listen for profile updates
    const handleStorageUpdate = () => {
      loadUserData();
    };

    window.addEventListener('storage', handleStorageUpdate);
    window.addEventListener('profileUpdated', handleStorageUpdate);
    window.addEventListener('userLoggedIn', handleStorageUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageUpdate);
      window.removeEventListener('profileUpdated', handleStorageUpdate);
      window.removeEventListener('userLoggedIn', handleStorageUpdate);
    };
  }, []);

  const handleRecoverStreak = async () => {
    try {
      setLoading(true);
      const userId = getUserId();
      const timezoneOffset = new Date().getTimezoneOffset();

      const result = await apiPost(API_ENDPOINTS.PROGRESS.RECOVER_STREAK, {
        userId,
        timezoneOffset
      });

      if (result.success) {
        // Refresh dashboard to show recovered streak
        const dashboardResult = await apiGet(API_ENDPOINTS.PROGRESS.DASHBOARD(userId, timezoneOffset));
        if (dashboardResult.success && dashboardResult.data) {
          setStats({
            totalXp: dashboardResult.data.stats?.totalXp || 0,
            wordsLearned: dashboardResult.data.stats?.wordsLearned || 0,
            lessonsCompleted: dashboardResult.data.stats?.lessonsCompleted || 0,
            studyTime: dashboardResult.data.stats?.studyTime || 0,
            currentStreak: dashboardResult.data.stats?.currentStreak || 0,
            dailyStudyTime: dashboardResult.data.stats?.dailyStudyTimeMinutes || 0,
            streakRecoveryBadges: dashboardResult.data.stats?.streakRecoveryBadges || dashboardResult.data.stats?.streak_recovery_badges || 0,
            frozenStreak: 0 // Should be cleared
          });
        }
      } else {
        setError(result.message || "Failed to recover streak");
      }
    } catch (err) {
      console.error("Streak recovery error:", err);
      setError("An error occurred while recovering streak");
    } finally {
      setLoading(false);
    }
  };

  // Format time
  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  // Calculate progress percentage
  const getProgressPercentage = (category) => {
    return progressByCategory[category]?.percentage || 0;
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
            <p className="mt-4 text-slate-600">Loading dashboard...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl p-8 border border-red-200 shadow-sm max-w-md mx-auto">
              <div className="text-red-600 text-6xl mb-4">⚠️</div>
              <p className="text-red-600 text-lg font-semibold mb-4">{error}</p>
              {error.includes('login') && (
                <a
                  href="/auth"
                  className="inline-block bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors"
                >
                  Go to Login
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-20 px-4 sm:px-6 lg:px-8"
      id="dashboard">
      <div className="max-w-7xl mx-auto" id="el-f5zut2y1">
        <div className="mb-8" id="el-lrzvytib">
          <div
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
            id="el-xlbbi1e3">
            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-blue-900 bg-clip-text text-transparent pb-6">
                Dashboard
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Welcome back
                {userName ? (
                  <>
                    ,{' '}
                    <span className="text-3xl sm:text-3xl font-bold text-blue-900">
                      {userName
                        .split(' ')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                        .join(' ')}
                    </span>
                  </>
                ) : (
                  ''
                )}
                <br />
                Here's your learning progress overview.
              </p>

            </div>
            <div className="mt-4 sm:mt-0" id="el-3dpz23ut">
              {/* Recovery Badges Removed from here */}

              <div
                className="flex items-center space-x-4 bg-white rounded-2xl px-6 py-4 shadow-sm border border-slate-200"
                id="el-gir8ah5q">
                <div
                  className="text-sm text-slate-500 font-medium"
                  id="el-v9p9t6ie">
                  Current Streak
                </div>
                <div className="flex items-center space-x-2" id="el-hpki4d9b">
                  <div
                    className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg"
                    id="el-cgnvf46f">
                    <span className="text-white text-sm" id="el-gnttg8eo">
                      🔥
                    </span>
                  </div>
                  <span
                    className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent"
                    id="el-1nd708y5">
                    {stats.currentStreak}
                  </span>
                  <span
                    className="text-sm text-slate-500 font-medium"
                    id="el-eeutujz4">
                    days
                  </span>
                </div>
              </div>

              {/* Recover Streak Button - Moved Here */}
              {stats.currentStreak === 0 && stats.frozenStreak > 0 && stats.streakRecoveryBadges > 0 && (
                <div className="mt-2">
                  <button
                    onClick={handleRecoverStreak}
                    className="w-full py-2 px-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold shadow-lg hover:from-orange-600 hover:to-red-600 transition-all flex items-center justify-center space-x-2 text-sm"
                  >
                    <span>🛡️</span>
                    <span>Recover {stats.frozenStreak} Day Streak</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          id="el-btyka70r">
          <div
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200"
            id="el-p7xlgaj3">
            <div className="flex items-center justify-between" id="el-qjzkgsin">
              <div id="el-g8788nol">
                <p
                  className="text-sm text-slate-600 mb-1 font-medium"
                  id="el-wq3iothv">
                  Total XP
                </p>
                <p className="text-3xl font-bold text-slate-900" id="el-rr16se98">
                  {stats.totalXp.toLocaleString()}
                </p>
              </div>
              <div
                className="w-14 h-14 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center"
                id="el-bvmdymss">
                <svg
                  className="w-7 h-7 text-blue-600"
                  fill="none"
                  id="el-3uue9dxz"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                    id="el-ef6uqx6f"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200"
            id="el-ag64av70">
            <div className="flex items-center justify-between" id="el-5nhe1gwp">
              <div id="el-0mdk6s5j">
                <p
                  className="text-sm text-slate-600 mb-1 font-medium"
                  id="el-4lyflcod">
                  Words Learned
                </p>
                <p className="text-3xl font-bold text-slate-900" id="el-f6k1za2c">
                  {stats.wordsLearned}
                </p>
              </div>
              <div
                className="w-14 h-14 bg-gradient-to-r from-green-100 to-green-200 rounded-2xl flex items-center justify-center"
                id="el-402h9a20">
                <svg
                  className="w-7 h-7 text-green-600"
                  fill="none"
                  id="el-ns2cpit0"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    id="el-mo0ht11k"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200"
            id="el-njaefyl1">
            <div className="flex items-center justify-between" id="el-a46qe6cl">
              <div id="el-p5pld8i9">
                <p
                  className="text-sm text-slate-600 mb-1 font-medium"
                  id="el-6bt660hn">
                  Lessons Completed
                </p>
                <p className="text-3xl font-bold text-slate-900" id="el-mk4d5dqm">
                  {stats.lessonsCompleted}
                </p>
              </div>
              <div
                className="w-14 h-14 bg-gradient-to-r from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center"
                id="el-3m1wf27s">
                <svg
                  className="w-7 h-7 text-purple-600"
                  fill="none"
                  id="el-az4zz97r"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    id="el-utc99ikq"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200"
            id="el-0kp9rvac">
            <div className="flex items-center justify-between" id="el-8lx4zv4g">
              <div id="el-85okopzf">
                <p
                  className="text-sm text-slate-600 mb-1 font-medium"
                  id="el-ps98ea22">
                  Study Time
                </p>
                <p className="text-3xl font-bold text-slate-900" id="el-ke20tauu">
                  {formatTime(stats.studyTime)}
                </p>
              </div>
              <div
                className="w-14 h-14 bg-gradient-to-r from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center"
                id="el-c55d2yg7">
                <svg
                  className="w-7 h-7 text-orange-600"
                  fill="none"
                  id="el-avpovz22"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    id="el-14igu0vc"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="el-3lj07gn8">
          <div className="lg:col-span-2" id="el-o0a93g8a">
            <div
              className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm mb-6"
              id="el-z5r0u9pl">
              <h3
                className="text-2xl font-bold text-slate-900 mb-8"
                id="el-ht8zyw7s">
                Learning Progress
              </h3>
              <div className="space-y-8" id="el-24jksmv0">
                <div id="el-dh1pue9i">
                  <div
                    className="flex justify-between items-center mb-3"
                    id="el-z406rj3r">
                    <span
                      className="text-base font-semibold text-slate-700"
                      id="el-2miwwtk3">
                      Pinyin & Pronunciation Basics
                    </span>
                    <span
                      className="text-base text-blue-600 font-bold"
                      id="el-5a73s0n2">
                      {getProgressPercentage('beginner')}%
                    </span>
                  </div>
                  <div
                    className="w-full bg-slate-200 rounded-full h-4"
                    id="el-4pzxibbn">
                    <div
                      className="bg-blue-900 h-4 rounded-full shadow-sm"
                      id="el-352vwn8m"
                      style={{
                        width: `${getProgressPercentage('beginner')}%`,
                      }}
                    />
                  </div>
                </div>
                <div id="el-mt2hp3ps">
                  <div
                    className="flex justify-between items-center mb-3"
                    id="el-0kza0665">
                    <span
                      className="text-base font-semibold text-slate-700"
                      id="el-7c71hvba">
                      Essential Characters & Vocabulary
                    </span>
                    <span
                      className="text-base text-green-600 font-bold"
                      id="el-i7h1nv2p">
                      {getProgressPercentage('intermediate')}%
                    </span>
                  </div>
                  <div
                    className="w-full bg-slate-200 rounded-full h-4"
                    id="el-hweqwr2y">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full shadow-sm"
                      id="el-8azn72l4"
                      style={{
                        width: `${getProgressPercentage('intermediate')}%`,
                      }}
                    />
                  </div>
                </div>
                <div id="el-c2z9mw56">
                  <div
                    className="flex justify-between items-center mb-3"
                    id="el-1wnrkd74">
                    <span
                      className="text-base font-semibold text-slate-700"
                      id="el-p9k8uak7">
                      Intro to Sentence Structure
                    </span>
                    <span
                      className="text-base text-purple-600 font-bold"
                      id="el-v64hbhgq">
                      {getProgressPercentage('elementary')}%
                    </span>
                  </div>
                  <div
                    className="w-full bg-slate-200 rounded-full h-4"
                    id="el-gpl4z5hy">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-purple-600 h-4 rounded-full shadow-sm"
                      id="el-cg3xsz2o"
                      style={{
                        width: `${getProgressPercentage('elementary')}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div
              className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm"
              id="el-n5u5k0ac">
              <h3
                className="text-2xl font-bold text-slate-900 mb-8"
                id="el-0bikdgsr">
                Recent Activity
              </h3>
              <div className="space-y-4" id="el-owm9txw6">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-5 bg-slate-50 rounded-2xl border border-slate-100"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-base font-semibold text-slate-900">
                          {activity.activity_description || activity.activityDescription || 'Activity completed'}
                        </p>
                        <p className="text-sm text-slate-500">
                          {formatDate(activity.created_at || activity.createdAt)}
                        </p>
                      </div>
                      {(activity.xp_earned || activity.xpEarned) > 0 && (
                        <div className="text-base text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full">
                          +{activity.xp_earned || activity.xpEarned || 0} XP
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-center py-8">No recent activity</p>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-6" id="el-egbjj2j3">
            <a href="/dashboard/ar-learning" className="block transform transition-all duration-300 hover:scale-[1.02] group" id="el-sbp1qzyc">
              <div className="bg-blue-900 rounded-2xl p-10 shadow-lg hover:shadow-xl hover:bg-blue-800 transition-all duration-300 flex flex-col items-center justify-center text-center relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 p-4 opacity-5 transform rotate-12 scale-150 pointer-events-none">
                  <svg className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                  </svg>
                </div>

                <div className="loader mb-6 scale-125"></div>

                <h3 className="text-2xl font-bold text-white tracking-wide relative z-10">
                  Start AR Learning
                </h3>
                <p className="text-blue-200 text-sm mt-2 relative z-10 font-medium">
                  Tap to enter the future
                </p>
              </div>
            </a>

            <div
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
              id="el-jsb9ug0q">
              <h3
                className="text-xl font-bold text-slate-900 mb-6"
                id="el-258ueq2n">
                Recent Achievements
              </h3>
              <div className="space-y-5" id="el-9dvoftxa">
                {/* Above n Beyond Badge Display */}
                {stats.streakRecoveryBadges > 0 && (
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-md">
                      <span className="text-xl text-white">🛡️</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="text-base font-bold text-slate-900">Above n Beyond</p>
                        <span className="bg-blue-100 text-blue-700 text-xs font-extrabold px-2 py-0.5 rounded-full border border-blue-200">
                          x{stats.streakRecoveryBadges}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500">
                        Streak Recovery Badge
                      </p>
                    </div>
                  </div>
                )}

                {achievements.length > 0 ? (
                  achievements.slice(0, 3).map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center">
                        <span className="text-xl">{achievement.icon || '🏆'}</span>
                      </div>
                      <div>
                        <p className="text-base font-semibold text-slate-900">{achievement.title}</p>
                        <p className="text-sm text-slate-500">{achievement.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  stats.streakRecoveryBadges === 0 && <p className="text-slate-500 text-center py-4">No achievements yet</p>
                )}
              </div>
            </div>
            <div
              className="bg-blue-900 rounded-2xl p-6 text-white shadow-lg"
              id="el-k899jtgc">
              <h3 className="text-xl font-bold mb-2" id="el-2cam8k53">
                Daily Goal
              </h3>
              <div className="flex justify-between items-center mb-5">
                <p className="text-blue-100 text-base" id="el-1hrqwyb0">
                  Study for 30 minutes today
                </p>
                {/* Badge for Daily Goal progress could go here */}
              </div>
              <div
                className="w-full bg-blue-400/30 rounded-full h-3 mb-3"
                id="el-wco4106u">
                <div
                  className="bg-white h-3 rounded-full shadow-sm"
                  id="el-4dtivp87"
                  style={{
                    width: `${Math.min((stats.dailyStudyTime / 30) * 100, 100)}%`,
                  }}
                />
              </div>
              <p className="text-sm text-blue-100 font-medium mb-4" id="el-ro1cs8w9">
                {Math.min(stats.dailyStudyTime, 30)} / 30 minutes completed
              </p>
            </div>
          </div>
        </div>
      </div>
    </section >
  )
}

export default dashboard
