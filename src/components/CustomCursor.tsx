import { useState, useEffect, useRef } from "react";
import { ArrowUpRight, ChevronDown, ChevronUp, Sun, Moon, Home, ArrowLeft, Download, ArrowRight, Eye, Plus, Minus, RotateCcw, ChevronLeft, ChevronRight, X } from "lucide-react";

const friendlyMessages = [
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
  "Let's create magic! ✨"
];

export const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [cursorAction, setCursorAction] = useState<'default' | 'navigate' | 'navigate-internal' | 'scroll-up' | 'scroll-down' | 'theme-light' | 'theme-dark' | 'home' | 'back' | 'download' | 'view' | 'zoom-in' | 'zoom-out' | 'reset' | 'next' | 'prev' | 'close' | 'message'>('default');
  const [isVisible, setIsVisible] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [randomMessage, setRandomMessage] = useState('');
  const [photoPosition, setPhotoPosition] = useState<{ x: number; y: number } | null>(null);
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
      
      // Check for message action (photo hover)
      const messageElement = target.closest('[data-cursor-action="message"]') as HTMLElement;
      if (messageElement) {
        // Track photo position for dynamic border-radius
        const rect = messageElement.getBoundingClientRect();
        setPhotoPosition({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        });
        // Only update message if we're not already in message mode
        if (cursorAction !== 'message') {
          setRandomMessage(friendlyMessages[Math.floor(Math.random() * friendlyMessages.length)]);
        }
        setCursorAction('message');
        return;
      }
      
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
  }, [isClicked, cursorAction]);

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
      case 'navigate-internal':
        return <ArrowRight className="custom-cursor-icon" size={20} strokeWidth={2.5} />;
      case 'view':
        return <Eye className="custom-cursor-icon" size={20} strokeWidth={2.5} />;
      case 'zoom-in':
        return <Plus className="custom-cursor-icon" size={20} strokeWidth={2.5} />;
      case 'zoom-out':
        return <Minus className="custom-cursor-icon" size={20} strokeWidth={2.5} />;
      case 'reset':
        return <RotateCcw className="custom-cursor-icon" size={18} strokeWidth={2.5} />;
      case 'next':
        return <ChevronRight className="custom-cursor-icon" size={22} strokeWidth={2.5} />;
      case 'prev':
        return <ChevronLeft className="custom-cursor-icon" size={22} strokeWidth={2.5} />;
      case 'close':
        return <X className="custom-cursor-icon" size={20} strokeWidth={2.5} />;
      case 'message':
        return (
          <div className="custom-cursor-message">
            <span>{randomMessage}</span>
          </div>
        );
      default:
        return null;
    }
  };

  // Calculate dynamic border-radius based on cursor position relative to photo
  const getMessageBorderRadius = () => {
    if (!photoPosition) return '16px 16px 16px 4px'; // default: bottom-left points
    
    const dx = position.x - photoPosition.x;
    const dy = position.y - photoPosition.y;
    
    // Determine which quadrant the cursor is relative to the photo center
    if (dx >= 0 && dy >= 0) {
      // Cursor is below and to the right → top-left corner points to photo
      return '4px 16px 16px 16px';
    } else if (dx < 0 && dy >= 0) {
      // Cursor is below and to the left → top-right corner points to photo
      return '16px 4px 16px 16px';
    } else if (dx >= 0 && dy < 0) {
      // Cursor is above and to the right → bottom-left corner points to photo
      return '16px 16px 16px 4px';
    } else {
      // Cursor is above and to the left → bottom-right corner points to photo
      return '16px 16px 4px 16px';
    }
  };

  const cursorClass = cursorAction === 'message' 
    ? `custom-cursor message-cursor ${isClicked ? 'clicked' : ''}`
    : `custom-cursor ${cursorAction !== 'default' ? 'hovering-link' : ''} ${isClicked ? 'clicked' : ''}`;

  return (
    <div
      ref={cursorRef}
      className={cursorClass}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        borderRadius: cursorAction === 'message' ? getMessageBorderRadius() : undefined,
      }}
    >
      {renderCursorIcon()}
    </div>
  );
};
