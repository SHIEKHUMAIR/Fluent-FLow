"use client";

import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Download, ChevronRight, Check } from 'lucide-react';
import { API_BASE_URL, API_PYTHON_URL } from '@/lib/config';
import roadmapQuestions from '@/data/roadmapQuestions.json';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Use profile questions from the JSON file
    const questions = roadmapQuestions.profile || [];
    const currentQuestion = questions[step];

    const handleOptionSelect = (optionValue) => {
        const newAnswers = { ...answers, [currentQuestion.id]: optionValue };
        setAnswers(newAnswers);

        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            // Finished
            generateRoadmap(newAnswers);
        }
    };

    const generateRoadmap = async (finalAnswers) => {
        setLoading(true);
        setError(null);
        try {
            // Get user info from storage
            const userId = localStorage.getItem('userId');
            const userName = localStorage.getItem('userName') || "Learner";

            if (!userId) {
                // If no user ID, we might allow them to proceed or force login.
                // For now, let's assume we need a user ID for the prompt customization.
                throw new Error("User ID not found. Please log in.");
            }

            // Construct payload for Python API
            const payload = {
                userId: userId,
                answers: finalAnswers,
                userName: userName,
                backendUrl: API_BASE_URL // Pass the main backend URL so Python script can fetch progress if needed
            };

            console.log("Generating Roadmap with payload:", payload);

            const response = await fetch(`${API_PYTHON_URL}/api/generate-roadmap`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Failed to generate roadmap via Python API");
            }

            // Handle blob (PDF) download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Roadmap_${userName.replace(/\s+/g, '_')}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            // Close after success
            setTimeout(() => {
                setIsOpen(false);
                setStep(0);
                setAnswers({});
                setLoading(false);
            }, 1000);

        } catch (err) {
            console.error("Roadmap Generation Error:", err);
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-50 animate-bounce-slow"
            >
                <MessageCircle size={28} />
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center text-white">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <Download size={20} /> AI Roadmap Generator
                            </h3>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full text-white">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {error && (
                                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                                    {error}
                                </div>
                            )}

                            {loading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                                    <p className="text-gray-600">Generating your personalized roadmap...</p>
                                    <p className="text-xs text-gray-400 mt-2">Connecting to AI engine...</p>
                                </div>
                            ) : currentQuestion ? (
                                <div>
                                    <div className="mb-6">
                                        <div className="flex justify-between text-xs text-gray-400 mb-2 uppercase tracking-wider font-semibold">
                                            <span>Question {step + 1} of {questions.length}</span>
                                            <span>{Math.round(((step) / questions.length) * 100)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div
                                                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${((step) / questions.length) * 100}%` }}
                                            />
                                        </div>
                                    </div>

                                    <h4 className="text-xl font-bold text-gray-800 mb-6 leading-tight">
                                        {currentQuestion.text}
                                    </h4>

                                    <div className="space-y-3">
                                        {currentQuestion.options.map((opt) => (
                                            <button
                                                key={opt.value}
                                                onClick={() => handleOptionSelect(opt.value)}
                                                className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-indigo-600 hover:bg-indigo-50 transition-all flex justify-between items-center group"
                                            >
                                                <span className="font-medium text-gray-700 group-hover:text-indigo-700">{opt.label}</span>
                                                <ChevronRight className="text-gray-300 group-hover:text-indigo-600" size={18} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Check className="mx-auto text-green-500 mb-4 h-16 w-16" />
                                    <p className="text-lg font-bold text-gray-800">Done!</p>
                                    <p className="text-gray-600">Your roadmap is ready.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;
