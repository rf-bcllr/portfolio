import { useState } from "react";

const QUOTES = [
  "How are you doing?",
  "Let's talk?",
  "Let's make products!",
  "Let's connect on LinkedIn :)",
  "Need a designer?",
  "Coffee chat? ☕",
  "Let's build something!",
  "Say hi! 👋",
  "Open to new adventures!",
  "Ready to collaborate?",
  "What's on your mind?",
  "Let's create magic! ✨",
];

export function useCharacterQuotes() {
  const [index, setIndex] = useState(-1);
  const nextQuote = () => {
    const next = (index + 1) % QUOTES.length;
    setIndex(next);
    window.dispatchEvent(new CustomEvent("game-character-quote", { detail: QUOTES[next] }));
  };
  const clearQuote = () => {
    window.dispatchEvent(new CustomEvent("game-character-quote", { detail: null }));
  };
  return { quote: index >= 0 ? QUOTES[index] : undefined, nextQuote, clearQuote };
}