import { useEffect, useMemo, useRef, useState } from "react";
import { Eraser, Pencil } from "lucide-react";
import { getSessionCursorColor } from "@/lib/cursorColor";

export const DrawingCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [armed, setArmed] = useState(false); // space held -> ready to draw
  const [hasStrokes, setHasStrokes] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const color = useMemo(() => getSessionCursorColor(), []);

  // Detect desktop (fine pointer) only
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // First-load hint
  useEffect(() => {
    if (!isDesktop) return;
    try {
      const seen = sessionStorage.getItem("rfbcllr-draw-hint");
      if (!seen) {
        setShowHint(true);
        sessionStorage.setItem("rfbcllr-draw-hint", "1");
        const t = setTimeout(() => setShowHint(false), 5000);
        return () => clearTimeout(t);
      }
    } catch {
      // ignore
    }
  }, [isDesktop]);

  // Resize canvas to viewport with DPR
  useEffect(() => {
    if (!isDesktop) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      // Preserve existing drawing on resize
      const prev = document.createElement("canvas");
      prev.width = canvas.width;
      prev.height = canvas.height;
      const pctx = prev.getContext("2d");
      if (pctx && canvas.width > 0 && canvas.height > 0) {
        pctx.drawImage(canvas, 0, 0);
      }
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        if (prev.width > 0) {
          ctx.drawImage(prev, 0, 0, prev.width / dpr, prev.height / dpr);
        }
      }
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [isDesktop]);

  // Space-to-arm
  useEffect(() => {
    if (!isDesktop) return;
    const isTypingTarget = (el: EventTarget | null) => {
      if (!(el instanceof HTMLElement)) return false;
      const tag = el.tagName;
      return (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        el.isContentEditable
      );
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code !== "Space" || e.repeat) return;
      if (isTypingTarget(e.target)) return;
      e.preventDefault();
      setArmed(true);
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      setArmed(false);
      drawingRef.current = false;
      lastPointRef.current = null;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [isDesktop]);

  // Drawing handlers
  useEffect(() => {
    if (!isDesktop || !armed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const onDown = (e: PointerEvent) => {
      drawingRef.current = true;
      lastPointRef.current = { x: e.clientX, y: e.clientY };
    };
    const onMove = (e: PointerEvent) => {
      if (!drawingRef.current) return;
      const last = lastPointRef.current;
      if (!last) return;
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.92;
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke();
      lastPointRef.current = { x: e.clientX, y: e.clientY };
      if (!hasStrokes) setHasStrokes(true);
    };
    const onUp = () => {
      drawingRef.current = false;
      lastPointRef.current = null;
    };
    canvas.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [isDesktop, armed, color, hasStrokes]);

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    setHasStrokes(false);
  };

  if (!isDesktop) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 -z-10"
        style={{
          pointerEvents: armed ? "auto" : "none",
          cursor: armed
            ? `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 22 22'><circle cx='11' cy='11' r='5' fill='${encodeURIComponent(
                color
              )}' stroke='white' stroke-width='2'/></svg>") 11 11, crosshair`
            : "auto",
        }}
        aria-hidden="true"
      />

      {/* Floating hint / control */}
      <div className="pointer-events-none fixed bottom-5 right-5 z-40 hidden flex-col items-end gap-2 md:flex">
        {(showHint || armed) && (
          <div
            className="pointer-events-none rounded-full border border-border bg-card/95 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-card backdrop-blur-xl"
            style={armed ? { borderColor: color, color } : undefined}
          >
            {armed ? "Drawing — release Space to stop" : "Hold Space to draw on the background"}
          </div>
        )}
        {hasStrokes && (
          <button
            type="button"
            onClick={clear}
            className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-border bg-card/95 px-3 py-1.5 text-xs font-semibold text-foreground shadow-card backdrop-blur-xl transition-colors hover:bg-secondary"
            aria-label="Clear drawing"
          >
            <Eraser className="size-3.5" /> Clear
          </button>
        )}
        {!hasStrokes && !showHint && !armed && (
          <div
            className="pointer-events-none inline-flex items-center gap-1.5 rounded-full border border-border bg-card/80 px-2.5 py-1 text-[11px] font-medium text-muted-foreground shadow-card backdrop-blur-xl opacity-60"
            aria-hidden="true"
          >
            <Pencil className="size-3" /> Space to draw
          </div>
        )}
      </div>
    </>
  );
};
