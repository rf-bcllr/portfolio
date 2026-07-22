import { useEffect, useMemo, useRef, useState } from "react";
import { Eraser } from "lucide-react";
import { getSessionCursorColor } from "@/lib/cursorColor";

const INTERACTIVE_SELECTOR = [
  "a",
  "button",
  "input",
  "textarea",
  "select",
  "option",
  "label",
  "summary",
  "details",
  "video",
  "audio",
  "iframe",
  "img",
  "picture",
  "svg",
  "canvas",
  "[onclick]",
  "[tabindex]",
  '[role="button"]',
  '[role="link"]',
  '[role="menuitem"]',
  '[role="tab"]',
  '[role="checkbox"]',
  '[role="radio"]',
  '[role="switch"]',
  '[role="option"]',
  '[role="combobox"]',
  '[role="listbox"]',
  '[role="slider"]',
  '[contenteditable="true"]',
  "[data-cursor-action]",
  "[data-cursor-link]",
  "[data-no-draw]",
  "[data-state]", // shadcn/radix interactive primitives
  "[data-radix-collection-item]",
  ".shadow-card",
].join(", ");

const isInteractiveElement = (target: EventTarget | null): boolean => {
  if (!(target instanceof Element)) return false;
  if (target.closest(INTERACTIVE_SELECTOR)) return true;
  // Walk ancestors and check computed cursor: pointer (covers custom clickable wrappers)
  let node: Element | null = target;
  let depth = 0;
  while (node && depth < 8 && node !== document.body) {
    const cursor = window.getComputedStyle(node).cursor;
    if (cursor === "pointer") return true;
    node = node.parentElement;
    depth += 1;
  }
  return false;
};

export const DrawingCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const pointsRef = useRef<{ x: number; y: number }[]>([]);
  const committedRef = useRef<ImageData | null>(null);
  const movedRef = useRef(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [hasStrokes, setHasStrokes] = useState(false);


  const color = useMemo(() => getSessionCursorColor(), []);

  // Detect desktop (fine pointer) only
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine) and (hover: hover) and (min-width: 1024px)");
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

    const isInteractive = (target: EventTarget | null) => isInteractiveElement(target);

    // (drawDot removed — a plain click no longer leaves a dot on the background.)

    const renderSmoothStroke = (pts: { x: number; y: number }[]) => {
      if (pts.length < 2) return;
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.92;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      if (pts.length === 2) {
        ctx.lineTo(pts[1].x, pts[1].y);
      } else {
        // Quadratic midpoint smoothing: perfect continuous curves
        for (let i = 1; i < pts.length - 1; i++) {
          const midX = (pts[i].x + pts[i + 1].x) / 2;
          const midY = (pts[i].y + pts[i + 1].y) / 2;
          ctx.quadraticCurveTo(pts[i].x, pts[i].y, midX, midY);
        }
        const last = pts[pts.length - 1];
        ctx.quadraticCurveTo(
          pts[pts.length - 2].x,
          pts[pts.length - 2].y,
          last.x,
          last.y
        );
      }
      ctx.stroke();
    };

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      if (isInteractive(e.target)) return;
      e.preventDefault();
      drawingRef.current = true;
      movedRef.current = false;
      pointsRef.current = [{ x: e.clientX, y: e.clientY }];
      // Snapshot current canvas so we can redraw the current stroke smoothly on each move
      committedRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    };

    const onSelectStart = (e: Event) => {
      if (drawingRef.current) e.preventDefault();
    };
    const onDragStart = (e: DragEvent) => {
      if (isInteractive(e.target)) return;
      e.preventDefault();
    };

    const onMove = (e: PointerEvent) => {
      if (!drawingRef.current) return;
      const pts = pointsRef.current;
      const last = pts[pts.length - 1];
      if (!last) return;
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      if (!movedRef.current && dx * dx + dy * dy < 4) return;
      if (movedRef.current && dx * dx + dy * dy < 2.25) return; // sample throttle
      movedRef.current = true;
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0 && !sel.isCollapsed) sel.removeAllRanges();
      pts.push({ x: e.clientX, y: e.clientY });
      // Restore snapshot, then render the whole stroke as one smooth curve
      if (committedRef.current) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.putImageData(committedRef.current, 0, 0);
        ctx.restore();
      }
      renderSmoothStroke(pts);
      if (!hasStrokes) setHasStrokes(true);
    };

    const onUp = () => {
      if (!drawingRef.current) return;
      // A plain click (no movement) should NOT drop a dot — only real strokes draw.
      drawingRef.current = false;
      movedRef.current = false;
      pointsRef.current = [];
      committedRef.current = null;
    };


    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("selectstart", onSelectStart);
    document.addEventListener("dragstart", onDragStart);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("selectstart", onSelectStart);
      document.removeEventListener("dragstart", onDragStart);
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
