"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./custom-card"
import useTextToSpeech from "../hooks/useTextToSpeech"

export default function VocabularyCard({ words = [], onComplete }) {
  const [currentActivity, setCurrentActivity] = useState("listen")
  const [score, setScore] = useState(0)
  const [progress, setProgress] = useState(0)
  const { speak } = useTextToSpeech()

  const activities = [
    { id: "listen", name: "Listen & Learn", icon: "👂" },
    { id: "conversation", name: "Conversation", icon: "💬" },
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
      {currentActivity === "conversation" && <ConversationActivity words={words} onNext={nextActivity} speak={speak} />}
      {currentActivity === "quiz" && <QuizActivity words={words} onNext={nextActivity} setScore={setScore} />}
    </div>
  )
}

// ---------------- Listen Activity ----------------
function ListenActivity({ words, onNext, speak }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
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
              {currentWordIndex < words.length - 1 ? "Next Word →" : "Continue to Conversation →"}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ---------------- Conversation Activity ----------------
function ConversationActivity({ words, onNext, speak }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedResponse, setSelectedResponse] = useState(null)

  // ✅ Build conversation list
  const conversation = words.map((word) => {
    if (word.responses) {
      // Use predefined responses from JSON
      return {
        speaker: "李明",
        chinese: word.chinese,
        pinyin: word.pinyin,
        english: word.english,
        responses: word.responses, // directly use provided
      }
    }

    // Otherwise fallback to auto-generated fake responses
    const wrongOptions = words
      .filter((w) => w.id !== word.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2)

    return {
      speaker: "李明",
      chinese: word.chinese,
      pinyin: word.pinyin,
      english: word.english,
      responses: [
        { ...word, correct: true },
        ...wrongOptions.map((w) => ({ ...w, correct: false })),
      ].sort(() => Math.random() - 0.5),
    }
  })

  const currentConversation = conversation[currentStep]

  const handleResponse = (response) => {
    setSelectedResponse(response)
    setTimeout(() => {
      if (currentStep < conversation.length - 1) {
        setCurrentStep((prev) => prev + 1)
        setSelectedResponse(null)
      } else {
        onNext()
      }
    }, 2000)
  }

  const playAudio = (text) => {
    speak(text, { language: "zh-CN", rate: 0.6 })
  }

  return (
    <div className="bg-white rounded-2xl p-3 sm:p-5">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-xl sm:text-2xl font-semibold text-slate-900">
          💬 Conversation Practice ({currentStep + 1}/{conversation.length})
        </h3>
        <p className="text-slate-500 text-sm sm:text-base">Choose the appropriate response</p>
      </div>

      {/* Speaker */}
      <div className="bg-slate-50 p-4 sm:p-6 md:p-7 rounded-2xl mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-900 rounded-full flex items-center justify-center text-xl sm:text-2xl">
            👨
          </div>
          <div>
            <div className="font-semibold text-base sm:text-lg">{currentConversation.speaker}</div>
            <button
              className="text-sm text-blue-900 hover:underline"
              onClick={() => playAudio(currentConversation.chinese)}
            >
              🔊 Listen
            </button>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl">
          <div className="text-xl sm:text-2xl font-semibold">{currentConversation.chinese}</div>
          <div className="text-blue-900 text-sm sm:text-base">{currentConversation.pinyin}</div>
          <div className="text-slate-500 text-sm sm:text-base">"{currentConversation.english}"</div>
        </div>
      </div>

      {/* Responses */}
      <div className="space-y-3">
        {currentConversation.responses.map((response, idx) => (
          <button
            key={idx}
            className={`w-full p-4 sm:p-5 border-2 rounded-xl transition text-left
              ${selectedResponse
                ? response.correct
                  ? "bg-emerald-500 border-emerald-500 text-white"
                  : selectedResponse === response
                  ? "bg-red-500 border-red-500 text-white"
                  : "bg-white border-gray-200 text-slate-900"
                : "bg-white border-gray-200 text-slate-900 hover:bg-slate-50"}`}
            onClick={() => !selectedResponse && handleResponse(response)}
            disabled={!!selectedResponse}
          >
            <div className="text-base sm:text-lg font-semibold">{response.chinese}</div>
            <div className="text-xs sm:text-sm">
              {response.pinyin} - "{response.english}"
            </div>
            {selectedResponse === response && (
              <div className="mt-2 sm:mt-3 font-semibold text-sm sm:text-base">
                {response.correct ? "✅ Correct!" : "❌ Try again next time!"}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
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
