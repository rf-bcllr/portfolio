import { useEffect, useMemo, useRef, useState } from "react";
import { Eraser } from "lucide-react";
import { getSessionCursorColor } from "@/lib/cursorColor";

const INTERACTIVE_SELECTOR =
  'a, button, input, textarea, select, label, [role="button"], [role="link"], [data-cursor-action], [data-cursor-link], [data-no-draw], .shadow-card';

export const DrawingCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const movedRef = useRef(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [hasStrokes, setHasStrokes] = useState(false);

  const color = useMemo(() => getSessionCursorColor(), []);

  // Detect desktop (fine pointer) only
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Resize canvas to viewport with DPR; preserve drawing on resize
  useEffect(() => {
    if (!isDesktop) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
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

  // Global drawing handlers — works anywhere the user is not clicking an interactive element
  useEffect(() => {
    if (!isDesktop) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isInteractive = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return false;
      return !!target.closest(INTERACTIVE_SELECTOR);
    };

    const drawDot = (x: number, y: number) => {
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.92;
      ctx.beginPath();
      ctx.arc(x, y, 2.2, 0, Math.PI * 2);
      ctx.fill();
    };

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      if (isInteractive(e.target)) return;
      drawingRef.current = true;
      movedRef.current = false;
      lastPointRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMove = (e: PointerEvent) => {
      if (!drawingRef.current) return;
      const last = lastPointRef.current;
      if (!last) return;
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      if (!movedRef.current && dx * dx + dy * dy < 4) return; // ignore tiny jitter
      movedRef.current = true;
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

    const onUp = (e: PointerEvent) => {
      if (!drawingRef.current) return;
      // No drag → leave a dot at the click location
      if (!movedRef.current) {
        drawDot(e.clientX, e.clientY);
        if (!hasStrokes) setHasStrokes(true);
      }
      drawingRef.current = false;
      movedRef.current = false;
      lastPointRef.current = null;
    };

    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [isDesktop, color, hasStrokes]);

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
        className="pointer-events-none fixed inset-0 -z-10"
        aria-hidden="true"
      />
      {hasStrokes && (
        <button
          type="button"
          onClick={clear}
          className="fixed bottom-5 right-5 z-40 hidden items-center gap-1.5 rounded-full border border-border bg-card/95 px-3 py-1.5 text-xs font-semibold text-foreground shadow-card backdrop-blur-xl transition-colors hover:bg-secondary md:inline-flex"
          aria-label="Clear drawing"
        >
          <Eraser className="size-3.5" /> Clear drawing
        </button>
      )}
    </>
  );
};
