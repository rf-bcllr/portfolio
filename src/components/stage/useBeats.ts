import { useEffect, useState } from "react";

/** Steps through timed phases in a loop; holds a meaningful still phase under reduced motion. */
export function useBeats<T extends string>(beats: readonly (readonly [T, number])[], still: T): T {
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (reduced) return;
    const timer = window.setTimeout(() => setIndex((v) => (v + 1) % beats.length), beats[index][1]);
    return () => window.clearTimeout(timer);
  }, [index, reduced, beats]);
  return reduced ? still : beats[index][0];
}

/** Progressive typing for a phase window: returns the visible slice of text. */
export function useTyped(text: string, active: boolean, done: boolean, speed = 70): string {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) { setN(done ? text.length : 0); return; }
    setN(0);
    const id = window.setInterval(() => setN((v) => (v >= text.length ? v : v + 1)), speed);
    return () => window.clearInterval(id);
  }, [active, done, text, speed]);
  return text.slice(0, n);
}
