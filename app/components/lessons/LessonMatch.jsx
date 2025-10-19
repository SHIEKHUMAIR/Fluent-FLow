"use client";
import { useState, useEffect } from "react";

export default function LessonMatch({ groups, setPhase }) {
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
  const [matched, setMatched] = useState([]);

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
      if (pair) {
        setMatched(prev => [...prev, selectedLeft.id]);
        setSelectedLeft(null);

        // Auto move to next half when done
        if (matched.length + 1 === leftItems.length) {
          setTimeout(() => {
            if (currentSet === 1 && secondHalf.length > 0) {
              setCurrentSet(2);
              setLeftItems(secondHalf.map(p => p.left));
              setRightItems(shuffle(secondHalf.map(p => p.right)));
              setMatched([]);
            } else {
              setPhase("summary");
            }
          }, 700);
        }
      } else {
        setSelectedLeft(null);
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-8 mt-6 text-center w-full max-w-3xl">
      <h2 className="text-2xl font-semibold text-slate-900 mb-6">
        {currentSet === 1 ? "Match the first set" : "Match the second set"}
      </h2>

      <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
        {/* Left Column */}
        <div className="space-y-3">
          {leftItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleSelect("left", item)}
              disabled={matched.includes(item.id)}
              className={`w-full py-3 rounded-xl border font-semibold transition-all ${
                matched.includes(item.id)
                  ? "bg-green-100 border-green-300 text-green-800"
                  : selectedLeft?.id === item.id
                  ? "bg-blue-50 border-blue-400"
                  : "bg-white hover:bg-slate-50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          {rightItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleSelect("right", item)}
              disabled={matched.includes(item.id)}
              className={`w-full py-3 rounded-xl border font-semibold transition-all ${
                matched.includes(item.id)
                  ? "bg-green-100 border-green-300 text-green-800"
                  : "bg-white hover:bg-slate-50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
