"use client";

import { useState, useEffect } from "react";

export default function LessonAudioQuiz({ question, current, total, onAnswer, speak }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handlePlay = () => {
    if (!question.audioText) return;
    setIsPlaying(true);
    speak(question.audioText);
  };

  // Stop "listening" animation when speech ends
  useEffect(() => {
    const check = setInterval(() => {
      if (!window.speechSynthesis.speaking) setIsPlaying(false);
    }, 300);
    return () => clearInterval(check);
  }, []);

  const handleSelect = (idx) => {
    if (isAnswered) return;

    setSelected(idx);
    setIsAnswered(true);

    setTimeout(() => {
      onAnswer(idx);
      setSelected(null);
      setIsAnswered(false);
    }, 1000); // Move to next after 1 sec
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-3xl text-center">
      {/* Progress */}
      <div className="text-sm text-slate-500 mb-3">
        Question {current + 1} / {total}
      </div>

      {/* Audio Play Section */}
      <div className="flex flex-col items-center justify-center mb-8">
        <button
          onClick={handlePlay}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-medium text-white transition-all duration-300
            ${
              isPlaying
                ? "bg-gradient-to-r from-blue-700 to-blue-900"
                : "bg-blue-900 hover:bg-blue-800 hover:scale-105"
            }`}
        >
          {isPlaying ? "🔊 Listening..." : "▶️ Play Audio"}
        </button>
        <p className="mt-3 text-slate-500 text-sm italic">
          Listen carefully and choose the correct pronunciation.
        </p>
      </div>

      {/* Question Prompt */}
      <h3 className="text-lg font-semibold mb-6 text-slate-800">
        Which Pinyin matches the audio you just heard?
      </h3>

      {/* Choices */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
        {question.choices.map((choice, idx) => {
          let buttonClass =
            "w-full py-4 px-6 text-lg font-semibold rounded-2xl border transition-all duration-200 ";

          if (isAnswered) {
            if (idx === question.correct) {
              buttonClass += "bg-green-100 border-green-500 text-green-700";
            } else if (idx === selected && selected !== question.correct) {
              buttonClass += "bg-red-100 border-red-500 text-red-700";
            } else {
              buttonClass += "bg-white text-slate-700 opacity-70";
            }
          } else {
            buttonClass +=
              "bg-white hover:bg-blue-50 hover:scale-105 text-slate-800";
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={isAnswered}
              className={buttonClass}
            >
              {choice}
            </button>
          );
        })}
      </div>
    </div>
  );
}
