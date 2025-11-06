export const smoothScrollToElement = (
  elementId: string,
  offset: number = 80, // Default offset for sticky header
  duration: number = 800 // Animation duration in ms
) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const startPosition = window.pageYOffset;
  const targetPosition = element.getBoundingClientRect().top + startPosition - offset;
  const distance = targetPosition - startPosition;
  let startTime: number | null = null;

  // Easing function for smooth animation (easeInOutCubic)
  const easeInOutCubic = (t: number): number => {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const animation = (currentTime: number) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const ease = easeInOutCubic(progress);

    window.scrollTo(0, startPosition + distance * ease);

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  };

  requestAnimationFrame(animation);
};
