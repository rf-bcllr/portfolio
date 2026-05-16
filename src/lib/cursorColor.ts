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

const STORAGE_KEY = "rfbcllr-cursor-color";

export const getSessionCursorColor = (): string => {
  if (typeof window === "undefined") return CURSOR_COLORS[0];
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored && CURSOR_COLORS.includes(stored)) return stored;
  } catch {
    // ignore
  }
  const picked = CURSOR_COLORS[Math.floor(Math.random() * CURSOR_COLORS.length)];
  try {
    sessionStorage.setItem(STORAGE_KEY, picked);
  } catch {
    // ignore
  }
  return picked;
};
