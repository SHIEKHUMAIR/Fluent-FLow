"use client"

import React, { useState, useMemo } from "react"
import vocabularyData from "../../data/vocabulary.json"
import VocabularyCard from "./vocabularycard"
import Relationexercise, { MatchingExercise } from "./relation-exercise"
import Countingexercise, { MultipleChoiceExercise } from "./counting-exercise"
import { ProgressSummary } from "./progress-summary"

export default function DemoExercise() {
  // Enrich exercises with actual vocab words
  const enrichedExercises = useMemo(
    () =>
      vocabularyData.exercises.map((ex) => ({
        ...ex,
        items: Array.isArray(ex.items)
          ? ex.items.map((index) => vocabularyData.basicVocabulary[index]).filter(Boolean)
          : [],
      })),
    []
  )

  const [exercises] = useState(enrichedExercises)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(null)
  const [progress, setProgress] = useState(null)
  const [showSummary, setShowSummary] = useState(false)

  const handleExerciseComplete = (score) => {
    const currentExercise = exercises[currentExerciseIndex]
    const totalQuestions = currentExercise.items.length

    setProgress({
      score,
      totalQuestions,
      currentExercise: currentExerciseIndex,
    })
    setShowSummary(true)
  }

  const handleRestart = () => {
    setShowSummary(false)
    setProgress(null)
    setCurrentExerciseIndex(null)
  }

  const startExercise = (index) => {
    setCurrentExerciseIndex(index)
    setShowSummary(false)
    setProgress(null)
  }

  if (!Array.isArray(exercises) || exercises.length === 0) {
    return <div className="p-10 text-center text-xl">No exercises found.</div>
  }

  if (showSummary && progress) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <ProgressSummary progress={progress} onRestart={handleRestart} />
        </div>
      </section>
    )
  }

  if (currentExerciseIndex !== null) {
    const currentExercise = exercises[currentExerciseIndex]

    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-10 px-4">
        <div className="max-w-7xl mx-auto">
         <button
  onClick={() => setCurrentExerciseIndex(null)}
  className="flex items-center gap-2 bg-blue-900 text-white hover:translate-x-2 font-medium px-4 py-2 rounded-full shadow-sm transition-all duration-200"
>
  <img
    src="/assets/arrow-small.png"
    alt="Back"
    className="w-5 h-5"
  />
  <span className="hidden sm:inline">Back</span>
</button>


          <h1 className="text-4xl sm:text-5xl font-extrabold bg-blue-900 bg-clip-text text-transparent pb-2 text-center">{currentExercise.title}</h1>

          {currentExercise.type === "vocabulary" && (
            <VocabularyCard words={currentExercise.items} onComplete={handleExerciseComplete} />
          )}

          {currentExercise.type === "relations" && (
            <Relationexercise words={currentExercise.items} onComplete={handleExerciseComplete} />
          )}

          {currentExercise.type === "counting-number" && (
            <Countingexercise words={currentExercise.items} onComplete={handleExerciseComplete} />
          )}
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-blue-900 bg-clip-text text-transparent pb-6">
            Chinese Learning Exercises
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Master basic Chinese vocabulary and pronunciation with interactive exercises
          </p>
        </div>

   <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
  {exercises.map((exercise, index) => (
    <div
      key={exercise.id}
      className="group bg-white/90 hover:bg-white shadow-lg hover:shadow-2xl border border-white/50 rounded-3xl p-8 transition-all duration-300 transform hover:scale-105 hover:cursor-pointer"
    >
      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-900 rounded-2xl flex items-center justify-center mb-6">
        {exercise.type === "vocabulary" && (
          <img src="/assets/vocab.png" alt="Vocabulary" className="w-8 h-8" />
        )}
        {exercise.type === "relations" && (
          <img src="/assets/family.png" alt="Relations" className="w-8 h-8" />
        )}
        {exercise.type === "counting-number" && (
          <img src="/assets/number.png" alt="Numbers" className="w-8 h-8" />
        )}
      </div>

      <h3 className="text-2xl font-bold text-slate-900">{exercise.title}</h3>
      <p className="text-slate-600 mb-6 leading-relaxed">
        {exercise.type === "vocabulary" &&
          "Build your vocabulary with interactive flashcards"}
        {exercise.type === "relations" &&
          "Practice family & relations in Chinese with matching exercises"}
        {exercise.type === "counting-number" &&
          "Learn basic numbers by choosing the right translation"}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500 font-medium">
          {exercise.items.length} questions
        </span>
        <button
          className="bg-blue-900 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
          onClick={() => startExercise(index)}
        >
          Start Exercise
        </button>
      </div>
    </div>
  ))}
</div>


      </div>
    </section>
  )
}
