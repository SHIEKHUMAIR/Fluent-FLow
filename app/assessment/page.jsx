'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const AssessmentPage = () => {
    const [step, setStep] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const questions = [
        {
            id: 1,
            question: "What is your experience with Mandarin Chinese?",
            icon: "🌏",
            options: [
                { text: "I've never learned it before.", points: 0 },
                { text: "I've dabbled a bit on apps.", points: 1 },
                { text: "I took some classes years ago.", points: 2 },
                { text: "I'm currently studying it.", points: 3 },
            ],
        },
        {
            id: 2,
            question: "How comfortable are you with Pinyin and Tones?",
            icon: "🎼",
            options: [
                { text: "I don't know what those are.", points: 0 },
                { text: "I know them but struggle with tones.", points: 1 },
                { text: "I can read Pinyin but mix up tones.", points: 2 },
                { text: "I'm confident with both.", points: 3 },
            ],
        },
        {
            id: 3,
            question: "How many Chinese characters (Hanzi) can you recognize?",
            icon: "🈴",
            options: [
                { text: "None / Very few", points: 0 },
                { text: "Around 50-100", points: 1 },
                { text: "Around 150-300", points: 2 },
                { text: "More than 300", points: 3 },
            ],
        },
        {
            id: 4,
            question: "Can you understand simple spoken Chinese?",
            icon: "👂",
            options: [
                { text: "Not at all.", points: 0 },
                { text: "Only isolated words (Hello, Thank you).", points: 1 },
                { text: "I can understand simple greetings.", points: 2 },
                { text: "I can follow basic conversations.", points: 3 },
            ],
        },
        {
            id: 5,
            question: "Can you form sentences to introduce yourself?",
            icon: "🗣️",
            options: [
                { text: "No, I can't.", points: 0 },
                { text: "Just 'My name is...'", points: 1 },
                { text: "Yes, name, nationality, and job.", points: 2 },
                { text: "Yes, fluently and with detail.", points: 3 },
            ],
        },
    ];

    const handleAnswer = (points) => {
        const newScore = score + points;
        setScore(newScore);

        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            setIsAnalyzing(true);
            setTimeout(() => {
                setIsAnalyzing(false);
                setShowResult(true);
            }, 2000);
        }
    };

    const getRecommendation = () => {
        // Max score = 15
        // 0-5: Unit 1
        // 6-10: Unit 2
        // 11-15: Unit 3

        if (score <= 5) {
            return {
                unit: "Unit 1: Foundation",
                badge: "Beginner",
                color: "blue",
                description: "Your journey starts here! We'll help you master the essential sounds, tones, and your first words in Mandarin.",
                reason: "Perfect for building a rock-solid foundation from scratch.",
                link: "/modules/unit01"
            };
        } else if (score <= 10) {
            return {
                unit: "Unit 2: Daily Life & Words",
                badge: "Intermediate",
                color: "green",
                description: "You have the basics down. Now it's time to expand your vocabulary and start navigating daily life situations.",
                reason: "Great for bridging the gap between sounds and real sentences.",
                link: "/modules/unit02"
            };
        } else {
            return {
                unit: "Unit 3: Elementary Mandarin",
                badge: "Elementary" ,
                color: "purple",
                description: "You're ready for the next level! Dive into sentence structures, grammar, and more complex conversations.",
                reason: "Designed to take your conversational skills to new heights.",
                link: "/modules/unit03"
            };
        }
    };

    const recommendation = showResult ? getRecommendation() : null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-sans">
            <div className="max-w-3xl w-full">

                {/* Header */}
                {!showResult && !isAnalyzing && (
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-extrabold text-blue-900 mb-2">
                            Let's Find Your Level
                        </h1>
                        <p className="text-lg text-slate-600 font-medium">
                            Answer 5 quick questions to get your personalized learning path.
                        </p>
                    </div>
                )}

                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/50 p-8 md:p-12 overflow-hidden relative min-h-[500px] flex flex-col justify-center">

                    {/* Progress Bar */}
                    {!showResult && !isAnalyzing && (
                        <div className="absolute top-0 left-0 w-full h-3 bg-slate-100">
                            <motion.div
                                className="h-full bg-blue-900"
                                initial={{ width: 0 }}
                                animate={{ width: `${((step + 1) / questions.length) * 100}%` }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                            />
                        </div>
                    )}

                    <AnimatePresence mode="wait">
                        {isAnalyzing ? (
                            <motion.div
                                key="analyzing"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="text-center w-full"
                            >
                                <div className="mb-8 relative">
                                    <div className="w-24 h-24 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                                    <div className="absolute inset-0 flex items-center justify-center text-4xl">
                                        🤖
                                    </div>
                                </div>
                                <h2 className="text-2xl font-bold text-blue-800 mb-2">Analyzing your profile...</h2>
                                <p className="text-slate-500">Curating the perfect curriculum for you.</p>
                            </motion.div>
                        ) : !showResult ? (
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="w-full"
                            >
                                <div className="flex items-center gap-4 mb-8">
                                    <span className="text-4xl bg-blue-50 p-4 rounded-2xl shadow-sm">{questions[step].icon}</span>
                                    <h2 className="text-2xl md:text-3xl font-bold text-blue-900 leading-tight">
                                        {questions[step].question}
                                    </h2>
                                </div>

                                <div className="grid gap-4">
                                    {questions[step].options.map((option, index) => (
                                        <motion.button
                                            key={index}
                                            whileHover={{ scale: 1.02, backgroundColor: "rgba(239, 246, 255, 0.8)" }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleAnswer(option.points)}
                                            className="w-full text-left p-6 rounded-2xl border-2 border-slate-100 hover:border-blue-500 bg-white transition-all duration-200 group shadow-sm hover:shadow-md"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-xl text-slate-700 group-hover:text-blue-900 font-semibold">
                                                    {option.text}
                                                </span>
                                                <span className="w-6 h-6 rounded-full border-2 border-slate-200 group-hover:border-blue-900 group-hover:bg-blue-900 transition-colors"></span>
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>

                                <div className="mt-8 text-right text-sm text-slate-400 font-medium">
                                    Question {step + 1} of {questions.length}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center w-full"
                            >
                                {(() => {
                                    const themes = {
                                        blue: {
                                            badge: "bg-white/40 text-[#1E3A8A] backdrop-blur-md border border-white/30",
                                            title: "from-blue-900  to-[#1E3A8A]",
                                            box: "bg-white/50 backdrop-blur-xl border border-white/40 shadow-xl",
                                            boxTitle: "text-[#1E3A8A]",
                                            boxText: "text-slate-700",
                                            button: "bg-gradient-to-r from-blue-900  to-[#1E3A8A] shadow-lg shadow-indigo-200/40",
                                        },
                                        green: {
                                            badge: "bg-white/40 text-[#1E3A8A] backdrop-blur-md border border-white/30",
                                            title: "from-blue-900  to-[#1E3A8A]",
                                            box: "bg-white/50 backdrop-blur-xl border border-white/40 shadow-xl",
                                            boxTitle: "text-[#1E3A8A]",
                                            boxText: "text-slate-700",
                                            button: "bg-gradient-to-r from-blue-900  to-[#1E3A8A] shadow-lg shadow-indigo-200/40",
                                        },
                                        purple: {
                                            badge: "bg-white/40 text-[#1E3A8A] backdrop-blur-md border border-white/30",
                                            title: "from-blue-900  to-[#1E3A8A]",
                                            box: "bg-white/50 backdrop-blur-xl border border-white/40 shadow-xl",
                                            boxTitle: "text-[#1E3A8A]",
                                            boxText: "text-slate-700",
                                            button: "bg-gradient-to-r from-blue-900  to-[#1E3A8A] shadow-lg shadow-indigo-200/40",
                                        },
                                    };


                                    const theme = themes[recommendation.color] || themes.blue;

                                    return (
                                        <>
                                            <div className={`inline-block px-6 py-2 rounded-full ${theme.badge} text-sm font-bold mb-8 tracking-wide uppercase shadow-md`}>
                                                Recommended Path: {recommendation.badge}
                                            </div>

                                            <h2 className={`text-4xl md:text-6xl font-extrabold bg-gradient-to-r ${theme.title} bg-clip-text text-transparent mb-8`}>
                                                {recommendation.unit}
                                            </h2>

                                            <div className={` rounded-3xl p-8 mb-10 max-w-2xl mx-auto`}>
                                                <h4 className={`font-bold ${theme.boxTitle} text-xl mb-3 flex items-center justify-center gap-2`}>
                                                    <span className="text-2xl">🎯</span> Why this unit?
                                                </h4>
                                                <p className={`${theme.boxText} text-lg leading-relaxed`}>
                                                    {recommendation.reason}
                                                </p>
                                            </div>

                                            <p className="text-xl text-slate-600 mb-12 leading-relaxed max-w-2xl mx-auto">
                                                {recommendation.description}
                                            </p>

                                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                                <Link href={recommendation.link} className="w-full sm:w-auto">
                                                    <button className={`w-full sm:w-auto ${theme.button} text-white px-12 py-5 rounded-2xl text-xl font-bold transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1`}>
                                                        Start Learning Now
                                                    </button>
                                                </Link>
                                                <Link href="/modules" className="w-full sm:w-auto">
                                                    <button className="w-full sm:w-auto bg-white text-slate-600 border-2 border-slate-200 px-12 py-5 rounded-2xl text-xl font-bold hover:bg-slate-50 hover:border-slate-300 transition-all">
                                                        View All Units
                                                    </button>
                                                </Link>
                                            </div>
                                        </>
                                    );
                                })()}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default AssessmentPage;
