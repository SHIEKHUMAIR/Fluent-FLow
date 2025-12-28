import React from 'react';

const AchievementModal = ({ achievement, onClaim, isOpen }) => {
    if (!isOpen || !achievement) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">

            <div className="relative w-full max-w-sm rounded-3xl bg-white/80 backdrop-blur-xl p-8
                      shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]
                      border border-white/40 animate-scale-in overflow-hidden">

                {/* Ambient gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-200/20 via-transparent to-transparent pointer-events-none" />

                {/* Floating accents */}
                <span className="absolute top-6 left-6 text-indigo-400 text-xl animate-float">✦</span>
                <span className="absolute top-12 right-10 text-cyan-400 text-lg animate-float delay-150">✦</span>
                <span className="absolute bottom-14 left-10 text-emerald-400 text-sm animate-float delay-300">✦</span>

                {/* Header */}
                <h2 className="text-xs font-semibold tracking-widest text-indigo-600 uppercase mb-4 text-center">
                    Achievement Unlocked
                </h2>

                {/* Badge */}
                <div className="relative mb-6">
                    <div className="mx-auto w-28 h-28 rounded-full
                          bg-gradient-to-br from-indigo-100 via-sky-100 to-emerald-100
                          flex items-center justify-center
                          shadow-inner ring-4 ring-white/80">
                        <span className="text-6xl drop-shadow-sm">
                            {achievement.icon || '🏆'}
                        </span>
                    </div>

                    {/* XP */}
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2
                          bg-indigo-600 text-white text-xs font-semibold
                          px-4 py-1.5 rounded-full shadow-md">
                        +{achievement.xp_reward || 50} XP
                    </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-slate-800 text-center mb-2">
                    {achievement.title}
                </h3>

                <p className="text-slate-600 text-sm text-center mb-8 leading-relaxed px-4">
                    {achievement.description}
                </p>

                {/* CTA */}
                <button
                    onClick={onClaim}
                    className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600
                     hover:from-indigo-700 hover:to-cyan-700
                     text-white font-semibold py-3
                     transition-all duration-200
                     shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                    Claim Your Badge
                </button>
            </div>
        </div>
    );
};

export default AchievementModal;
