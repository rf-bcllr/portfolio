import { useState, useEffect, useRef } from 'react';

interface ParallaxOptions {
  speed?: number; // Parallax speed multiplier (0 = no movement, 1 = same as scroll, 0.5 = half speed)
  direction?: 'up' | 'down'; // Direction of parallax movement
  disabled?: boolean; // Disable parallax on mobile/tablet
}

export const useParallax = (options: ParallaxOptions = {}) => {
  const { speed = 0.5, direction = 'up', disabled = false } = options;
  const [offset, setOffset] = useState(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    if (disabled) return;

    const handleScroll = () => {
      // Cancel previous frame
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      // Schedule new frame
      rafRef.current = requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        const movement = scrolled * speed * (direction === 'down' ? 1 : -1);
        setOffset(movement);
      });
    };

    // Initial calculation
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [speed, direction, disabled]);

  return offset;
};

// Hook for multiple parallax layers with different speeds
export const useParallaxLayers = (layers: ParallaxOptions[] = []) => {
  const offsets = layers.map(options => useParallax(options));
  return offsets;
};
