"use client";
import { useState } from "react";

export default function LessonExercise({ question, onAnswer, current, total }) {
  const [selected, setSelected] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleChoice = (idx) => {
    if (isAnswered) return; // prevent multiple clicks
    setSelected(idx);
    setIsAnswered(true);
    setTimeout(() => {
      onAnswer(idx);
      setSelected(null);
      setIsAnswered(false);
    }, 1000); // move to next question after 1 sec
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-3xl text-center">
      {/* Header */}
      <div className="text-sm text-slate-500 mb-3">
        Question {current + 1} / {total}
      </div>

      {/* Question Text */}
      <div className="bg-slate-50 border rounded-2xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-slate-800 leading-relaxed">
          {question.text}
        </h3>
      </div>

      {/* Choices */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
        {question.choices.map((choice, idx) => {
          let buttonClass =
            "py-4 px-6 text-lg font-semibold rounded-2xl border transition-all duration-200 ";

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
              onClick={() => handleChoice(idx)}
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
