import { useState, useEffect, useRef } from 'react';
import bustSpriteSheet from '@/assets/bust-sprite-sheet.png';

interface Interactive3DBustProps {
  size?: number;
  className?: string;
}

export const Interactive3DBust = ({ size = 160, className = '' }: Interactive3DBustProps) => {
  const [currentAngle, setCurrentAngle] = useState(0); // 0: front, 1: right, 2: left, 3: far-right
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate relative position from center of bust
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      // Determine which angle to show based on mouse position
      // Using horizontal position primarily, with some vertical influence
      const normalizedX = deltaX / (window.innerWidth / 2);

      // Sprite sheet layout:
      // Top-left (0,0): Front view - looking at camera
      // Top-right (1,0): Looking right (45°)
      // Bottom-left (0,1): Looking left (45°)
      // Bottom-right (1,1): Looking far right (profile)

      if (normalizedX < -0.3) {
        // Mouse is far left - bust looks left
        setCurrentAngle(2); // bottom-left
      } else if (normalizedX > 0.5) {
        // Mouse is far right - bust looks far right
        setCurrentAngle(3); // bottom-right (profile)
      } else if (normalizedX > 0.15) {
        // Mouse is right - bust looks right
        setCurrentAngle(1); // top-right
      } else {
        // Mouse is center - front view
        setCurrentAngle(0); // top-left (front)
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Calculate background position based on current angle
  // Sprite sheet is 2x2 grid
  const getBackgroundPosition = () => {
    switch (currentAngle) {
      case 0: return '0% 0%';      // Top-left: front
      case 1: return '100% 0%';    // Top-right: right
      case 2: return '0% 100%';    // Bottom-left: left
      case 3: return '100% 100%';  // Bottom-right: far right
      default: return '0% 0%';
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative rounded-full overflow-hidden border-2 border-border ${className}`}
      style={{
        width: size,
        height: size,
        boxShadow: 'var(--shadow-elegant)',
      }}
    >
      <div
        className="absolute inset-0 transition-all duration-150 ease-out"
        style={{
          backgroundImage: `url(${bustSpriteSheet})`,
          backgroundSize: '200% 200%',
          backgroundPosition: getBackgroundPosition(),
          // Offset to center the head in each sprite
          transform: 'scale(1.3) translateY(8%)',
        }}
      />
    </div>
  );
};
