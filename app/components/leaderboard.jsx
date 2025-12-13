'use client';

import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../../lib/config';
import { apiGet, getUserId } from '../../lib/api';

const Leaderboard = () => {
  const [period, setPeriod] = useState('week');
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, [period]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = getUserId();
      const url = API_ENDPOINTS.LEADERBOARD.GET(period, userId);
      const result = await apiGet(url);
      
      if (result.success) {
        setLeaderboardData(result.data);
      } else {
        setError(result.error || 'Failed to load leaderboard');
      }
    } catch (err) {
      setError(err.message || 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const getTopThree = () => {
    if (!leaderboardData?.leaderboard) return [];
    return leaderboardData.leaderboard.slice(0, 3);
  };

  const getRankingsList = () => {
    if (!leaderboardData?.leaderboard) return [];
    return leaderboardData.leaderboard;
  };

  const getCurrentUser = () => {
    return leaderboardData?.currentUser || null;
  };

  const formatXP = (xp) => {
    return xp.toLocaleString();
  };

  const getInitials = (user) => {
    return user.initials || 'U';
  };

  const getPeriodLabel = () => {
    switch (period) {
      case 'week': return 'Weekly';
      case 'month': return 'Monthly';
      case 'alltime': return 'All Time';
      default: return 'Weekly';
    }
  };

  const topThree = getTopThree();
  const rankings = getRankingsList();
  const currentUser = getCurrentUser();

  if (loading) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <p className="text-xl text-slate-600">Loading leaderboard...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <p className="text-xl text-red-600">Error: {error}</p>
            <button 
              onClick={fetchLeaderboard}
              className="mt-4 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8"
      id="leaderboard">
      <div className="max-w-7xl mx-auto" id="el-706sy06x">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-blue-900 bg-clip-text text-transparent mb-6">
            Leaderboard
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            See how you rank against other learners and celebrate achievements
            together.
          </p>
        </div>
        <div className="flex justify-center mb-10" id="el-a3qidobs">
          <div
            className="bg-white/80 backdrop-blur-sm rounded-xl p-1.5 flex space-x-1 shadow-lg border border-white/20"
            id="el-1r2y6rm2">
            <button
              onClick={() => setPeriod('week')}
              className={`px-8 py-3 rounded_cstm font-semibold shadow-md hover:shadow-lg transition-all duration-200 ${
                period === 'week'
                  ? 'bg-blue-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
              id="el-bbvru1yf">
              This Week
            </button>
            <button
              onClick={() => setPeriod('month')}
              className={`px-8 py-3 rounded_cstm font-semibold transition-all duration-200 ${
                period === 'month'
                  ? 'bg-blue-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
              id="el-shuxufhw">
              This Month
            </button>
            <button
              onClick={() => setPeriod('alltime')}
              className={`px-8 py-3 rounded_cstm font-semibold transition-all duration-200 ${
                period === 'alltime'
                  ? 'bg-blue-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
              id="el-fjqt6oxn">
              All Time
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="el-b5ws9nhm">
          <div className="lg:col-span-2" id="el-z4wrq2hy">
            {topThree.length > 0 && (
              <div
                className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 mb-8 shadow-xl border border-white/20"
                id="el-4nidz206">
                <h3
                  className="text-2xl font-bold text-slate-800 mb-8 text-center"
                  id="el-juki697a">
                  Top Performers
                </h3>
                <div
                  className="flex items-end justify-center space-x-6"
                  id="el-74o8b5z6">
                  {topThree[1] && (
                    <div className="text-center" id="el-b9lr9qo4">
                      <div
                        className="w-16 h-16 bg-gradient-to-r from-slate-400 to-slate-500 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg"
                        id="el-u428qufz">
                        <span className="text-white font-bold text-lg" id="el-awexd269">
                          {topThree[1].rank}
                        </span>
                      </div>
                      <div
                        className="w-20 h-20 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg"
                        id="el-jpqj273m">
                        <span className="text-white font-bold text-xl" id="el-5b7kh4t1">
                          {getInitials(topThree[1])}
                        </span>
                      </div>
                      <div
                        className="bg-slate-100 rounded-xl p-4 min-h-[90px] flex flex-col justify-center shadow-sm"
                        id="el-xjkal3gm">
                        <p
                          className="font-semibold text-slate-800 text-sm"
                          id="el-udirn9il">
                          {topThree[1].fullName}
                        </p>
                        <p
                          className="text-xs text-slate-600 font-medium"
                          id="el-jeg0aalr">
                          {formatXP(topThree[1].xp)} XP
                        </p>
                      </div>
                    </div>
                  )}
                  {topThree[0] && (
                    <div className="text-center" id="el-kwjgriig">
                      <div
                        className="w-18 h-18 bg-gradient-to-r from-yellow-400 to-green-500 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg animate-pulse"
                        id="el-5r109ds2">
                        <span className="text-white font-bold text-xl" id="el-i7imu46x">
                          👑
                        </span>
                      </div>
                      <div
                        className="w-24 h-24 bg-blue-900 rounded-full flex items-center justify-center mb-4 mx-auto shadow-xl"
                        id="el-r053aev2">
                        <span
                          className="text-white font-bold text-2xl"
                          id="el-f2gj5suq">
                          {getInitials(topThree[0])}
                        </span>
                      </div>
                      <div
                        className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-4 min-h-[110px] flex flex-col justify-center shadow-lg border border-yellow-200"
                        id="el-sbwc39y9">
                        <p
                          className="font-bold text-slate-800 text-lg"
                          id="el-5xkf30p0">
                          {topThree[0].fullName}
                        </p>
                        <p
                          className="text-sm text-slate-700 font-semibold"
                          id="el-e9njizin">
                          {formatXP(topThree[0].xp)} XP
                        </p>
                        {topThree[0].streak > 0 && (
                          <p
                            className="text-xs text-orange-600 font-bold bg-orange-100 px-2 py-1 rounded-full mt-1"
                            id="el-7ykj6jc8">
                            🔥 {topThree[0].streak} day streak
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  {topThree[2] && (
                    <div className="text-center" id="el-jynm8qbq">
                      <div
                        className="w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg"
                        id="el-3ovyzebv">
                        <span className="text-white font-bold text-lg" id="el-a1zfooek">
                          {topThree[2].rank}
                        </span>
                      </div>
                      <div
                        className="w-20 h-20 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg"
                        id="el-shuvfyfe">
                        <span className="text-white font-bold text-xl" id="el-j4daf0pe">
                          {getInitials(topThree[2])}
                        </span>
                      </div>
                      <div
                        className="bg-orange-50 rounded-xl p-4 min-h-[90px] flex flex-col justify-center shadow-sm border border-orange-100"
                        id="el-seav14ck">
                        <p
                          className="font-semibold text-slate-800 text-sm"
                          id="el-u2g9kloa">
                          {topThree[2].fullName}
                        </p>
                        <p
                          className="text-xs text-slate-600 font-medium"
                          id="el-b2109uaa">
                          {formatXP(topThree[2].xp)} XP
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            <div
              className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl"
              id="el-lfwt4ky0">
              <div className="p-6 border-b border-slate-200" id="el-oeu5x2r5">
                <h3 className="text-xl font-bold text-slate-800" id="el-2cj9zw89">
                  {getPeriodLabel()} Rankings
                </h3>
              </div>
              <div className="divide-y divide-slate-100" id="el-2h13hl32">
                {rankings.length === 0 ? (
                  <div className="p-5 text-center text-slate-600">
                    No rankings available yet. Be the first to earn XP!
                  </div>
                ) : (
                  rankings.map((user, index) => {
                    const isCurrentUser = user.isCurrentUser || (currentUser && currentUser.userId === user.userId);
                    const rankColors = {
                      1: 'from-yellow-400 to-yellow-500',
                      2: 'from-slate-400 to-slate-500',
                      3: 'from-orange-400 to-orange-500',
                    };
                    const rankColor = rankColors[user.rank] || 'from-slate-600 to-slate-700';
                    
                    return (
                      <div
                        key={user.userId}
                        className={`p-5 transition-colors duration-200 ${
                          isCurrentUser
                            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500'
                            : 'hover:bg-slate-50'
                        }`}
                        id={isCurrentUser ? "el-oycevrmc" : undefined}>
                        <div
                          className="flex items-center justify-between"
                          id={isCurrentUser ? "el-q1l0wvrg" : undefined}>
                          <div className="flex items-center space-x-4" id={isCurrentUser ? "el-egut1aq5" : undefined}>
                            <div
                              className={`w-10 h-10 bg-gradient-to-r ${rankColor} rounded-full flex items-center justify-center shadow-md`}
                              id={isCurrentUser ? "el-e2kg0er0" : undefined}>
                              <span className="text-white font-bold" id={isCurrentUser ? "el-zzz7ys17" : undefined}>
                                {user.rank}
                              </span>
                            </div>
                            {isCurrentUser && (
                              <div
                                className="w-14 h-14 bg-blue-900 rounded-full flex items-center justify-center shadow-lg"
                                id="el-awj0qjl3">
                                <span
                                  className="text-white font-bold text-sm"
                                  id="el-g76xmbrh">
                                  YOU
                                </span>
                              </div>
                            )}
                            {!isCurrentUser && (
                              <div
                                className={`w-14 h-14 bg-gradient-to-r ${
                                  user.rank <= 3 ? 'from-blue-900 to-blue-900' : 
                                  user.rank % 4 === 0 ? 'from-green-500 to-green-600' :
                                  user.rank % 4 === 1 ? 'from-purple-500 to-purple-600' :
                                  user.rank % 4 === 2 ? 'from-red-500 to-red-600' :
                                  'from-yellow-500 to-yellow-600'
                                } rounded-full flex items-center justify-center shadow-lg`}>
                                <span className="text-white font-bold text-sm">
                                  {getInitials(user)}
                                </span>
                              </div>
                            )}
                            <div id={isCurrentUser ? "el-bopngb8j" : undefined}>
                              <p
                                className={`font-${isCurrentUser ? 'bold' : 'semibold'} text-slate-800 ${isCurrentUser ? 'text-lg' : 'text-lg'}`}
                                id={isCurrentUser ? "el-r1d1rlwg" : undefined}>
                                {isCurrentUser ? 'You' : user.fullName}
                              </p>
                              <p
                                className="text-sm text-slate-600 font-medium"
                                id={isCurrentUser ? "el-j7s3f0cl" : undefined}>
                                {formatXP(user.xp)} XP {period === 'week' ? 'this week' : period === 'month' ? 'this month' : 'all time'}
                              </p>
                            </div>
                          </div>
                          {isCurrentUser && (
                            <div className="text-right" id="el-4c31mcbo">
                              <div className="flex items-center space-x-2" id="el-vrlz533w">
                                <svg
                                  className="w-5 h-5 text-green-500"
                                  fill="currentColor"
                                  id="el-40z3bpg6"
                                  viewBox="0 0 20 20">
                                  <path
                                    clipRule="evenodd"
                                    d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                                    fillRule="evenodd"
                                    id="el-53ddsr3e"
                                  />
                                </svg>
                              </div>
                            </div>
                          )}
                          {!isCurrentUser && (
                            <div className="text-sm text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-full">
                              {user.streak > 0 && `🔥 ${user.streak} day streak`}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
          <div className="space-y-6" id="el-mq1s0ff2">
            {currentUser && (
              <div
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl"
                id="el-wfvymr31">
                <h3
                  className="text-xl font-bold text-slate-800 mb-6"
                  id="el-vcayztvg">
                  Your Stats
                </h3>
                <div className="space-y-5" id="el-o0g3wguv">
                  <div
                    className="flex justify-between items-center p-3 bg-slate-50 rounded-xl"
                    id="el-g2rcu2da">
                    <span className="text-slate-600 font-medium" id="el-940bmnuh">
                      Current Rank
                    </span>
                    <span
                      className="font-bold text-blue-900 text-xl"
                      id="el-is4b8vi3">
                      #{currentUser.rank || 'N/A'}
                    </span>
                  </div>
                  <div
                    className="flex justify-between items-center p-3 bg-slate-50 rounded-xl"
                    id="el-b2m3dh5b">
                    <span className="text-slate-600 font-medium" id="el-uovs1v5x">
                      {getPeriodLabel()} XP
                    </span>
                    <span
                      className="font-bold text-slate-800 text-xl"
                      id="el-lvh738zp">
                      {formatXP(currentUser.xp)}
                    </span>
                  </div>
                  <div
                    className="flex justify-between items-center p-3 bg-slate-50 rounded-xl"
                    id="el-kil2dg9y">
                    <span className="text-slate-600 font-medium" id="el-qcbbilj0">
                      Streak
                    </span>
                    <span
                      className="font-bold text-orange-600 text-xl"
                      id="el-tgvtqi80">
                      {currentUser.streak} days
                    </span>
                  </div>
                  <div
                    className="flex justify-between items-center p-3 bg-slate-50 rounded-xl"
                    id="el-8t0lwvpz">
                    <span className="text-slate-600 font-medium" id="el-vjpvnw7d">
                      Lessons Completed
                    </span>
                    <span
                      className="font-bold text-green-600 text-xl"
                      id="el-4ea5enyh">
                      {currentUser.lessonsCompleted}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div
              className="bg-blue-900 rounded-2xl p-6 text-white shadow-xl"
              id="el-axsz0e30">
              <h3 className="text-xl font-bold mb-3" id="el-msqj3vme">
                {getPeriodLabel()} Challenge
              </h3>
              <p className="text-purple-100 mb-6" id="el-73nxoogg">
                {period === 'week' 
                  ? 'Earn 2,000 XP this week to unlock the "Dedicated Learner" badge!'
                  : period === 'month'
                  ? 'Earn 10,000 XP this month to unlock the "Monthly Master" badge!'
                  : 'Keep learning to climb the all-time leaderboard!'}
              </p>
              {currentUser && period === 'week' && (
                <>
                  <div
                    className="w-full bg-purple-400/50 rounded-full h-3 mb-3"
                    id="el-evddrgow">
                    <div
                      className="bg-white h-3 rounded-full shadow-sm"
                      id="el-rs5dgxzx"
                      style={{
                        width: `${Math.min((currentUser.xp / 2000) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between" id="el-p26fd3ga">
                    <span className="text-purple-100 font-medium" id="el-e9e79adp">
                      {formatXP(currentUser.xp)} / 2,000 XP
                    </span>
                    <span className="text-white font-bold" id="el-d52uf5me">
                      {Math.min(Math.round((currentUser.xp / 2000) * 100), 100)}%
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Leaderboard;
