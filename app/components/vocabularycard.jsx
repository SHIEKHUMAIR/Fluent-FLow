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
    } else if (onComplete) {
      onComplete(score)
    }
  }

  // Calculate incremental progress
  const calculateProgress = (activity, step, totalSteps) => {
    const activityIndex = activities.findIndex((a) => a.id === activity)
    const activityWeight = 100 / activities.length
    const stepProgress = (step / totalSteps) * activityWeight
    return (activityIndex * activityWeight) + stepProgress
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
      <div className="flex flex-wrap justify-center gap-3 mb-4">
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
      {currentActivity === "listen" && (
        <ListenActivity 
          words={words} 
          onNext={nextActivity} 
          speak={speak} 
          setProgress={setProgress}
          calculateProgress={calculateProgress}
        />
      )}
      {currentActivity === "conversation" && (
        <ConversationActivity 
          words={words} 
          onNext={nextActivity} 
          speak={speak} 
          setProgress={setProgress}
          calculateProgress={calculateProgress}
        />
      )}
      {currentActivity === "quiz" && (
        <QuizActivity 
          words={words} 
          onNext={nextActivity} 
          setScore={setScore} 
          setProgress={setProgress}
          calculateProgress={calculateProgress}
        />
      )}
    </div>
  )
}

// ---------------- Listen Activity ----------------
function ListenActivity({ words, onNext, speak, setProgress, calculateProgress }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const currentWord = words[currentWordIndex]

  const playAudio = () => {
    speak(currentWord.chinese, { language: "zh-CN", rate: 0.6 })
  }

  const nextWord = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1)
      // Update progress for each word completed
      setProgress(calculateProgress("listen", currentWordIndex + 1, words.length))
    } else {
      onNext()
    }
  }

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-semibold text-slate-800"> 👂 Listen & Learn ({currentWordIndex + 1}/{words.length}) </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="bg-white rounded-2xl p-8 text-center items-center shadow border border-slate-100">
          <div className="text-4xl font-bold text-slate-900 mb-4">{currentWord.chinese}</div>
          <div className="text-xl text-blue-900 font-medium mb-4">{currentWord.pinyin}</div>
          <div className="text-lg text-emerald-600 font-semibold bg-emerald-50 px-6 py-3 rounded-lg border border-emerald-200 mb-8">
            "{currentWord.english}"
          </div>

          <div className="flex justify-center">
            <button
              className="flex items-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-2xl hover:scale-105 transition"
              onClick={playAudio}
            >
              <img
                src="/assets/volume.png"
                alt="Listen"
                className="w-5 h-5"
              />
              Listen & Practice
            </button>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              className="flex items-center gap-2 px-8 py-4 bg-emerald-500 text-white rounded-2xl hover:scale-105 transition"
              onClick={nextWord}
            >
              {currentWordIndex < words.length - 1 ? (
                <>
                  Next Word
                  <img src="/assets/arrow-small-right.png" alt="Next" className="w-6 h-6" />
                </>
              ) : (
                <>
                  Continue to Conversation
                  <img src="/assets/arrow-small-right.png" alt="Next" className="w-6 h-6" />
                </>
              )}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ConversationActivity({ words, onNext, speak, setProgress, calculateProgress }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedResponse, setSelectedResponse] = useState(null)

  const conversation = words.map((word) => {
    if (word.responses) {
      return {
        speaker: "李明",
        chinese: word.chinese,
        pinyin: word.pinyin,
        english: word.english,
        responses: word.responses,
      }
    }
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
        // Update progress for each conversation step completed
        setProgress(calculateProgress("conversation", currentStep + 1, conversation.length))
      } else {
        onNext()
      }
    }, 1500)
  }

  const playAudio = (text) => {
    speak(text, { language: "zh-CN", rate: 0.6 })
  }

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 flex flex-col h-[80vh] justify-between">
      {/* Header */}
      <div className="text-center mb-3">
        <h3 className="text-lg sm:text-xl font-semibold text-slate-900">
          💬 Conversation ({currentStep + 1}/{conversation.length})
        </h3>
        <p className="text-slate-500 text-xs sm:text-sm">
          Choose the correct response
        </p>
      </div>

      {/* Speaker */}
      <div className="bg-slate-50 p-3 sm:p-4 rounded-xl mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center text-lg text-white">
            👨
          </div>
          <div>
            <div className="font-semibold text-sm sm:text-base">{currentConversation.speaker}</div>
            <button
              className="text-xs text-blue-900 hover:underline"
              onClick={() => playAudio(currentConversation.chinese)}
            >
              🔊 Listen
            </button>
          </div>
        </div>
        <div className="bg-white p-3 rounded-lg text-center">
          <div className="text-lg font-semibold">{currentConversation.chinese}</div>
          <div className="text-blue-900 text-sm">{currentConversation.pinyin}</div>
          <div className="text-slate-500 text-xs">"{currentConversation.english}"</div>
        </div>
      </div>

      {/* Responses */}
      <div className="space-y-2 flex-1 overflow-y-auto">
        {currentConversation.responses.map((response, idx) => (
          <button
            key={idx}
            className={`w-full p-3 sm:p-4 border-2 rounded-lg transition text-left text-sm
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
            <div className="font-semibold">{response.chinese}</div>
            <div className="text-xs">
              {response.pinyin} - "{response.english}"
            </div>
            {selectedResponse === response && (
              <div className="mt-1 font-semibold text-xs">
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
function QuizActivity({ words, onNext, setScore, setProgress, calculateProgress }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [quizScore, setQuizScore] = useState(0)

  const questions = useMemo(() => {
    const shuffledWords = [...words].sort(() => Math.random() - 0.5)
    return shuffledWords.map((word) => {
      const wrongOptions = shuffledWords
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
        // Update progress for each quiz question completed
        setProgress(calculateProgress("quiz", currentQuestion + 1, questions.length))
      } else {
        onNext()
      }
    }, 1000)
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