/**
 * The home's covers in four arrangements: row, spiral, stack and grid. One loop draws every card
 * from its layout; changing arrangement blends each card from wherever it is, so a change can be
 * interrupted at any point. Wheel, drag, touch, arrows and the index all move one position.
 */
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type MouseEvent, type PointerEvent } from "react";
import { ArrowLeft, ArrowRight, GalleryHorizontal, LayoutGrid, Layers, Tornado } from "lucide-react";
import { PROJECTS, type Project } from "./content";
import { mix, pose, rowScroll, type Mode, type Pose, type StageBox } from "./layouts";

const MODES: { id: Mode; label: string; Icon: typeof Layers }[] = [
  { id: "row", label: "Row", Icon: GalleryHorizontal },
  { id: "spiral", label: "Spiral", Icon: Tornado },
  { id: "stack", label: "Stack", Icon: Layers },
  { id: "grid", label: "Grid", Icon: LayoutGrid },
];
const N = PROJECTS.length;
const MORPH = 900; // one card's trip between two arrangements
const STAGGER = 34; // 9 cards: the last one leaves 0.27s after the first
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2); // in-out: a trip has a start and an end
const settle = (t: number) => 1 - Math.pow(1 - t, 4); // out: the first arrival
const clamp = (p: number) => Math.max(0, Math.min(N - 1, p));
const mark = (el: HTMLElement, k: string, on: boolean) => { if (on !== (k in el.dataset)) { if (on) el.dataset[k] = ""; else delete el.dataset[k]; } };
const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Kept across visits to a project, so coming back finds the page as it was left
const memory: { mode: Mode; pos: number; entered: boolean } = { mode: "row", pos: 0, entered: false };

export function Covers({ p }: { p: Project }) {
  return (
    <>
      {p.covers.map((c) => (
        <img key={c.src} src={c.src} alt="" draggable={false} className={c.flat ? "is-flat" : ""} style={{ left: `${c.left}%`, top: `${c.top}%`, width: `${c.width}%`, borderRadius: c.round }} />
      ))}
    </>
  );
}

export function CoverStage({ href, onOpen, last }: { href: (id: string) => string; onOpen: (id: string) => void; last: string | null }) {
  const [mode, setMode] = useState<Mode>(memory.mode);
  const [active, setActive] = useState(() => Math.round(memory.pos));
  const [hint, setHint] = useState<number | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLLIElement | null)[]>([]);
  const covers = useRef<(HTMLElement | null)[]>([]);
  const index = useRef<HTMLOListElement>(null);
  const box = useRef<StageBox | null>(null);
  const modeRef = useRef<Mode>(memory.mode);
  const pos = useRef(memory.pos);
  const target = useRef(memory.pos);
  const now = useRef<(Pose | null)[]>(Array(N).fill(null));
  const morph = useRef<{ from: (Pose | null)[]; start: number; enter: boolean } | null>(null);
  const raf = useRef(0);
  const prev = useRef(0);
  const drag = useRef<{ x: number; y: number; at: number; moved: boolean; v: number; px: number; t: number } | null>(null);
  const suppress = useRef(false);
  const idle = useRef(0);
  const hintRef = useRef<number | null>(null);

  const measure = useCallback(() => {
    const el = stage.current;
    if (!el) return;
    const w = el.clientWidth, h = el.clientHeight;
    const cs = getComputedStyle(el);
    const top = parseFloat(cs.paddingTop), bottom = h - parseFloat(cs.paddingBottom);
    const pad = parseFloat(cs.paddingLeft);
    const narrow = w < 700;
    const base = Math.min(bottom - top - 34, 620, narrow ? w * 1.02 : Infinity);
    box.current = { w, h, pad, top, bottom, base, gap: narrow ? 12 : 20, ratios: PROJECTS.map((p) => p.ratio) };
    el.style.setProperty("--base", `${base}px`);
  }, []);

  const written = useRef<Record<string, string>[]>(Array.from({ length: N }, () => ({})));
  const write = useCallback((i: number, k: string, v: string) => {
    if (written.current[i][k] === v) return;
    written.current[i][k] = v;
    cards.current[i]?.style.setProperty(k, v);
  }, []);

  const draw = useCallback((time: number) => {
    const b = box.current;
    if (!b) return false;
    const m = morph.current;
    let busy = false;
    for (let i = 0; i < N; i++) {
      const li = cards.current[i];
      if (!li) continue;
      let p = pose(modeRef.current, b, i, pos.current);
      let moving = false;
      if (m) {
        const t = Math.max(0, Math.min(1, (time - m.start - i * STAGGER) / MORPH));
        if (t < 1) {
          busy = moving = true;
          const from = m.from[i] ?? { ...p, y: p.y + 60, o: 0 };
          const arc = Math.sin(Math.PI * t);
          p = mix(from, p, m.enter ? settle(t) : ease(t));
          // Between arrangements a card lifts off, turns a little and lands flat
          if (!m.enter) { p.z -= arc * 140; p.rz += arc * (i % 2 ? 5 : -5); }
        }
      }
      now.current[i] = p;
      const dim = hintRef.current !== null && hintRef.current !== i ? 0.28 : 1;
      li.style.transform = `translate3d(calc(${p.x.toFixed(2)}px - 50%), calc(${p.y.toFixed(2)}px - 50%), ${p.z.toFixed(2)}px) rotateY(${p.ry.toFixed(2)}deg) rotateZ(${p.rz.toFixed(2)}deg) scale(${p.s.toFixed(4)})`;
      li.style.opacity = p.o.toFixed(3);
      li.style.visibility = p.o < 0.01 ? "hidden" : "visible";
      // Anything that repaints is written only when it changes; the trip itself is transform and opacity
      const end = pose(modeRef.current, b, i, pos.current).s;
      write(i, "--cap", p.cap.toFixed(2));
      write(i, "--veil", p.veil.toFixed(2));
      write(i, "--inv", (1 / p.s).toFixed(p.cap > 0.01 ? 3 : 1));
      write(i, "--dim", String(dim));
      write(i, "--r", `${(10 / end).toFixed(1)}px`);
      // A cover in the stack is cropped once it lands: until then the caption band hides its foot
      const clip = moving ? 0 : p.clip;
      write(i, "--clip", `${(clip * 100).toFixed(1)}%`);
      mark(li, "clip", clip > 0.002);
      mark(li, "veil", p.veil > 0.01);
      // Seen from behind, a cover is only its colour
      const back = Math.cos((p.ry * Math.PI) / 180) < 0 ? "" : "front";
      if (li.dataset.back !== back) li.dataset.back = back;
    }
    if (m && !busy) morph.current = null;
    return busy;
  }, [write]);

  const loop = useCallback((time: number) => {
    const dt = Math.min(48, time - (prev.current || time));
    prev.current = time;
    const gap = target.current - pos.current;
    const still = Math.abs(gap) < 0.0008;
    pos.current = still || reduced() ? target.current : pos.current + gap * (1 - Math.exp(-dt / 110));
    memory.pos = target.current;
    const busy = draw(time);
    const a = Math.round(clamp(pos.current));
    setActive((x) => (x === a ? x : a));
    if (busy || !still) raf.current = requestAnimationFrame(loop);
    else { raf.current = 0; prev.current = 0; }
  }, [draw]);

  const wake = useCallback(() => { if (!raf.current) { prev.current = 0; raf.current = requestAnimationFrame(loop); } }, [loop]);

  const to = useCallback((p: number) => { target.current = clamp(p); wake(); }, [wake]);
  /** In the spiral and the stack one cover is always in front */
  const rest = useCallback((delay = 160) => {
    window.clearTimeout(idle.current);
    if (modeRef.current !== "spiral" && modeRef.current !== "stack") return;
    idle.current = window.setTimeout(() => { if (!drag.current) to(Math.round(target.current)); }, delay);
  }, [to]);
  const step = useCallback((d: 1 | -1) => to(Math.round(target.current) + d), [to]);

  const choose = (m: Mode) => {
    if (m === modeRef.current) return;
    modeRef.current = memory.mode = m;
    setMode(m);
    setHint(null);
    hintRef.current = null;
    if (m === "spiral" || m === "stack") target.current = clamp(Math.round(target.current));
    if (!reduced()) morph.current = { from: [...now.current], start: performance.now(), enter: false };
    wake();
  };

  useLayoutEffect(() => {
    measure();
    if (!memory.entered && !reduced()) morph.current = { from: Array(N).fill(null), start: performance.now() + 60, enter: true };
    memory.entered = true;
    draw(performance.now());
    wake();
    const ro = new ResizeObserver(() => { measure(); draw(performance.now()); wake(); });
    if (stage.current) ro.observe(stage.current);
    return () => { ro.disconnect(); cancelAnimationFrame(raf.current); raf.current = 0; window.clearTimeout(idle.current); };
  }, [measure, draw, wake]);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || modeRef.current === "grid") return;
      const raw = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const d = e.deltaMode === 1 ? raw * 32 : raw;
      if ((d > 0 && target.current >= N - 1) || (d < 0 && target.current <= 0)) return;
      e.preventDefault();
      to(target.current + d / (modeRef.current === "row" ? 420 : 360));
      rest();
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest("input, textarea, [role=dialog], [role=radiogroup]")) return;
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); step(e.key === "ArrowRight" ? 1 : -1); }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => { el.removeEventListener("wheel", onWheel); window.removeEventListener("keydown", onKey); };
  }, [to, rest, step]);

  const perPx = () => {
    const b = box.current!;
    if (modeRef.current !== "row") return 1 / Math.min(420, b.w * 0.6);
    const p = clamp(pos.current);
    const slope = rowScroll(b, Math.min(N - 1, p + 0.5)) - rowScroll(b, Math.max(0, p - 0.5));
    return 1 / Math.max(80, slope);
  };
  const down = (e: PointerEvent) => {
    if (e.button !== 0 || modeRef.current === "grid") return;
    suppress.current = false;
    drag.current = { x: e.clientX, y: e.clientY, at: target.current, moved: false, v: 0, px: e.clientX, t: performance.now() };
  };
  useEffect(() => {
    const move = (e: globalThis.PointerEvent) => {
      const d = drag.current;
      if (!d) return;
      if (!d.moved && Math.abs(e.clientX - d.x) > 6) { d.moved = true; suppress.current = true; if (stage.current) stage.current.dataset.drag = ""; }
      if (!d.moved) return;
      const t = performance.now();
      const k = perPx();
      d.v = d.v * 0.6 + ((-(e.clientX - d.px) * k) / Math.max(8, t - d.t)) * 0.4;
      to(target.current - (e.clientX - d.px) * k);
      d.px = e.clientX;
      d.t = t;
    };
    const up = () => {
      const d = drag.current;
      drag.current = null;
      if (stage.current) delete stage.current.dataset.drag;
      if (!d?.moved) return;
      // Carry the throw: where the hand was going decides where it lands
      to(target.current + Math.max(-1.4, Math.min(1.4, d.v * 160)));
      rest(0);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); window.removeEventListener("pointercancel", up); };
  }, [to, rest]);

  // Keep the current name in sight when the index scrolls on a phone
  useEffect(() => {
    const ol = index.current, li = ol?.children[active] as HTMLElement | undefined;
    if (ol && li && ol.scrollWidth > ol.clientWidth) ol.scrollTo({ left: li.offsetLeft - ol.clientWidth / 2 + li.clientWidth / 2, behavior: reduced() ? "auto" : "smooth" });
  }, [active]);

  const open = (i: number) => {
    covers.current.forEach((c) => c?.style.removeProperty("view-transition-name"));
    covers.current[i]?.style.setProperty("view-transition-name", "mn-hero");
    memory.pos = modeRef.current === "grid" ? i : memory.pos;
    onOpen(PROJECTS[i].id);
  };
  const focal = mode === "spiral" || mode === "stack";
  const click = (i: number) => (e: MouseEvent) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (suppress.current) { suppress.current = false; return; }
    if (focal && Math.round(target.current) !== i) { to(i); return; }
    open(i);
  };
  const point = (i: number | null) => { hintRef.current = modeRef.current === "grid" ? i : null; setHint(hintRef.current); wake(); };

  const current = PROJECTS[active];
  return (
    <>
      <div className="mn-intro">
        <h1 className="mn-lede">Senior product designer. <span>School and AI products, from research to the shipped screen.</span></h1>
        <div className="mn-modes" role="group" aria-label="Arrange projects">
          {MODES.map(({ id, label, Icon }) => (
            <button key={id} type="button" aria-pressed={mode === id} aria-label={`${label} view`} onClick={() => choose(id)}><Icon size={16} strokeWidth={1.75} aria-hidden="true" /><span>{label}</span></button>
          ))}
        </div>
      </div>

      <div ref={stage} className="mn-stage" data-mode={mode} onPointerDown={down}>
        <ul className="mn-world" aria-label="Projects">
          {PROJECTS.map((p, i) => (
            <li key={p.id} ref={(el) => { cards.current[i] = el; }} style={{ ["--ratio" as string]: p.ratio } as CSSProperties} data-active={active === i || undefined}>
              <a href={href(p.id)} draggable={false} className="mn-card" aria-label={`${p.name}, ${p.company}`} onClick={click(i)} onFocus={(e) => { if (e.currentTarget.matches(":focus-visible")) to(i); }} onPointerEnter={() => point(i)} onPointerLeave={() => point(null)}>
                <span ref={(el) => { covers.current[i] = el; }} className="mn-cover" style={{ background: p.ground, viewTransitionName: last === p.id ? "mn-hero" : undefined } as CSSProperties}><Covers p={p} /></span>
                <span className="mn-cap" aria-hidden="true"><b>{p.name}</b><span>{p.company}</span></span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="mn-focus" data-on={focal || undefined} aria-hidden="true">
        <p key={current.id}><b>{current.name}</b><span>{current.line}</span></p>
      </div>

      <nav className="mn-index" aria-label="Project index">
        <button type="button" aria-label="Previous project" disabled={mode === "grid" || active === 0} onClick={() => step(-1)}><ArrowLeft size={18} strokeWidth={1.75} /></button>
        <ol ref={index}>
          {PROJECTS.map((p, i) => (
            <li key={p.id}>
              <button type="button" aria-current={mode !== "grid" && active === i ? "true" : undefined} data-hint={hint === i || undefined}
                onClick={() => (mode === "grid" ? open(i) : to(i))} onPointerEnter={() => point(i)} onPointerLeave={() => point(null)} onFocus={() => point(i)} onBlur={() => point(null)}>
                <i style={{ background: p.ground }} />{p.name}
              </button>
            </li>
          ))}
        </ol>
        <button type="button" aria-label="Next project" disabled={mode === "grid" || active === N - 1} onClick={() => step(1)}><ArrowRight size={18} strokeWidth={1.75} /></button>
      </nav>
    </>
  );
}
