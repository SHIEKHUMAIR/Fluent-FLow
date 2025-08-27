"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./custom-card"
import useTextToSpeech from "../hooks/useTextToSpeech"

export default function Relationexercise({ words = [], onComplete }) {
  const [currentActivity, setCurrentActivity] = useState("listen")
  const [score, setScore] = useState(0)
  const [progress, setProgress] = useState(0)
  const { speak } = useTextToSpeech()

  // ✅ Activities (removed conversation)
  const activities = [
    { id: "listen", name: "Listen & Learn", icon: "👂" },
    { id: "quiz", name: "Quick Quiz", icon: "🧠" },
  ]

  const nextActivity = () => {
    const currentIndex = activities.findIndex((a) => a.id === currentActivity)
    if (currentIndex < activities.length - 1) {
      setCurrentActivity(activities[currentIndex + 1].id)
      setProgress(((currentIndex + 1) / activities.length) * 100)
    } else if (onComplete) {
      onComplete(score)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 rounded mb-8">
        <div
          className="h-2 bg-blue-900 rounded transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Activity Navigation */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {activities.map((activity) => (
          <button
            key={activity.id}
            className={`px-5 py-2 rounded-full border text-sm font-medium shadow-sm transition-colors
              ${currentActivity === activity.id
                ? "bg-blue-900 text-white border-blue-900"
                : "bg-white text-slate-500 border-gray-200 hover:bg-slate-50"}`}
            onClick={() => setCurrentActivity(activity.id)}
          >
            {activity.icon} {activity.name}
          </button>
        ))}
      </div>

      {/* Activity Content */}
      {currentActivity === "listen" && <ListenActivity words={words} onNext={nextActivity} speak={speak} />}
      {currentActivity === "quiz" && <QuizActivity words={words} onNext={nextActivity} setScore={setScore} />}
    </div>
  )
}

// ---------------- Listen Activity ----------------
function ListenActivity({ words, onNext, speak }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
   if (!words || words.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 text-center">
        <p className="text-slate-500">No words available.</p>
      </div>
    )
  }
  const currentWord = words[currentWordIndex]

  const playAudio = () => {
    speak(currentWord.chinese, { language: "zh-CN", rate: 0.6 })
  }

  const nextWord = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1)
    } else {
      onNext()
    }
  }

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-semibold text-slate-800">
          👂 Listen & Learn ({currentWordIndex + 1}/{words.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-white rounded-2xl p-12 text-center shadow border border-slate-100">
          <div className="text-6xl font-bold text-slate-900 mb-4">{currentWord.chinese}</div>
          <div className="text-2xl text-blue-900 font-medium mb-4">{currentWord.pinyin}</div>
          <div className="text-xl text-emerald-600 font-semibold bg-emerald-50 px-6 py-3 rounded-lg border border-emerald-200 mb-8">
            "{currentWord.english}"
          </div>

          <button
            className="px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-600 transition"
            onClick={playAudio}
          >
            🔊 Listen & Practice
          </button>

          <div className="mt-6">
            <button
              className="px-8 py-4 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
              onClick={nextWord}
            >
              {currentWordIndex < words.length - 1 ? "Next Word →" : "Continue to Quiz →"}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ---------------- Quiz Activity ----------------
function QuizActivity({ words, onNext, setScore }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [quizScore, setQuizScore] = useState(0)

  const questions = useMemo(() => {
    return words.map((word) => {
      const wrongOptions = words
        .filter((w) => w.id !== word.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 2)

      const options = [word.english, ...wrongOptions.map((w) => w.english)]
        .sort(() => Math.random() - 0.5)

      return {
        question: `What does "${word.chinese}" (${word.pinyin}) mean?`,
        correct: word.english,
        options,
      }
    })
  }, [words])

  const currentQ = questions[currentQuestion]

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer)
    if (answer === currentQ.correct) {
      setQuizScore((prev) => prev + 1)
      setScore((prev) => prev + 1)
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1)
        setSelectedAnswer(null)
      } else {
        onNext()
      }
    }, 2000)
  }

  return (
    <div className="bg-white rounded-2xl p-10">
      <div className="mb-8 text-center">
        <h3 className="text-2xl font-semibold">
          🧠 Quick Quiz ({currentQuestion + 1}/{questions.length})
        </h3>
        <p className="text-slate-500">
          Score: {quizScore}/{questions.length}
        </p>
      </div>

      <div className="text-xl font-semibold text-center mb-10">{currentQ.question}</div>

      {currentQ.options.map((option, idx) => (
        <button
          key={idx}
          className={`w-full p-5 my-2 border-2 rounded-lg transition 
            ${selectedAnswer
              ? option === currentQ.correct
                ? "bg-emerald-500 border-emerald-500 text-white"
                : option === selectedAnswer
                ? "bg-red-500 border-red-500 text-white"
                : "bg-white border-gray-200 text-slate-900"
              : "bg-white border-gray-200 text-slate-900 hover:bg-slate-50"}`}
          onClick={() => !selectedAnswer && handleAnswer(option)}
          disabled={!!selectedAnswer}
        >
          {option}
          {selectedAnswer &&
            (option === currentQ.correct ? (
              <span className="ml-3">✅</span>
            ) : option === selectedAnswer ? (
              <span className="ml-3">❌</span>
            ) : null)}
        </button>
      ))}
    </div>
  )
}
