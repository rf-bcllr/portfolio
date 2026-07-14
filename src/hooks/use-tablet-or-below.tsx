import * as React from "react";

// Returns true when viewport is <= 1023px (mobile + tablet).
export function useIsTabletOrBelow() {
  const [match, setMatch] = React.useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 1023px)").matches;
  });

  React.useEffect(() => {
    const mql = window.matchMedia("(max-width: 1023px)");
    const onChange = (e: MediaQueryListEvent) => setMatch(e.matches);
    mql.addEventListener("change", onChange);
    setMatch(mql.matches);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return match;
}
