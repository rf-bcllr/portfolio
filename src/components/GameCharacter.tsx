import { useId } from "react";
import { useCharacterQuotes } from "@/hooks/useCharacterQuotes";
import { Button } from "@/components/ui/button";
import { CharacterQuoteBubble } from "@/components/CharacterQuoteBubble";

/* Idle sprite from the game (4 frames of 105×180 at y=2), drawn at 120px tall. */
const SCALE = 120 / 180;

export function GameCharacter() {
  const quoteId = useId();
  const { quote, nextQuote, clearQuote } = useCharacterQuotes();

  return (
    <div className="relative inline-flex flex-col items-start">
      <CharacterQuoteBubble quote={quote} id={quoteId} />
      <Button
        variant="ghost"
        type="button"
        aria-label="Rafael's game character, say hi"
        aria-describedby={quote ? quoteId : undefined}
        onPointerEnter={nextQuote}
        onPointerLeave={clearQuote}
        onFocus={nextQuote}
        onBlur={clearQuote}
        onClick={nextQuote}
        className="game-char relative block cursor-pointer rounded-none p-0 hover:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        style={{
          width: 105 * SCALE,
          height: 180 * SCALE,
          backgroundImage: "url(/game/assets/player/home-sheet-blue.png)",
          backgroundSize: `${880 * SCALE}px ${475 * SCALE}px`,
          backgroundPositionY: `${-2 * SCALE}px`,
          ["--game-char-end" as string]: `${-420 * SCALE}px`,
        }}
      />
    </div>
  );
}
