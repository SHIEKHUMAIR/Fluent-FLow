"use client";
import { useState, useEffect } from "react";

export default function LessonMatch({ groups, setPhase, setScore }) {
  // Flatten all group data into a single array
  const allPairs = Object.values(groups)
    .flatMap(group =>
      group.left.map((leftItem, i) => ({
        left: leftItem,
        right: group.right[i],
      }))
    );

  // Split into 2 halves
  const midpoint = Math.ceil(allPairs.length / 2);
  const firstHalf = allPairs.slice(0, midpoint);
  const secondHalf = allPairs.slice(midpoint);

  // Track current set (1 or 2)
  const [currentSet, setCurrentSet] = useState(1);
  const [leftItems, setLeftItems] = useState(firstHalf.map(p => p.left));
  const [rightItems, setRightItems] = useState(
    shuffle(firstHalf.map(p => p.right))
  );
  const [selectedLeft, setSelectedLeft] = useState(null);

  const [correctMatches, setCorrectMatches] = useState([]); // Array of Left IDs
  const [failedMatches, setFailedMatches] = useState([]);   // Array of Left IDs

  // Helper: shuffle array
  function shuffle(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
  }

  // Handle matching logic
  const handleSelect = (side, item) => {
    if (side === "left") {
      setSelectedLeft(item);
    } else if (selectedLeft) {
      const pair = allPairs.find(
        p => p.left.id === selectedLeft.id && p.right.id === item.id
      );

      const totalProcessed = correctMatches.length + failedMatches.length + 1;

      if (pair) {
        // Correct Match
        setCorrectMatches(prev => [...prev, selectedLeft.id]);
        setScore(prev => prev + 1);
      } else {
        // Wrong Match
        // Find the correct partner for the selected left item to mark it red
        // No score increase, but mark as processed (failed)
        setFailedMatches(prev => [...prev, selectedLeft.id]);
      }

      setSelectedLeft(null);

      // Auto move to next half when all left items are processed (correct or failed)
      if (totalProcessed === leftItems.length) {
        setTimeout(() => {
          if (currentSet === 1 && secondHalf.length > 0) {
            setCurrentSet(2);
            setLeftItems(secondHalf.map(p => p.left));
            setRightItems(shuffle(secondHalf.map(p => p.right)));
            setCorrectMatches([]);
            setFailedMatches([]);
          } else {
            setPhase("summary");
          }
        }, 1000); // 1s delay to see the result
      }
    }
  };

  // Helper to check status
  const getLeftStatus = (id) => {
    if (correctMatches.includes(id)) return "correct";
    if (failedMatches.includes(id)) return "failed";
    if (selectedLeft?.id === id) return "selected";
    return "default";
  };

  const getRightStatus = (id) => {
    // Find the left partner for this right item
    const pair = allPairs.find(p => p.right.id === id);
    if (!pair) return "default";

    if (correctMatches.includes(pair.left.id)) return "correct";
    if (failedMatches.includes(pair.left.id)) return "failed";
    return "default";
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-8 mt-6 text-center w-full max-w-3xl">
      <h2 className="text-2xl font-semibold text-slate-900 mb-6">
        {currentSet === 1 ? "Match the first set" : "Match the second set"}
      </h2>

      <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
        {/* Left Column */}
        <div className="space-y-3">
          {leftItems.map(item => {
            const status = getLeftStatus(item.id);
            return (
              <button
                key={item.id}
                onClick={() => handleSelect("left", item)}
                disabled={status === "correct" || status === "failed"}
                className={`w-full py-3 rounded-xl border font-semibold transition-all ${status === "correct"
                  ? "bg-emerald-500 text-white border-emerald-500"
                  : status === "failed"
                    ? "bg-red-500 text-white border-red-500"
                    : status === "selected"
                      ? "bg-blue-50 border-blue-400"
                      : "bg-white hover:bg-slate-50"
                  }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          {rightItems.map(item => {
            const status = getRightStatus(item.id);
            return (
              <button
                key={item.id}
                onClick={() => handleSelect("right", item)}
                disabled={status === "correct" || status === "failed"}
                className={`w-full py-3 rounded-xl border font-semibold transition-all ${status === "correct"
                  ? "bg-emerald-500 text-white border-emerald-500"
                  : status === "failed"
                    ? "bg-red-500 text-white border-red-500"
                    : "bg-white hover:bg-slate-50"
                  }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
