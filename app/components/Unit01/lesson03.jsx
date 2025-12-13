"use client";
import Lesson from "../lessons/Lesson";

// Legacy component - now uses API-based Lesson component
const Lesson3 = ({ selectedCategory, unitNumber, lessonNumber, lessonId }) => {
  return <Lesson selectedCategory={selectedCategory || "lesson3"} unitNumber={unitNumber || 1} lessonNumber={lessonNumber || 3} lessonId={lessonId} />;
};

export default Lesson3;
