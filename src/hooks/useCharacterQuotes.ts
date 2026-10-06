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
  "Press / to chat and E to react!",
];

export function useCharacterQuotes() {
  const [index, setIndex] = useState(-1);
  const [visible, setVisible] = useState(false);
  const nextQuote = () => {
    setIndex((previous) => {
      const offset = 1 + Math.floor(Math.random() * (QUOTES.length - 1));
      return (previous + offset) % QUOTES.length;
    });
    setVisible(true);
  };
  const clearQuote = () => {
    setVisible(false);
  };
  return { quote: visible && index >= 0 ? QUOTES[index] : undefined, nextQuote, clearQuote };
}