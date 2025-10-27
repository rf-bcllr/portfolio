import { useState, useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";

export const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHoveringLink, setIsHoveringLink] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const targetPosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Check if device has fine pointer (desktop)
    const hasFinePo = window.matchMedia("(pointer: fine)").matches;
    if (!hasFinePo) return;

    setIsVisible(true);
    document.body.classList.add("custom-cursor-active");

    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetPosition.current = { x: e.clientX, y: e.clientY };

      // Check if hovering over link or element with data-cursor-link
      const target = e.target as HTMLElement;
      const isLink = target.closest('[data-cursor-link], a[href^="/"], a[href^="#"]');
      setIsHoveringLink(!!isLink);
    };

    const animate = () => {
      setPosition((prev) => ({
        x: lerp(prev.x, targetPosition.current.x, 0.15),
        y: lerp(prev.y, targetPosition.current.y, 0.15),
      }));
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      document.body.classList.remove("custom-cursor-active");
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor ${isHoveringLink ? "hovering-link" : ""}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <ArrowUpRight className="custom-cursor-arrow" size={20} strokeWidth={2.5} />
    </div>
  );
};
