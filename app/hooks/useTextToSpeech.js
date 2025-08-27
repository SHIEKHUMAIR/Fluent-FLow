"use client"
import { useCallback } from "react"

export default function useTextToSpeech() {
  const speak = useCallback((text) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "zh-CN" // Mandarin Chinese
      utterance.rate = 0.8     // Slightly slower for learners
      utterance.pitch = 1
      speechSynthesis.speak(utterance)
    } else {
      console.warn("Text-to-Speech not supported in this browser.")
    }
  }, [])

  return { speak }
}
