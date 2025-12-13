"use client";
import LessonContent from "./LessonContent";

// General lesson component that works for all units
// Automatically determines unit number based on lesson number if not provided
const Lesson = ({ selectedCategory, unitNumber, lessonNumber, lessonId }) => {
  // Extract lesson number from selectedCategory if not provided
  const lessonNum = lessonNumber || (selectedCategory ? parseInt(selectedCategory.replace("lesson", "")) : 1);
  
  // Determine unit number based on lesson number if not provided
  let unitNum = unitNumber;
  if (!unitNum && lessonNum !== undefined) {
    if (lessonNum >= 0 && lessonNum <= 9) {
      unitNum = 1;
    } else if (lessonNum >= 10 && lessonNum <= 17) {
      unitNum = 2;
    } else if (lessonNum >= 18 && lessonNum <= 25) {
      unitNum = 3;
    } else {
      unitNum = 1; // Default fallback
    }
  }

  return <LessonContent unitNumber={unitNum} lessonNumber={lessonNum} lessonId={lessonId} />;
};

export default Lesson;

