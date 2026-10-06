import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from "react";

export type TitleVariant = { lead: string; name?: string };

// Ordered from longest to shortest. The box shows the longest one that fits.
const DEFAULT_VARIANTS: TitleVariant[] = [
  { lead: "Hi! My name is", name: "Rafael Bacellar" },
  { lead: "Hi! My name is", name: "Rafael" },
  { lead: "Hi! My name is", name: "Rafa" },
  { lead: "Hello!" },
  { lead: "Hi!" },
];

const MOBILE_QUERY = "(max-width: 639px)";
const MOBILE_MAX_FONT = 44; // px. On mobile the font grows until the longest mobile phrase fills the row.
const MOBILE_MIN_FONT = 26; // px. If the longest mobile phrase only fits below this, start one phrase shorter.
const MEASURE_FONT = 100; // px. Phrases are measured at this size and scaled.
const TRACKING = "-0.045em"; // re-declared on the measurer so it scales with MEASURE_FONT
const PAD_EM = 0.32; // horizontal padding inside the box, relative to font size
const STRETCH = 72; // extra room the box can grow past the longest phrase (px)

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
const phrase = (v: TitleVariant) => [v.lead, v.name].filter(Boolean).join(" ");

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

function VariantText({ variant }: { variant: TitleVariant }) {
  return (
    <>
      {/* "Hi!" alone turns blue, like the name does in the longer phrases */}
      <span className={variant.name ? undefined : "text-primary"}>{variant.lead}</span>
      {variant.name ? (
        <>
          {" "}
          <span className="text-primary">{variant.name}</span>
        </>
      ) : null}{" "}
      <span className="hero-wave" aria-hidden="true">
        👋🏾
      </span>
    </>
  );
}

type ResizableTitleProps = {
  variants?: TitleVariant[];
  /** Phrases used below 640px. Defaults to every variant except the longest one (no "Bacellar"). Very small screens also skip the first of these. */
  mobileVariants?: TitleVariant[];
  className?: string;
};

export function ResizableTitle({ variants = DEFAULT_VARIANTS, mobileVariants, className = "" }: ResizableTitleProps) {
  const isMobile = useMediaQuery(MOBILE_QUERY);
  // Every phrase that may be shown at this breakpoint; on mobile, very small screens drop the first one.
  const candidates = isMobile ? mobileVariants ?? variants.slice(1) : variants;

  const rowRef = useRef<HTMLDivElement>(null);
  const measureRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const drag = useRef<{ x: number; w: number; dir: 1 | -1 } | null>(null);

  const [ratios, setRatios] = useState<number[]>([]); // phrase width ÷ font size
  const [available, setAvailable] = useState(0);
  const [cssFont, setCssFont] = useState(0);
  const [userWidth, setUserWidth] = useState<number | null>(null); // null = hug the longest phrase that fits

  const measure = useCallback(() => {
    setRatios(measureRefs.current.slice(0, candidates.length).map((el) => (el ? el.getBoundingClientRect().width / MEASURE_FONT : 0)));
    if (rowRef.current) {
      setAvailable(rowRef.current.clientWidth);
      setCssFont(parseFloat(getComputedStyle(rowRef.current).fontSize));
    }
  }, [candidates.length]);

  useLayoutEffect(() => {
    measure();
    document.fonts?.ready.then(measure);
    const ro = new ResizeObserver(measure);
    if (rowRef.current) ro.observe(rowRef.current);
    return () => ro.disconnect();
  }, [measure, isMobile]);

  useEffect(() => setUserWidth(null), [isMobile]);

  const ready = ratios.length === candidates.length && available > 0 && cssFont > 0;

  // Mobile: size the font so the longest mobile phrase exactly fills the row.
  const fillFont = (i: number) => available / (ratios[i] + PAD_EM * 2);
  const start = ready && isMobile && fillFont(0) < MOBILE_MIN_FONT ? 1 : 0;
  const list = candidates.slice(start);
  const mobileFont = ready && isMobile ? Math.floor(Math.min(MOBILE_MAX_FONT, fillFont(start))) : null;
  const fontSize = mobileFont ?? cssFont;
  const textWidths = ratios.slice(start).map((r) => r * fontSize);

  const PAD_X = Math.round(fontSize * PAD_EM);
  const fits = (i: number, w: number) => textWidths[i] + PAD_X * 2 <= w + 0.5;
  const minW = ready ? Math.min(Math.ceil(textWidths[list.length - 1]) + PAD_X * 2, available) : 0;
  const maxW = ready ? Math.min(Math.ceil(textWidths[0]) + PAD_X * 2 + STRETCH, available) : 0;
  const hugIndex = ready ? Math.max(0, list.findIndex((_, i) => fits(i, available))) : 0;
  const hugW = ready ? Math.ceil(textWidths[hugIndex]) + PAD_X * 2 : 0;
  const width = ready ? clamp(userWidth ?? hugW, minW, maxW) : 0;
  const found = ready ? list.findIndex((_, i) => fits(i, width)) : 0;
  const index = found === -1 ? list.length - 1 : found;
  const current = list[index];

  const startDrag = (dir: 1 | -1) => (e: ReactPointerEvent<HTMLElement>) => {
    if (!ready) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, w: width, dir };
  };
  const moveDrag = (e: ReactPointerEvent<HTMLElement>) => {
    if (!drag.current) return;
    // The box is centered, so it grows on both sides: double the pointer delta.
    const delta = (e.clientX - drag.current.x) * drag.current.dir * 2;
    setUserWidth(clamp(drag.current.w + delta, minW, maxW));
  };
  const endDrag = () => {
    drag.current = null;
  };

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    // Arrow keys step through the phrases, snapping the box to each one.
    const snap = (i: number) => Math.ceil(textWidths[i]) + PAD_X * 2;
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") next = index > 0 ? snap(index - 1) : maxW;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = snap(Math.min(index + 1, list.length - 1));
    if (e.key === "Home") next = minW;
    if (e.key === "End") next = maxW;
    if (next === null) return;
    e.preventDefault();
    setUserWidth(clamp(next, minW, maxW));
  };

  const handleProps = (dir: 1 | -1) => ({
    onPointerDown: startDrag(dir),
    onPointerMove: moveDrag,
    onPointerUp: endDrag,
    onPointerCancel: endDrag,
  });

  return (
    <div
      ref={rowRef}
      className={`relative flex w-full justify-center font-display text-[30px] font-bold leading-none text-foreground sm:text-[clamp(30px,5.4vw,72px)] ${className}`}
      style={{ letterSpacing: TRACKING, ...(mobileFont ? { fontSize: mobileFont } : {}) }}
    >
      <h1 className="sr-only">{phrase(variants[0])}</h1>

      {/* Hidden copies of every phrase, used to measure their natural width */}
      <div
        aria-hidden="true"
        className="pointer-events-none invisible absolute left-0 top-0 size-0 overflow-hidden whitespace-nowrap"
        style={{ fontSize: MEASURE_FONT, letterSpacing: TRACKING }}
      >
        {candidates.map((v, i) => (
          <span key={phrase(v)} ref={(el) => (measureRefs.current[i] = el)} className="absolute left-0 top-0">
            <VariantText variant={v} />
          </span>
        ))}
      </div>

      <div
        role="slider"
        tabIndex={0}
        aria-label="Title box width. Shrink it to shorten the greeting."
        aria-valuemin={Math.round(minW)}
        aria-valuemax={Math.round(maxW)}
        aria-valuenow={Math.round(width)}
        aria-valuetext={phrase(current)}
        onKeyDown={onKeyDown}
        onDoubleClick={() => setUserWidth(null)}
        className="hero-tbox group relative select-none whitespace-nowrap py-[0.16em] text-center outline-none"
        style={{ width: ready ? width : undefined, paddingInline: PAD_X, opacity: ready ? 1 : 0 }}
      >
        <span aria-hidden="true" key={phrase(current)} className="hero-title-swap">
          <VariantText variant={current} />
        </span>

        {/* Selection frame */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 border border-primary" />

        {/* Edge hit areas */}
        <span aria-hidden="true" className="absolute inset-y-0 -left-2 w-4 cursor-ew-resize touch-none" {...handleProps(-1)} />
        <span aria-hidden="true" className="absolute inset-y-0 -right-2 w-4 cursor-ew-resize touch-none" {...handleProps(1)} />

        {/* Corner handles: 10px visual square, 28px hit area */}
        {(
          [
            ["-left-[14px] -top-[14px]", -1],
            ["-right-[14px] -top-[14px]", 1],
            ["-left-[14px] -bottom-[14px]", -1],
            ["-right-[14px] -bottom-[14px]", 1],
          ] as const
        ).map(([pos, dir]) => (
          <span
            key={pos}
            aria-hidden="true"
            className={`absolute ${pos} z-10 grid size-7 cursor-ew-resize touch-none place-items-center`}
            {...handleProps(dir)}
          >
            <span className="size-2.5 border border-primary bg-card transition-transform group-hover:scale-110" />
          </span>
        ))}
      </div>
    </div>
  );
}
