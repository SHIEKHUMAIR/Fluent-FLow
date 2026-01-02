'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const AssessmentPage = () => {
    // Configuration for API URL
    const API_URL_LOCAL = "http://localhost:4000";
    const API_URL_DEPLOYED = "https://your-backend-app.onrender.com"; // UPDATE THIS AFTER DEPLOYING

    // Toggle this to switch between local and deployed versions
    const API_URL = API_URL_LOCAL;

    const [step, setStep] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUnits = async () => {
            try {
                const response = await fetch(`${API_URL}/api/lessons/units`);
                const data = await response.json();
                if (data.success) {
                    setUnits(data.data.sort((a, b) => a.unit_number - b.unit_number));
                }
            } catch (error) {
                console.error("Failed to fetch units:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUnits();
    }, []);

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
                { text: "More than 500", points: 3 },
            ],
        },
        {
            id: 4,
            question: "Can you handle basic travel situations?",
            icon: "✈️",
            options: [
                { text: "No, I would be lost.", points: 0 },
                { text: "I can say 'taxi' and 'hotel'.", points: 1 },
                { text: "I can buy tickets and order food.", points: 2 },
                { text: "I can handle check-ins and travel issues.", points: 3 },
            ],
        },
        {
            id: 5,
            question: "Can you talk about your daily life and routine?",
            icon: "📅",
            options: [
                { text: "Not really.", points: 0 },
                { text: "I can say times and dates.", points: 1 },
                { text: "I can describe my day simply.", points: 2 },
                { text: "I can freely discuss my schedule and habits.", points: 3 },
            ],
        },
        {
            id: 6,
            question: "How are you with complex sentence structures?",
            icon: "🏗️",
            options: [
                { text: "I only use simple Subject-Verb-Object.", points: 0 },
                { text: "I can use 'le' (了) and 'de' (的) sometimes.", points: 1 },
                { text: "I use conjunctions and relative clauses.", points: 2 },
                { text: "I use formal structures and idioms.", points: 3 },
            ],
        },
        {
            id: 7,
            question: "Can you handle an emergency situation in China?",
            icon: "🚑",
            options: [
                { text: "I wouldn't know what to say.", points: 0 },
                { text: "I can shout 'Help!'", points: 1 },
                { text: "I can explain I'm sick or lost.", points: 2 },
                { text: "I can describe symptoms and police reports.", points: 3 },
            ],
        },
        {
            id: 8,
            question: "Can you discuss social topics or news?",
            icon: "📰",
            options: [
                { text: "No, that's too hard.", points: 0 },
                { text: "Maybe very simple topics.", points: 1 },
                { text: "I can give my opinion on familiar topics.", points: 2 },
                { text: "Yes, I can discuss abstract ideas.", points: 3 },
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
        if (units.length === 0) return null;

        // Calculate max possible score: 8 questions * 3 points max = 24 points
        const maxScore = questions.length * 3;

        // Calculate points per unit based on the number of available units
        const pointsPerUnit = maxScore / units.length;

        // Determine the unit index based on the user's score
        // Example: Score 5. 24/6 = 4 points per unit.
        // 0-4: Unit 1, 5-8: Unit 2, etc.
        // Index = floor(5 / 4) = 1 (Unit 2)
        // Ensure index doesn't exceed units.length - 1 (for max score)
        let unitIndex = Math.floor(score / pointsPerUnit);

        // Clamp the index to be valid
        if (unitIndex >= units.length) {
            unitIndex = units.length - 1;
        }

        const recommendedUnit = units[unitIndex];

        // Format the link: /modules/unit01, /modules/unit02, etc.
        // Assuming unit_number is 1, 2, 3...
        const unitNumberPadded = recommendedUnit.unit_number.toString().padStart(2, '0');

        // Strip "UNIT X:" prefix for cleaner badge text if present
        const cleanTitle = recommendedUnit.title.replace(/^UNIT \d+:\s*/i, '');

        return {
            unit: recommendedUnit.title,
            badge: `${cleanTitle} Level`, // Or map to badges if you have them separately
            color: "blue", // Forced blue theme as requested
            description: recommendedUnit.description,
            reason: `Based on your assessment, this unit matches your current tailored proficiency level.`,
            link: `/modules/unit${unitNumberPadded}`
        };
    };

    const recommendation = showResult ? getRecommendation() : null;

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-50 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-sans relative">
            {/* Back Button */}
            <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-50">
                <Link href="/modules">
                    <button
                        className="flex items-center gap-2 bg-blue-900 text-white hover:translate-x-2 font-medium px-4 py-2 rounded-full shadow-sm transition-all duration-200"
                    >
                        <img
                            src="/assets/arrow-small.png"
                            alt="Back"
                            className="w-5 h-5"
                        />
                        <span className="hidden sm:inline">Back</span>
                    </button>
                </Link>
            </div>

            <div className="max-w-3xl w-full relative">

                {/* Header */}
                {!showResult && !isAnalyzing && (
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-extrabold text-blue-900 mb-2">
                            Let's Find Your Level
                        </h1>
                        <p className="text-base text-slate-600 font-medium">
                            Answer {questions.length} quick questions to get your personalized learning path.
                        </p>
                    </div>
                )}

                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 md:p-8 overflow-hidden relative min-h-[400px] flex flex-col justify-center">

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
                                    <span className="text-3xl bg-blue-50 p-3 rounded-xl shadow-sm">{questions[step].icon}</span>
                                    <h2 className="text-xl md:text-2xl font-bold text-blue-900 leading-tight">
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
                                            className="w-full text-left p-4 rounded-xl border-2 border-slate-100 hover:border-blue-500 bg-white transition-all duration-200 group shadow-sm hover:shadow-md"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-lg text-slate-700 group-hover:text-blue-900 font-semibold">
                                                    {option.text}
                                                </span>
                                                <span className="w-5 h-5 rounded-full border-2 border-slate-200 group-hover:border-blue-900 group-hover:bg-blue-900 transition-colors"></span>
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
                                    // Forced Blue Theme
                                    const themes = {
                                        blue: {
                                            badge: "bg-white/40 text-[#1E3A8A] backdrop-blur-md border border-white/30",
                                            title: "from-blue-900  to-[#1E3A8A]",
                                            box: "bg-white/50 backdrop-blur-xl border border-white/40 shadow-xl",
                                            boxTitle: "text-[#1E3A8A]",
                                            boxText: "text-slate-700",
                                            button: "bg-gradient-to-r from-blue-900  to-[#1E3A8A] shadow-lg shadow-indigo-200/40",
                                        }
                                    };

                                    const theme = themes.blue;

                                    return (
                                        <>
                                            <div className={`inline-block px-4 py-1.5 rounded-full ${theme.badge} text-xs font-bold mb-6 tracking-wide uppercase shadow-sm`}>
                                                Recommended Path: {recommendation.badge}
                                            </div>

                                            <h2 className={`text-3xl md:text-4xl font-extrabold bg-gradient-to-r ${theme.title} bg-clip-text text-transparent mb-6`}>
                                                {recommendation.unit}
                                            </h2>

                                            <div className={`rounded-2xl p-6 mb-8 max-w-xl mx-auto`}>
                                                <h4 className={`font-bold ${theme.boxTitle} text-lg mb-2 flex items-center justify-center gap-2`}>
                                                    <span className="text-xl">🎯</span> Why this unit?
                                                </h4>
                                                <p className={`${theme.boxText} text-base leading-relaxed`}>
                                                    {recommendation.reason}
                                                </p>
                                            </div>

                                            <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-xl mx-auto">
                                                {recommendation.description}
                                            </p>

                                            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                                                <Link href={recommendation.link} className="w-full sm:w-auto">
                                                    <button className={`w-full sm:w-auto ${theme.button} text-white px-8 py-3 rounded-xl text-lg font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5`}>
                                                        Start Learning Now
                                                    </button>
                                                </Link>
                                                <Link href="/modules" className="w-full sm:w-auto">
                                                    <button className="w-full sm:w-auto bg-white text-slate-600 border border-slate-200 px-8 py-3 rounded-xl text-lg font-bold hover:bg-slate-50 hover:border-slate-300 transition-all">
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
