import { useEffect, useState } from "react";

const BASE_QUOTES = [
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

/* Keyboard-only hint: {…} tokens are rendered as keycaps in the bubble. */
const HINT_QUOTE = "Press {/} to chat and {E} to react!";

/* Desktop = same breakpoint where the site keeps its full nav (≥1024px). */
const DESKTOP_QUERY = "(min-width: 1024px)";

function matchesDesktop() {
  return typeof window !== "undefined" && window.matchMedia(DESKTOP_QUERY).matches;
}

export function useCharacterQuotes() {
  const [desktop, setDesktop] = useState(matchesDesktop);
  const [index, setIndex] = useState(-1);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const onChange = () => setDesktop(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const quotes = desktop ? [...BASE_QUOTES, HINT_QUOTE] : BASE_QUOTES;

  const nextQuote = () => {
    setIndex((previous) => {
      const offset = 1 + Math.floor(Math.random() * (quotes.length - 1));
      return (previous + offset) % quotes.length;
    });
    setVisible(true);
  };
  const clearQuote = () => {
    setVisible(false);
  };
  const current = visible && index >= 0 ? quotes[index % quotes.length] : undefined;
  return { quote: current, nextQuote, clearQuote };
}
