import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

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

/* Idle sprite from the game (4 frames of 105×180 at y=2), drawn at 120px tall. */
const SCALE = 120 / 180;

export function GameCharacter() {
  const navigate = useNavigate();
  const ref = useRef<HTMLButtonElement>(null);
  const [quote, setQuote] = useState(-1);
  const [focused, setFocused] = useState(false);

  const nextQuote = () => {
    setQuote((current) => {
      const next = (current + 1) % QUOTES.length;
      window.dispatchEvent(new CustomEvent("game-character-quote", { detail: QUOTES[next] }));
      return next;
    });
  };

  const show = quote >= 0 && focused;

  return (
    <div className="relative inline-flex flex-col items-start">
      <button
        ref={ref}
        type="button"
        aria-label="Rafael's game character, say hi"
        aria-describedby={show ? "game-char-quote" : undefined}
        onPointerEnter={nextQuote}
        onPointerLeave={() => window.dispatchEvent(new CustomEvent("game-character-quote", { detail: null }))}
        onFocus={() => { setFocused(true); nextQuote(); }}
        onBlur={() => setFocused(false)}
        onClick={() => navigate("/play")}
        className="game-char relative block cursor-pointer rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        style={{
          width: 105 * SCALE,
          height: 180 * SCALE,
          backgroundImage: "url(/game/assets/player/home-sheet-blue.png)",
          backgroundSize: `${880 * SCALE}px ${475 * SCALE}px`,
          backgroundPositionY: `${-2 * SCALE}px`,
          ["--game-char-end" as string]: `${-420 * SCALE}px`,
        }}
      >
        {show && (
          <span
            id="game-char-quote"
            role="status"
            className="pointer-events-none absolute z-20 w-max max-w-[260px] rounded-[18px] rounded-tl-none px-3.5 py-2 text-left text-sm font-medium leading-snug shadow-[3px_3px_0_0_hsl(var(--foreground))]"
            style={{
              left: 58,
              top: 8,
              backgroundColor: "var(--session-cursor, hsl(var(--primary)))",
              color: "var(--session-cursor-foreground, hsl(var(--primary-foreground)))",
            }}
          >
            {QUOTES[quote]}
          </span>
        )}
      </button>
    </div>
  );
}
