"use client";
import { useState, useEffect } from "react";
import LessonLearn from "../lessons/LessonLearn";
import LessonReady from "../lessons/LessonReady";
import LessonQuiz from "../lessons/LessonQuiz";
import LessonMatch from "../lessons/LessonMatch";
import LessonSummary from "../lessons/LessonSummary";
import LessonAudioQuiz from "../lessons/LessonAudioQuiz";
import useTextToSpeech from "../../hooks/useTextToSpeech";

const Lesson1 = ({ selectedCategory = "lesson1" }) => {
  const { speak } = useTextToSpeech();

  // ✅ Default structure to prevent undefined errors
  const [lessonData, setLessonData] = useState({
    learningSlides: [],
    mcqQuestions: [],
    audioQuiz: [],
    matchingTasks: {}
  });

  const [phase, setPhase] = useState("learn");
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  // ✅ Dynamic JSON loading
  useEffect(() => {
    const loadData = async () => {
      if (selectedCategory) {
        try {
          const jsonData = await import(`../../../data/${selectedCategory}.json`);
          setLessonData(jsonData.default);
        } catch (error) {
          console.error(`Error loading ${selectedCategory} data:`, error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadData();
  }, [selectedCategory]);

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
    else setPhase(audioQs.length > 0 ? "audio" : "match");
  };

  const handleAudioAnswer = (choiceIndex) => {
    const q = audioQs[index];
    if (choiceIndex === q.correct) setScore((s) => s + 1);
    if (index < audioQs.length - 1) setIndex(index + 1);
    else setPhase(Object.keys(matchData).length > 0 ? "match" : "summary");
  };

  useEffect(() => {
    if (phase === "quiz" || phase === "audio") setIndex(0);
  }, [phase]);

  if (loading) return <div className="text-center mt-20 text-slate-600">Loading lesson...</div>;

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
        <LessonReady onStartQuiz={() => setPhase("quiz")} onReview={() => setPhase("learn")} />
      )}
      {phase === "quiz" && mcqs[index] && (
        <LessonQuiz question={mcqs[index]} current={index} total={mcqs.length} onAnswer={handleAnswer} />
      )}
      {phase === "audio" && audioQs[index] && (
        <LessonAudioQuiz
          question={audioQs[index]}
          current={index}
          total={audioQs.length}
          onAnswer={handleAudioAnswer}
          speak={speak}
        />
      )}
      {phase === "match" && (
        <LessonMatch groups={matchData} score={score} setScore={setScore} setPhase={setPhase} />
      )}
      {phase === "summary" && <LessonSummary score={score} />}
    </div>
  );
};

export default Lesson1;

