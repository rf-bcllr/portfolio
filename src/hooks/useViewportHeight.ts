import { useState, useEffect } from 'react';

export type ViewportCategory = 'short' | 'medium' | 'tall';

interface ViewportHeightResult {
  height: number;
  category: ViewportCategory;
}

/**
 * Hook that detects viewport height and categorizes it for adaptive layouts.
 * - short: < 600px (iPhone SE, compact devices)
 * - medium: 600-750px (most Android devices)
 * - tall: > 750px (iPhone Pro Max, large devices)
 * 
 * Also sets a CSS custom property --viewport-category for CSS-based adaptations.
 */
export function useViewportHeight(): ViewportHeightResult {
  const [viewportData, setViewportData] = useState<ViewportHeightResult>(() => {
    if (typeof window === 'undefined') {
      return { height: 800, category: 'tall' };
    }
    return getViewportData();
  });

  useEffect(() => {
    function handleResize() {
      const data = getViewportData();
      setViewportData(data);
      
      // Update CSS custom property for CSS-based adaptations
      document.documentElement.style.setProperty('--viewport-category', data.category);
      document.documentElement.dataset.viewportCategory = data.category;
    }

    // Initial set
    handleResize();

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return viewportData;
}

function getViewportData(): ViewportHeightResult {
  const height = window.innerHeight;
  let category: ViewportCategory;

  if (height < 600) {
    category = 'short';
  } else if (height <= 750) {
    category = 'medium';
  } else {
    category = 'tall';
  }

  return { height, category };
}
