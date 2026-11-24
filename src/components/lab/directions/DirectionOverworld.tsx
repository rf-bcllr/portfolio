/**
 * Direction 3, "Overworld". Reference: rauno.me (you move through a space instead of scrolling a
 * page) crossed with Rafa's own Quest game: the career is an island map, each case a stage, and
 * his real sprite runs between stages (and swims between islands). Original map art, drawn here.
 * Mockup only.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { experience, Media, outcomeOf, person, projectHref, projects, shortTitle, useReducedMotion, type Project } from "./shared";
import figma from "@/assets/tools/figma.png";
import figjam from "@/assets/tools/figjam.png";
import claude from "@/assets/tools/claude.svg";
import claudeCode from "@/assets/tools/claude-code.png";
import lovable from "@/assets/tools/lovable.png";
import notion from "@/assets/tools/notion.png";
import maze from "@/assets/tools/maze.png";
import mixpanel from "@/assets/tools/mixpanel.png";
import github from "@/assets/tools/github.png";
import excalidraw from "@/assets/tools/excalidraw.png";
import chatgpt from "@/assets/tools/chatgpt.png";
import adobe from "@/assets/tools/adobe-creative-cloud.png";

const C = {
  sea: "#1D6A75",
  deep: "#165660",
  shallow: "#3F9C9F",
  sand: "#ECD49C",
  grass: "#6FAE57",
  grassDark: "#57934A",
  line: "#1C2A2D",
  panel: "#FFF7E6",
  ink: "#1C2A2D",
  muted: "#4E5B5D",
  gold: "#FFD447",
};

const pixel = { fontFamily: '"Pixelify Sans", ui-monospace, monospace' };
const body = { fontFamily: '"Figtree", ui-sans-serif, system-ui, sans-serif' };

const W = 1200;
const H = 700;

type Stop = { id: string; x: number; y: number; project?: Project };

const at = (slug: string) => projects.find((p) => p.slug === slug)!;
const STOPS: Stop[] = [
  { id: "home", x: 200, y: 470 },
  { id: "health-food-delivery", x: 330, y: 335, project: at("health-food-delivery") },
  { id: "students-transportation", x: 505, y: 385, project: at("students-transportation") },
  { id: "meu-arco", x: 615, y: 250, project: at("meu-arco") },
  { id: "ai-writing-assistant", x: 725, y: 385, project: at("ai-writing-assistant") },
  { id: "ai-image-generation", x: 880, y: 540, project: at("ai-image-generation") },
  { id: "lesson-plan-tool", x: 965, y: 405, project: at("lesson-plan-tool") },
  { id: "credit-transfer-analysis", x: 1085, y: 525, project: at("credit-transfer-analysis") },
  { id: "ionic-ai-identity", x: 1095, y: 345, project: at("ionic-ai-identity") },
  { id: "quest-for-the-next-product", x: 1035, y: 150, project: at("quest-for-the-next-product") },
];
/** Hops that cross open water: the sprite swims these. */
const WATER = new Set(["1-2", "4-5", "8-9"]);

const ISLANDS = [
  { cx: 255, cy: 410, rx: 175, ry: 150, seed: 3, name: "Bahia · 2015–2022" },
  { cx: 615, cy: 320, rx: 185, ry: 140, seed: 7, name: "School island · ClassApp & isaac" },
  { cx: 985, cy: 450, rx: 185, ry: 145, seed: 11, name: "AI coast · FTD & friends" },
  { cx: 1035, cy: 150, rx: 80, ry: 58, seed: 5, name: "Side quest" },
];

/** Deterministic wobbly closed blob, Catmull-Rom smoothed. */
function blob(cx: number, cy: number, rx: number, ry: number, seed: number, scale = 1) {
  const n = 14;
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const r = 0.74 + 0.26 * Math.abs(Math.sin(seed * 12.9898 + i * 78.233));
    return [cx + Math.cos(a) * rx * r * scale, cy + Math.sin(a) * ry * r * scale];
  });
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d + "Z";
}

const TOOLS = [
  ["Figma", figma], ["FigJam", figjam], ["Claude", claude], ["Claude Code", claudeCode], ["Lovable", lovable], ["Notion", notion],
  ["Maze", maze], ["Mixpanel", mixpanel], ["GitHub", github], ["Excalidraw", excalidraw], ["ChatGPT", chatgpt], ["Adobe CC", adobe],
] as const;

/** Rafa's sprite from /play: idle row (105×180), run row (146.67×185), swim row (220×105). */
function Sprite({ mode, flip }: { mode: "idle" | "run" | "swim"; flip: boolean }) {
  const h = 58;
  const cfg =
    mode === "swim"
      ? { fw: 220, fh: 105, y: 370, frames: 4, dur: 700, h: 34 }
      : mode === "run"
        ? { fw: 146.67, fh: 185, y: 185, frames: 6, dur: 560, h }
        : { fw: 105, fh: 180, y: 2, frames: 4, dur: 920, h };
  const s = cfg.h / cfg.fh;
  return (
    <span
      aria-hidden="true"
      className="ow-sprite block"
      style={{
        width: cfg.fw * s,
        height: cfg.h,
        backgroundImage: "url(/game/assets/player/home-sheet-blue.png)",
        backgroundSize: `${880 * s}px ${475 * s}px`,
        backgroundPositionY: `${-cfg.y * s}px`,
        transform: flip ? "scaleX(-1)" : undefined,
        animation: `ow-frames ${cfg.dur}ms steps(${cfg.frames}) infinite`,
        ["--ow-end" as string]: `${-cfg.fw * cfg.frames * s}px`,
      }}
    />
  );
}

export function DirectionOverworld() {
  const reduced = useReducedMotion();
  const [target, setTarget] = useState(0);
  const [pos, setPos] = useState(0);
  const [hop, setHop] = useState<{ mode: "idle" | "run" | "swim"; flip: boolean; ms: number }>({ mode: "idle", flip: false, ms: 0 });
  const timer = useRef<number>();

  const stop = STOPS[target];
  const islands = useMemo(() => ISLANDS.map((i) => ({ ...i, shore: blob(i.cx, i.cy, i.rx, i.ry, i.seed, 1.14), sand: blob(i.cx, i.cy, i.rx, i.ry, i.seed), grass: blob(i.cx, i.cy - 8, i.rx, i.ry, i.seed, 0.74) })), []);

  // Walk one stop at a time toward the target so the sprite follows the trail (and swims across water).
  const posRef = useRef(0);
  const targetRef = useRef(0);
  const busy = useRef(false);
  const step = useCallback(() => {
    const from = posRef.current;
    const to = targetRef.current;
    if (from === to) {
      busy.current = false;
      setHop((h) => ({ ...h, mode: "idle", ms: 0 }));
      return;
    }
    busy.current = true;
    const next = from + Math.sign(to - from);
    const a = STOPS[from], b = STOPS[next];
    const ms = Math.round((Math.hypot(b.x - a.x, b.y - a.y) / 320) * 1000);
    const key = `${Math.min(from, next)}-${Math.max(from, next)}`;
    setHop({ mode: WATER.has(key) ? "swim" : "run", flip: b.x < a.x, ms });
    timer.current = window.setTimeout(() => {
      posRef.current = next;
      setPos(next);
      timer.current = window.setTimeout(step, ms + 30);
    }, 30);
  }, []);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const go = useCallback(
    (i: number) => {
      const t = Math.max(0, Math.min(STOPS.length - 1, i));
      targetRef.current = t;
      setTarget(t);
      if (reduced) {
        window.clearTimeout(timer.current);
        busy.current = false;
        posRef.current = t;
        setPos(t);
        return;
      }
      if (!busy.current) step();
    },
    [reduced, step],
  );
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); go(target + 1); }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); go(target - 1); }
  };

  const here = STOPS[pos];

  // On narrow screens the map scrolls sideways: keep Rafa in view while he travels.
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scroller.current;
    if (!el || el.scrollWidth <= el.clientWidth) return;
    el.scrollTo({ left: (here.x / W) * el.scrollWidth - el.clientWidth / 2, behavior: reduced ? "auto" : "smooth" });
  }, [here, reduced]);
  const trail = STOPS.map((s, i) => `${i ? "L" : "M"}${s.x} ${s.y}`).join(" ");
  const p = stop.project;
  const o = p ? outcomeOf(p) : null;

  return (
    <div className="min-h-dvh antialiased" style={{ background: C.deep, color: C.ink, ...body }}>
      <style>{`
        @keyframes ow-frames { to { background-position-x: var(--ow-end); } }
        @keyframes ow-bob { 50% { transform: translateY(-3px); } }
        @media (prefers-reduced-motion: reduce) { .ow-sprite { animation: none !important; } .ow-bob { animation: none !important; } }
      `}</style>

      {/* HUD */}
      <header className="mx-auto flex max-w-[1320px] flex-wrap items-end justify-between gap-4 px-5 pb-5 pt-8 text-white md:px-8">
        <div>
          <p className="text-[14px] uppercase tracking-[0.1em] text-[#BFE3E1]" style={pixel}>
            Rafa's overworld · 10 stages
          </p>
          <h1 className="mt-2 max-w-[22ch] text-[clamp(32px,4.4vw,58px)] font-bold leading-[1] tracking-[-0.01em]" style={pixel}>
            Senior product designer. Pick a stage.
          </h1>
        </div>
        <nav aria-label="Primary" className="flex gap-2 text-[14px]" style={pixel}>
          <a href="/resume" className="inline-flex h-10 items-center rounded-md border-2 border-white/40 px-3 hover:border-white">Resume</a>
          <a href="/play" className="inline-flex h-10 items-center rounded-md border-2 border-white/40 px-3 hover:border-white">Full game</a>
          <a href={person.linkedin} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center rounded-md px-3 font-bold" style={{ background: C.gold, color: C.ink }}>
            Talk to Rafa
          </a>
        </nav>
      </header>

      <div className="mx-auto grid max-w-[1320px] gap-5 px-5 pb-10 md:px-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* Map */}
        <div ref={scroller} className="overflow-x-auto rounded-xl border-[3px]" style={{ borderColor: C.line, background: C.sea }}>
          <div
            role="group"
            tabIndex={0}
            onKeyDown={onKey}
            aria-label="Career map. Use the arrow keys or the stage buttons to travel."
            className="relative min-w-[760px] outline-none focus-visible:ring-4 focus-visible:ring-[#FFD447]"
            style={{ aspectRatio: `${W} / ${H}` }}
          >
            <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full" aria-hidden="true">
              <defs>
                <pattern id="ow-waves" width="60" height="36" patternUnits="userSpaceOnUse">
                  <path d="M6 18 q6 -6 12 0 t12 0" fill="none" stroke="#ffffff" strokeOpacity=".16" strokeWidth="2" strokeLinecap="round" />
                </pattern>
              </defs>
              <rect width={W} height={H} fill={C.sea} />
              <rect width={W} height={H} fill="url(#ow-waves)" />
              {islands.map((i) => (
                <g key={i.name}>
                  <path d={i.shore} fill={C.shallow} opacity=".7" />
                  <path d={i.sand} fill={C.sand} stroke={C.line} strokeWidth="4" />
                  <path d={i.grass} fill={C.grass} stroke={C.grassDark} strokeWidth="3" />
                  {Array.from({ length: i.rx > 100 ? 7 : 2 }, (_, k) => {
                    const a = i.seed * 2.1 + k * 2.4;
                    const tx = i.cx + Math.cos(a) * i.rx * (0.28 + 0.3 * ((k * 37) % 10) / 10);
                    const ty = i.cy - 8 + Math.sin(a) * i.ry * (0.25 + 0.3 * ((k * 53) % 10) / 10);
                    const near = STOPS.some((st) => Math.hypot(st.x - tx, st.y - ty) < 34);
                    return near ? null : (
                      <g key={k}>
                        <ellipse cx={tx} cy={ty + 9} rx="11" ry="4" fill="#000" opacity=".14" />
                        <circle cx={tx} cy={ty} r="11" fill={C.grassDark} stroke={C.line} strokeWidth="3" />
                        <circle cx={tx - 3} cy={ty - 3} r="3.5" fill="#8CC56F" />
                      </g>
                    );
                  })}
                  <text x={i.cx} y={i.cy + i.ry + 30} textAnchor="middle" fill="#E5F4F2" fontSize="15" style={pixel}>
                    {i.name}
                  </text>
                </g>
              ))}
              <path d={trail} fill="none" stroke="#FFF7E6" strokeWidth="4" strokeDasharray="2 12" strokeLinecap="round" />
            </svg>

            {/* Stage flags */}
            {STOPS.map((s, i) => {
              const on = i === target;
              const visited = i <= Math.max(pos, target);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Stage ${i}: ${s.project ? shortTitle[s.project.slug] : "Start, about Rafa"}`}
                  aria-current={on ? "step" : undefined}
                  className="group absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${(s.x / W) * 100}%`, top: `${(s.y / H) * 100}%` }}
                >
                  <span
                    className="grid size-9 place-items-center rounded-full border-[3px] text-[14px] font-bold transition-transform group-hover:scale-110"
                    style={{ ...pixel, borderColor: C.line, background: on ? C.gold : visited ? "#FFF7E6" : "#D9E6E3", color: C.ink }}
                  >
                    {i === 0 ? "★" : i}
                  </span>
                  <span
                    className="pointer-events-none absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-[4px] px-1.5 py-0.5 text-[12px] transition-opacity group-hover:opacity-100"
                    style={{ ...pixel, background: C.line, color: "#fff", opacity: on ? 1 : 0 }}
                  >
                    {s.project ? shortTitle[s.project.slug] : "Start"}
                  </span>
                </button>
              );
            })}

            {/* Rafa */}
            <div
              className="pointer-events-none absolute z-10 -translate-x-1/2"
              style={{
                left: `${(here.x / W) * 100}%`,
                top: `${(here.y / H) * 100}%`,
                transform: `translate(-50%, ${hop.mode === "swim" ? "-60%" : "-118%"})`,
                transition: reduced ? "none" : `left ${hop.ms}ms linear, top ${hop.ms}ms linear`,
              }}
            >
              <Sprite mode={hop.mode} flip={hop.flip} />
            </div>
          </div>
        </div>

        {/* Stage card */}
        <aside
          aria-live="polite"
          className="flex flex-col rounded-xl border-[3px] p-5 shadow-[0_6px_0_0_#1C2A2D]"
          style={{ background: C.panel, borderColor: C.line }}
        >
          <p className="flex justify-between text-[13px] uppercase tracking-[0.08em]" style={{ ...pixel, color: C.muted }}>
            <span>Stage {String(target).padStart(2, "0")}</span>
            <span>{p ? `${p.company.replace("isaac (Arco Educação)", "isaac")} · ${p.year}` : "Start"}</span>
          </p>

          {p && o ? (
            <>
              <h2 className="mt-2 text-[30px] font-bold leading-[1.05]" style={pixel}>
                {shortTitle[p.slug]}
              </h2>
              <p className="mt-1 text-[14px]" style={{ color: C.muted }}>
                {p.category}
              </p>
              <div className="mt-4 overflow-hidden rounded-md border-[3px] bg-white" style={{ borderColor: C.line }}>
                <Media key={p.slug} project={p} className="block aspect-[16/10] w-full object-cover object-top" eager />
              </div>
              <div className="mt-4 flex items-center gap-3 rounded-md border-2 border-dashed p-3" style={{ borderColor: C.line }}>
                <span className="ow-bob text-[13px] uppercase" style={{ ...pixel, animation: "ow-bob 1.6s ease-in-out infinite" }}>
                  Loot
                </span>
                <span className="text-[26px] font-bold leading-none" style={{ ...pixel, color: o.measured ? C.ink : C.muted }}>
                  {o.value}
                </span>
                {o.measured && <span className="text-[13px] leading-tight" style={{ color: C.muted }}>{o.label}</span>}
              </div>
              <p className="mt-4 text-[15px] leading-[1.5]">{p.summary}</p>
              <a
                href={projectHref(p)}
                className="mt-auto inline-flex h-11 items-center justify-center gap-2 rounded-md border-[3px] pt-px text-[16px] font-bold transition-transform active:translate-y-0.5"
                style={{ ...pixel, borderColor: C.line, background: C.gold, color: C.ink, marginTop: 20 }}
              >
                {p.playInsteadOfOutcome ? "Play the full game" : "Enter stage"} <ArrowUpRight className="size-4" />
              </a>
            </>
          ) : (
            <>
              <h2 className="mt-2 text-[30px] font-bold leading-[1.05]" style={pixel}>
                Hi, I'm Rafa.
              </h2>
              <p className="mt-3 text-[15px] leading-[1.5]">
                I design school and AI products, from research to the shipped screen. Ten years in, now at {person.now}. Every stage on this map is a
                real case. Walk to one to see the screen and what it changed.
              </p>
              <p className="mt-5 text-[13px] uppercase tracking-[0.08em]" style={{ ...pixel, color: C.muted }}>
                Worlds cleared
              </p>
              <ul className="mt-1 text-[14px]">
                {experience.map((e) => (
                  <li key={e.company} className="flex justify-between gap-3 border-b border-dashed py-1.5" style={{ borderColor: "#C9BFA8" }}>
                    <span>{e.company}</span>
                    <span style={{ ...pixel, color: C.muted }}>{e.from}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => go(1)}
                className="mt-5 inline-flex h-11 items-center justify-center rounded-md border-[3px] text-[16px] font-bold transition-transform active:translate-y-0.5"
                style={{ ...pixel, borderColor: C.line, background: C.gold }}
              >
                Start at stage 1 →
              </button>
            </>
          )}
          <div className="mt-4 flex justify-between text-[13px]" style={pixel}>
            <button type="button" onClick={() => go(target - 1)} disabled={target === 0} className="h-10 px-2 disabled:opacity-30">
              ← Prev
            </button>
            <span className="self-center" style={{ color: C.muted }}>
              ← → to travel
            </span>
            <button type="button" onClick={() => go(target + 1)} disabled={target === STOPS.length - 1} className="h-10 px-2 disabled:opacity-30">
              Next →
            </button>
          </div>
        </aside>
      </div>

      {/* Inventory */}
      <section className="mx-auto max-w-[1320px] px-5 pb-16 md:px-8" aria-labelledby="ow-inv">
        <div className="rounded-xl border-[3px] p-5 md:p-6" style={{ background: C.panel, borderColor: C.line }}>
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 id="ow-inv" className="text-[24px] font-bold" style={pixel}>
              Inventory
            </h2>
            <p className="text-[14px]" style={{ color: C.muted }}>
              The tools in the bag, from research to shipped UI.
            </p>
          </div>
          <ul className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-12">
            {TOOLS.map(([name, src]) => (
              <li key={name} className="group relative grid aspect-square place-items-center rounded-md border-2 bg-white" style={{ borderColor: C.line }} title={name}>
                <img src={src} alt={name} className="size-[55%] object-contain transition-transform group-hover:-translate-y-0.5" />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
