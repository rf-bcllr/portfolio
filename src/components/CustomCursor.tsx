import { useState, useEffect, useRef, useMemo } from "react";
import { getSessionCursorColor } from "@/lib/cursorColor";

export const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const animationFrameRef = useRef<number>();
  const targetPosition = useRef({ x: -100, y: -100 });

  // Random color per visit (stable for the session, shared with DrawingCanvas)
  const color = useMemo(() => getSessionCursorColor(), []);

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
      {/* Arrow pointer */}
      <svg
        width="20"
        height="22"
        viewBox="0 0 20 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block" }}
      >
        <path
          d="M3 2.5L3 17.5L7.5 13.5L10.5 20L13.5 18.5L10.5 12L16.5 12L3 2.5Z"
          fill={color}
          stroke="white"
          strokeWidth="1.2"
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
