"use client";
import Lesson from "../lessons/Lesson";

// Legacy component - now uses API-based Lesson component
const Lesson2 = ({ selectedCategory, unitNumber, lessonNumber, lessonId }) => {
  return <Lesson selectedCategory={selectedCategory} unitNumber={unitNumber} lessonNumber={lessonNumber} lessonId={lessonId} />;
};

export default Lesson2;
