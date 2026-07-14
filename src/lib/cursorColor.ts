// FigJam-style cursor colors shared between CustomCursor and DrawingCanvas
export const CURSOR_COLORS = [
  "#F24822", // red
  "#FFA629", // orange
  "#FFCD29", // yellow
  "#14AE5C", // green
  "#0D99FF", // blue
  "#9747FF", // purple
  "#E91E63", // pink
  "#00B8D9", // cyan
  "#B8860B", // gold
  "#8B5CF6", // violet
];

// Module-level cache: shared between CustomCursor and DrawingCanvas within the
// same page load, but re-rolled on every reload (unlike sessionStorage, which
// persisted the same color across reloads and made the palette feel static).
let cachedColor: string | null = null;

export const getSessionCursorColor = (): string => {
  if (cachedColor) return cachedColor;
  cachedColor = CURSOR_COLORS[Math.floor(Math.random() * CURSOR_COLORS.length)];
  return cachedColor;
};
