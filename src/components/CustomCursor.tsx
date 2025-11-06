import { useState, useEffect, useRef } from "react";
import { ArrowUpRight, ChevronDown, ChevronUp, Sun, Moon, Home, ArrowLeft, Download } from "lucide-react";

export const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [cursorAction, setCursorAction] = useState<'default' | 'navigate' | 'scroll-up' | 'scroll-down' | 'theme-light' | 'theme-dark' | 'home' | 'back' | 'download'>('default');
  const [isVisible, setIsVisible] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
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

      // If cursor was just clicked, don't update action yet
      if (isClicked) return;

      const target = e.target as HTMLElement;
      
      // Check for theme toggle - special case
      const themeButton = target.closest('[data-cursor-action="theme-toggle"]') as HTMLElement;
      if (themeButton) {
        const currentTheme = themeButton.getAttribute('data-theme');
        setCursorAction(currentTheme === 'dark' ? 'theme-light' : 'theme-dark');
        return;
      }
      
      // Check for specific action type
      const actionElement = target.closest('[data-cursor-action]') as HTMLElement;
      if (actionElement) {
        const action = actionElement.getAttribute('data-cursor-action') as typeof cursorAction;
        setCursorAction(action || 'navigate');
        return;
      }
      
      // Check for general links/buttons (navigation)
      const isInteractive = target.closest('a[href], button, [role="button"]');
      if (isInteractive) {
        setCursorAction('navigate');
        return;
      }
      
      // Default state
      setCursorAction('default');
    };

    const animate = () => {
      setPosition((prev) => ({
        x: lerp(prev.x, targetPosition.current.x, 0.15),
        y: lerp(prev.y, targetPosition.current.y, 0.15),
      }));
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const handleClick = () => {
      // Reset cursor to default immediately
      setCursorAction('default');
      setIsClicked(true);
      
      // After a brief moment, allow cursor to update again based on hover
      setTimeout(() => {
        setIsClicked(false);
      }, 150);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      document.body.classList.remove("custom-cursor-active");
    };
  }, [isClicked]);

  if (!isVisible) return null;

  const renderCursorIcon = () => {
    switch (cursorAction) {
      case 'home':
        return <Home className="custom-cursor-icon" size={18} strokeWidth={2} />;
      case 'back':
        return <ArrowLeft className="custom-cursor-icon" size={20} strokeWidth={2.5} />;
      case 'download':
        return <Download className="custom-cursor-icon" size={20} strokeWidth={2.5} />;
      case 'scroll-down':
        return <ChevronDown className="custom-cursor-icon" size={24} strokeWidth={2.5} />;
      case 'scroll-up':
        return <ChevronUp className="custom-cursor-icon" size={24} strokeWidth={2.5} />;
      case 'theme-light':
        return <Sun className="custom-cursor-icon" size={22} strokeWidth={2.5} />;
      case 'theme-dark':
        return <Moon className="custom-cursor-icon" size={22} strokeWidth={2.5} />;
      case 'navigate':
        return <ArrowUpRight className="custom-cursor-icon" size={20} strokeWidth={2.5} />;
      default:
        return null;
    }
  };

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor ${cursorAction !== 'default' ? 'hovering-link' : ''} ${isClicked ? 'clicked' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {renderCursorIcon()}
    </div>
  );
};
