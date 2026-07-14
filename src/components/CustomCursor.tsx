import { useState, useEffect, useRef, useMemo } from "react";
import { getSessionCursorColor } from "@/lib/cursorColor";

export const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const animationFrameRef = useRef<number>();
  const targetPosition = useRef({ x: -100, y: -100 });

  // Random color per visit (stable for the session, shared with DrawingCanvas)
  const color = useMemo(() => getSessionCursorColor(), []);

  // Pick black or white text for the colored tag based on background luminance
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

    const handleMouseMove = (e: MouseEvent) => {
      targetPosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      targetPosition.current = { x: -100, y: -100 };
    };

    const animate = () => {
      setPosition((prev) => ({
        x: lerp(prev.x, targetPosition.current.x, 0.22),
        y: lerp(prev.y, targetPosition.current.y, 0.22),
      }));
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
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
    >
      {/* Arrow pointer - neo-brutalist black arrowhead */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", filter: "drop-shadow(2px 2px 0 #000)" }}
      >
        <path
          d="M2 2L2 14L14 8L2 2Z"
          fill="#000"
          stroke="#000"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
      {/* Visitor label */}
      <span
        className="figjam-cursor-label"
        style={{ backgroundColor: color }}
      >
        Visitor
      </span>
    </div>
  );
};
