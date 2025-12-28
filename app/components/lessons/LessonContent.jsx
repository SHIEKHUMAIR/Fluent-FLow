"use client";
import { useState, useEffect } from "react";
import LessonLearn from "./LessonLearn";
import LessonExercise from "./LessonExercise";
import LessonReady from "./LessonReady";
import LessonQuiz from "./LessonQuiz";
import LessonMatch from "./LessonMatch";
import LessonSummary from "./LessonSummary";
import LessonAudioQuiz from "./LessonAudioQuiz";
import useTextToSpeech from "../../hooks/useTextToSpeech";
import { API_ENDPOINTS } from "../../../lib/config";
import { apiGet, apiPost, getUserId } from "../../../lib/api";

const LessonContent = ({ unitNumber, lessonNumber, lessonId }) => {
  const { speak } = useTextToSpeech();

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
  const [error, setError] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [currentLessonId, setCurrentLessonId] = useState(lessonId);

  // Load lesson data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        let result;
        if (lessonId) {
          result = await apiGet(API_ENDPOINTS.LESSONS.BY_ID(lessonId));
          setCurrentLessonId(lessonId);
        } else if (unitNumber !== undefined && lessonNumber !== undefined) {
          result = await apiGet(API_ENDPOINTS.LESSONS.BY_UNIT_AND_NUMBER(unitNumber, lessonNumber));
          // Store lesson ID from the response
          if (result.success && result.data && result.data.lesson) {
            setCurrentLessonId(result.data.lesson.id);
          }
        } else {
          setError("Lesson ID or unit/lesson number required");
          setLoading(false);
          return;
        }

        if (result.success && result.data) {
          // Transform API data to match component expectations
          setLessonData({
            unitNumber: result.data.lesson ? result.data.lesson.unit_number : undefined,
            learningSlides: result.data.learningSlides || [],
            mcqQuestions: result.data.mcqQuestions || [],
            audioQuiz: result.data.audioQuiz || [],
            matchingTasks: result.data.matchingTasks || {}
          });
          setStartTime(Date.now());
        } else {
          setError(result.error || "Failed to load lesson");
        }
      } catch (err) {
        console.error("Error loading lesson:", err);
        setError("Failed to load lesson data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [unitNumber, lessonNumber, lessonId]);

  // Track progress when lesson is completed
  useEffect(() => {
    const trackProgress = async () => {
      if (phase === "summary" && startTime && currentLessonId) {
        const userId = getUserId();
        if (!userId) return;

        const timeSpent = Math.floor((Date.now() - startTime) / 60000); // minutes
        const matchingPairsCount = Object.values(lessonData.matchingTasks || {}).reduce((acc, group) => acc + (group.left ? group.left.length : 0), 0);
        const totalQuestions = lessonData.mcqQuestions.length + lessonData.audioQuiz.length + matchingPairsCount;

        const progressPercentage = totalQuestions > 0
          ? Math.min(100, Math.round((score / totalQuestions) * 100))
          : 100;

        try {
          await apiPost(API_ENDPOINTS.PROGRESS.UPDATE, {
            userId: parseInt(userId),
            lessonId: currentLessonId,
            progressPercentage: progressPercentage,
            completed: score === totalQuestions, // Only mark completed if perfect score
            score: score,
            timeSpent: timeSpent,
            timezoneOffset: new Date().getTimezoneOffset()
          });
        } catch (err) {
          console.error("Error tracking progress:", err);
        }
      }
    };

    trackProgress();
  }, [phase, score, currentLessonId, startTime, lessonData]);

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

  if (loading) {
    return (
      <div className="text-center mt-20 text-slate-600">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mb-4"></div>
        <p>Loading lesson...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-20 text-red-600">
        <p>{error}</p>
      </div>
    );
  }

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
        (lessonNumber >= 2 && lessonNumber <= 9) ? (
          <LessonExercise question={mcqs[index]} current={index} total={mcqs.length} onAnswer={handleAnswer} />
        ) : (
          <LessonQuiz question={mcqs[index]} current={index} total={mcqs.length} onAnswer={handleAnswer} />
        )
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
      {phase === "summary" && (
        <LessonSummary
          score={score}
          unitNumber={unitNumber || lessonData.unitNumber}
          totalPoints={
            mcqs.length +
            audioQs.length +
            Object.values(matchData).reduce((acc, group) => acc + (group.left ? group.left.length : 0), 0)
          }
        />
      )}
    </div>
  );
};

export default LessonContent;

