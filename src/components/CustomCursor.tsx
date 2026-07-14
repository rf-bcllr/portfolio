import { useEffect, useRef, useState, useMemo } from "react";
import { getSessionCursorColor } from "@/lib/cursorColor";

export const CustomCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const targetRef = useRef({ x: -100, y: -100 });
  const currentRef = useRef({ x: -100, y: -100 });
  const hasSeenPointerRef = useRef(false);

  const color = useMemo(() => getSessionCursorColor(), []);

  const tagFg = useMemo(() => {
    const hex = color.replace("#", "");
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6 ? "#000000" : "#FFFFFF";
  }, [color]);

  useEffect(() => {
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!hasFinePointer) return;

    setIsVisible(true);
    document.body.classList.add("custom-cursor-active");

    const handlePointerMove = (e: PointerEvent) => {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;
      if (!hasSeenPointerRef.current) {
        // Snap on first sighting so the cursor doesn't fly in from -100/-100.
        currentRef.current.x = e.clientX;
        currentRef.current.y = e.clientY;
        hasSeenPointerRef.current = true;
      }
    };

    const handleMouseLeave = () => {
      targetRef.current.x = -100;
      targetRef.current.y = -100;
    };

    const animate = () => {
      const factor = 0.35;
      const cur = currentRef.current;
      const tgt = targetRef.current;
      const dx = tgt.x - cur.x;
      const dy = tgt.y - cur.y;
      // Snap when arbitrarily close to avoid infinite sub-pixel drift.
      cur.x = Math.abs(dx) < 0.05 ? tgt.x : cur.x + dx * factor;
      cur.y = Math.abs(dy) < 0.05 ? tgt.y : cur.y + dy * factor;

      const el = containerRef.current;
      if (el) {
        // translate3d = single GPU-composited transform for both arrow + tag,
        // so they always stay pixel-locked together. No React re-render per frame.
        el.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0)`;
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      document.body.classList.remove("custom-cursor-active");
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div ref={containerRef} className="figjam-cursor">
      <svg
        width="24"
        height="26"
        viewBox="0 0 20 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block" }}
      >
        <path
          d="M3 2.5L3 17.5L7.5 13.5L10.5 20L13.5 18.5L10.5 12L16.5 12L3 2.5Z"
          fill={color}
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className="figjam-cursor-label"
        style={{ backgroundColor: color, color: tagFg }}
      >
        Visitor
      </span>
    </div>
  );
};
