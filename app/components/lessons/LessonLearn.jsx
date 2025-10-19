"use client";
import { useEffect, useState } from "react";

export default function LessonLearn({ lessonItems, index, goNext, goPrev, setPhase, speak }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const currentItem = lessonItems[index];
  const totalSlides = lessonItems.length;

  const playChinese = (text) => {
    if (!text) return;
    try {
      setIsPlaying(true);
      speak(text);
    } catch (err) {
      console.warn("Speech error:", err);
      setIsPlaying(false);
    }
  };

  // Track when playback stops
  useEffect(() => {
    const interval = setInterval(() => {
      if (!window.speechSynthesis.speaking) setIsPlaying(false);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-4xl">
      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-4 gap-4">
        <div className="text-sm font-medium text-slate-600">
          {index + 1} / {totalSlides}
        </div>
        <div className="flex-1 mx-4 bg-gray-100 h-2 rounded overflow-hidden">
          <div
            className="h-2 bg-blue-900 rounded transition-all duration-300"
            style={{ width: `${((index + 1) / totalSlides) * 100}%` }}
          />
        </div>
        <div className="text-sm text-slate-500">{currentItem.pinyin}</div>
      </div>

      {/* Lesson Layout */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-center min-h-[70vh]">
        {/* Left: Chinese Text + Buttons */}
        <div className="flex-1 text-center my-auto">
          <div className="mb-3">
            <div className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-none">
              {currentItem.chinese}
            </div>
            <div className="text-xl text-blue-900 font-medium mt-2">{currentItem.pinyin}</div>
            <div className="text-sm text-slate-600 mt-1">{currentItem.english}</div>
          </div>

          {/* Listen Button */}
          <div className="mt-6 flex flex-col items-center gap-4">
<button
  onClick={() => playChinese(currentItem.chinese)}
  aria-label="Listen"
  className="flex items-center justify-center gap-2 px-6 py-3 text-white rounded-2xl font-medium transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
  style={{
    background: isPlaying
      ? "linear-gradient(to right, #1e3a8a, #1e40af)" // from-blue-700 to-blue-900
      : "#1e3a8a", // blue-900
  }}
>
  <span className="text-lg transition-transform duration-300 ease-in-out">
    {isPlaying ? "🔊" : "🔈"}
  </span>
  <span>Listen and Repeat Aloud</span>
</button>



            {/* Navigation Buttons */}
            <div className="mt-2 flex gap-3">
              <button
                onClick={goPrev}
                disabled={index === 0}
                className={`flex items-center gap-2 px-8 py-4 bg-blue-900 text-white rounded-2xl hover:scale-105 transition ${
                  index === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                <img src="/assets/arrow-small.png" alt="Prev" className="w-6 h-6" />
                Prev
              </button>

              {index < totalSlides - 1 ? (
                <button
                  onClick={goNext}
                  className="flex items-center gap-2 px-8 py-4 bg-emerald-500 text-white rounded-2xl hover:scale-105 transition"
                >
                  Next
                  <img src="/assets/arrow-small-right.png" alt="Next" className="w-6 h-6" />
                </button>
              ) : (
                <button
                  onClick={() => setPhase("ready")}
                  className="flex items-center gap-2 px-8 py-4 bg-emerald-500 text-white rounded-2xl hover:scale-105 transition"
                >
                  Continue
                  <img src="/assets/arrow-small-right.png" alt="Next" className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Image */}
        <div className="md:w-96 flex-shrink-0">
          <div className="w-full h-56 md:h-96 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex items-center justify-center">
            <img
              src={currentItem.image}
              alt={currentItem.english}
              className="object-contain w-full h-full p-4"
            />
          </div>
          <div className="text-center text-xs text-slate-500 mt-3">{currentItem.english}</div>
        </div>
      </div>
    </div>
  );
}
