"use client";
import { useState, useEffect } from "react";
import LessonLearn from "../lessons/LessonLearn";
import LessonReady from "../lessons/LessonReady";
import LessonExercise from "../lessons/LessonExercise";
import LessonMatch from "../lessons/LessonMatch";
import LessonSummary from "../lessons/LessonSummary";
import LessonAudioQuiz from "../lessons/LessonAudioQuiz";
import useTextToSpeech from "../../hooks/useTextToSpeech";
import lessonData from "../../../data/lesson3.json";

export default function Lesson3() {
  const { speak } = useTextToSpeech();
  const [phase, setPhase] = useState("learn");
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);

  const slides = lessonData.learningSlides;
  const mcqs = lessonData.mcqQuestions;
  const audioQs = lessonData.audioQuiz;
  const matchData = lessonData.matchingTasks;

  const goNext = () => setIndex((i) => Math.min(i + 1, slides.length - 1));
  const goPrev = () => setIndex((i) => Math.max(i - 1, 0));

  const handleAnswer = (choiceIndex) => {
    const q = mcqs[index];
    if (choiceIndex === q.correct) setScore((s) => s + 1);
    if (index < mcqs.length - 1) setIndex(index + 1);
    else setPhase("audio");
  };

  const handleAudioAnswer = (choiceIndex) => {
    const q = audioQs[index];
    if (choiceIndex === q.correct) setScore((s) => s + 1);
    if (index < audioQs.length - 1) setIndex(index + 1);
    else setPhase("match");
  };

  useEffect(() => {
    if (phase === "exercise" || phase === "audio") setIndex(0);
  }, [phase]);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 flex flex-col items-center">
      {phase === "learn" && (
        <LessonLearn
          lessonItems={slides}
          index={index}
          goNext={goNext}
          goPrev={goPrev}
          setPhase={setPhase}
          speak={speak}
        />
      )}

      {phase === "ready" && (
        <LessonReady
          onStartQuiz={() => setPhase("exercise")}
          onReview={() => setPhase("learn")}
        />
      )}

      {phase === "exercise" && (
        <LessonExercise
          question={mcqs[index]}
          current={index}
          total={mcqs.length}
          onAnswer={handleAnswer}
        />
      )}

      {phase === "audio" && (
        <LessonAudioQuiz
          question={audioQs[index]}
          current={index}
          total={audioQs.length}
          onAnswer={handleAudioAnswer}
          speak={speak}
        />
      )}

      {phase === "match" && (
        <LessonMatch
          groups={matchData}
          score={score}
          setScore={setScore}
          setPhase={setPhase}
        />
      )}

      {phase === "summary" && <LessonSummary score={score} />}
    </div>
  );
}
