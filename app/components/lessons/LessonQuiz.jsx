"use client";
import { useState } from "react";

export default function LessonQuiz({ question, onAnswer, current, total }) {
  const [selected, setSelected] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleSelect = (idx) => {
    if (isAnswered) return; // prevent multiple clicks
    setSelected(idx);
    setIsAnswered(true);

    // Pass answer to parent after short delay
    setTimeout(() => {
      onAnswer(idx);
      setSelected(null);
      setIsAnswered(false);
    }, 900);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-3xl text-center">
      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-slate-500 font-medium">
          Question {current + 1} / {total}
        </span>
        <div className="flex-1 mx-4 bg-gray-100 h-2 rounded overflow-hidden">
          <div
            className="h-2 bg-blue-900 rounded transition-all duration-300"
            style={{ width: `${((current + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Image Section */}
      {question.image && (
        <div className="flex justify-center mb-8">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl shadow-sm p-4 w-full max-w-sm flex items-center justify-center">
            <img
              src={question.image}
              alt="quiz item"
              className="object-contain w-full h-48"
            />
          </div>
        </div>
      )}

      {/* Question Text */}
      <h3 className="text-xl font-bold text-slate-900 mb-6">
        Which <span className="text-blue-900">Pinyin</span> matches this image?
      </h3>

      {/* Choices */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
        {question.choices.map((choice, idx) => {
          const isCorrect = idx === question.correct;
          const isWrong = selected === idx && selected !== question.correct;

          let cls =
            "py-4 px-6 text-lg font-semibold rounded-2xl border border-slate-200 transition-all duration-200 transform";

          if (selected === null)
            cls += " bg-white hover:bg-blue-50 hover:scale-105";
          else if (isCorrect)
            cls += " bg-emerald-500 text-white border-emerald-500";
          else if (isWrong)
            cls += " bg-red-500 text-white border-red-500";
          else cls += " bg-slate-100 opacity-70";

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={isAnswered}
              className={cls}
            >
              {choice}
            </button>
          );
        })}
      </div>
    </div>
  );
}
