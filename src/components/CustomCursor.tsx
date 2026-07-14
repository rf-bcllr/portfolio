import { useState, useEffect, useRef, useMemo } from "react";
import { getSessionCursorColor } from "@/lib/cursorColor";

export const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const animationFrameRef = useRef<number>();
  const targetPosition = useRef({ x: -100, y: -100 });

  // Random color per visit (stable for the session, shared with DrawingCanvas)
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
    const hasFinePo = window.matchMedia("(pointer: fine)").matches;
    if (!hasFinePo) return;

    setIsVisible(true);
    document.body.classList.add("custom-cursor-active");

    const lerp = (start: number, end: number, factor: number) =>
      start + (end - start) * factor;

    const handlePointerMove = (e: PointerEvent) => {
      targetPosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      targetPosition.current = { x: -100, y: -100 };
    };

    const handleDrawStart = () => setIsDrawing(true);
    const handleDrawEnd = () => setIsDrawing(false);

    const animate = () => {
      setPosition((prev) => ({
        x: lerp(prev.x, targetPosition.current.x, 0.22),
        y: lerp(prev.y, targetPosition.current.y, 0.22),
      }));
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("rfbcllr:draw-start", handleDrawStart);
    window.addEventListener("rfbcllr:draw-end", handleDrawEnd);
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("rfbcllr:draw-start", handleDrawStart);
      window.removeEventListener("rfbcllr:draw-end", handleDrawEnd);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      document.body.classList.remove("custom-cursor-active");
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="figjam-cursor"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      aria-hidden="true"
    >
      {/* Black arrow with white outline */}
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
          fill="#000000"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      {/* Visitor label — hidden while drawing */}
      {!isDrawing && (
        <span
          className="figjam-cursor-label"
          style={{ backgroundColor: color, color: "#FFFFFF" }}
        >
          Visitor
        </span>
      )}
    </div>
  );
};

