import { useLayoutEffect, useRef, useState } from "react";

// CSS-only take on SmoothUI's Figma Comment (https://smoothui.dev/docs/components/figma-comment):
// a 32px avatar pin that springs open into a comment bubble. No motion library needed.

const CLOSED_SIZE = 32;

type FigmaCommentProps = {
  avatarSrc: string;
  authorName: string;
  message: string;
  timestamp?: string;
  open: boolean;
  /** Pin clicked (or Enter/Space). */
  onToggle: () => void;
  width?: number;
  /** Which way the bubble grows from its pin. */
  side?: "right" | "left";
  className?: string;
};

export function FigmaComment({
  avatarSrc,
  authorName,
  message,
  timestamp = "Just now",
  open,
  onToggle,
  width = 220,
  side = "right",
  className = "",
}: FigmaCommentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(CLOSED_SIZE);

  useLayoutEffect(() => {
    const measure = () => contentRef.current && setContentHeight(contentRef.current.offsetHeight);
    measure();
    document.fonts?.ready.then(measure);
  }, [message, width]);

  const growsLeft = side === "left";

  return (
    <div className={`absolute size-8 ${className}`}>
      <button
        type="button"
        aria-expanded={open}
        aria-label={`Comment from ${authorName}`}
        onClick={onToggle}
        className={`absolute bottom-0 overflow-hidden rounded-2xl bg-card text-left font-sans tracking-normal shadow-[0_0_0.5px_0_rgba(0,0,0,0.18),0_3px_8px_0_rgba(0,0,0,0.1),0_1px_3px_0_rgba(0,0,0,0.1)] outline-none transition-[width,height] duration-300 ease-[cubic-bezier(.34,1.25,.64,1)] focus-visible:ring-2 focus-visible:ring-primary ${
          growsLeft ? "right-0 rounded-br-none" : "left-0 rounded-bl-none"
        } ${open ? "" : "delay-75"}`}
        style={{ width: open ? width : CLOSED_SIZE, height: open ? contentHeight : CLOSED_SIZE }}
      >
        <img
          src={avatarSrc}
          alt=""
          className="absolute z-10 size-6 rounded-full object-cover transition-[top,left,right] duration-300 ease-[cubic-bezier(.34,1.25,.64,1)]"
          style={growsLeft ? { right: open ? width - 36 : 4, top: open ? 12 : 4 } : { left: open ? 12 : 4, top: open ? 12 : 4 }}
        />
        <div
          ref={contentRef}
          aria-hidden={!open}
          className="absolute top-0 flex flex-col items-start gap-0.5 py-3 pl-11 pr-4 transition-[opacity,filter] duration-300 ease-[cubic-bezier(.22,1,.36,1)]"
          style={{
            width,
            [growsLeft ? "right" : "left"]: 0,
            opacity: open ? 1 : 0,
            filter: open ? "blur(0px)" : "blur(6px)",
            transitionDelay: open ? "150ms" : "0ms",
          }}
        >
          <p className="flex items-start gap-1 text-[11px] leading-4">
            <span className="font-bold text-foreground">{authorName}</span>
            <span className="font-medium text-muted-foreground">{timestamp}</span>
          </p>
          <p className="text-[11px] font-medium leading-4 text-foreground">{message}</p>
        </div>
      </button>
    </div>
  );
}
