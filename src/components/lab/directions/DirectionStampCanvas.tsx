/**
 * Direction "Canvas · Stamps". Round-1 Canvas (ref rauno.me: the site as artboards on a canvas)
 * restyled after the user's poster-stamp references: a black-and-white design tool, every case a
 * perforated stamp set in condensed caps and mono labels, crosshairs, barcodes. Colour lives only
 * in the reconstructed, live project fragments (src/components/stage), each with numbered notes.
 * Mockup only.
 */
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ComponentType, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { ArrowUpRight, Minus, Play, Plus } from "lucide-react";
import { MeuArcoBento } from "@/components/stage/MeuArcoBento";
import { ChegueiBento } from "@/components/stage/ChegueiBento";
import { AiImageGenerationBento } from "@/components/stage/AiImageGenerationBento";
import { IonicBento } from "@/components/stage/IonicBento";
import { QuestBento } from "@/components/stage/QuestBento";
import { SaudeBento } from "@/components/stage/SaudeBento";
import { WritingBento } from "@/components/stage/WritingBento";
import { LessonPlanBento } from "@/components/stage/LessonPlanBento";
import { CreditTransferBento } from "@/components/stage/CreditTransferBento";
import { experience, outcomeOf, person, portrait, projectHref, projects, shortTitle, type Project } from "./shared";
import "./stamp-canvas.css";

type Frame = { Fragment: ComponentType; pt: string; notes: [text: string, anchor: string][] };

/** Per case: the live fragment, a Portuguese line, and notes pinned to the element they describe (a selector inside the fragment). */
const FRAMES: Record<string, Frame> = {
  "meu-arco": {
    Fragment: MeuArcoBento,
    pt: "Três plataformas, um app",
    notes: [
      ["Alerts ride one rail; the fifth card is an exit, not more content.", ".ar-rail"],
      ["One primary action per card: the invoice only asks to pay.", ".ar-pay"],
      ["Requests scroll sideways, so the home stays one screen of decisions.", ".ar-reqs"],
    ],
  },
  "students-transportation": {
    Fragment: ChegueiBento,
    pt: "O responsável avisa, a escola libera",
    notes: [
      ["Built for a driver's split attention: one big Cheguei button.", ".cq-hero .cq-button"],
      ["The parent changes transport and picks the gate before arriving.", ".cq-transport-tile"],
      ["Staff accept the pickup in one tap; the parent sees it change.", ".cq-staff .cq-button"],
    ],
  },
  "health-food-delivery": {
    Fragment: SaudeBento,
    pt: "Nutrição antes do carrinho",
    notes: [
      ["Nutrition tags sit above the fold, read before checkout.", ".sp-tags"],
      ["Quantity and add share one row to keep the order fast.", ".sp-add"],
      ["Healthy picks earn points, rewarded right after the tap.", ".sp-toast"],
    ],
  },
  "ai-writing-assistant": {
    Fragment: WritingBento,
    pt: "Revisar antes de enviar",
    notes: [
      ["Moderation first: the assistant flags what families would see.", ".wr-word"],
      ["Every suggestion is accepted by the sender, never applied silently.", ".wr-sug"],
      ["Tone control for school voice: formal or friendly.", ".wr-tone"],
    ],
  },
  "ai-image-generation": {
    Fragment: AiImageGenerationBento,
    pt: "A figura certa para a questão",
    notes: [
      ["Starts from the selected question, not a blank prompt.", ".aig-selected-question"],
      ["Four options to choose from, inserted straight into the question.", ".aig-options"],
      ["Scoped to subject and grade, where visual questions matter most.", ".aig-subject"],
    ],
  },
  "lesson-plan-tool": {
    Fragment: LessonPlanBento,
    pt: "Um plano para cada turma",
    notes: [
      ["Learning profiles group shared needs (TDAH, dislexia, TEA).", ".lp-profile"],
      ["Adapted steps are marked, so the teacher sees what changed.", ".lp-sec.is-adapt"],
      ["The AI disclaimer stays on every screen.", ".lp-foot"],
    ],
  },
  "credit-transfer-analysis": {
    Fragment: CreditTransferBento,
    pt: "Seu histórico, seus créditos",
    notes: [
      ["Five steps, always visible: no dead ends.", ".ct-side ol"],
      ["The student checks what was read from the transcript.", ".ct-sum"],
      ["Email asked at the finish line, once the value is shown.", ".ct-field"],
    ],
  },
  "ionic-ai-identity": {
    Fragment: IonicBento,
    pt: "Lia e Íon a bordo",
    notes: [
      ["Two characters with two jobs: Lia discovers, Íon explains.", ".ionic-hero"],
      ["Each built from its own moodboard.", ".ionic-reference"],
      ["20+ alternatives explored; named with the content designers.", ".ionic-process"],
    ],
  },
  "quest-for-the-next-product": {
    Fragment: QuestBento,
    pt: "Cada emprego, um capítulo",
    notes: [
      ["Each job is a level; the route runs from university to now.", ".quest-hero"],
      ["Places from the career become scenes.", ".quest-coast"],
      ["The boss is the impostor syndrome.", ".quest-boss"],
    ],
  },
};

const CATEGORY_LINES = (p: Project) => p.chips.map((c) => c.toUpperCase());

function Cross({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={`sc-cross ${className}`} aria-hidden="true">
      <circle cx="10" cy="10" r="5" fill="none" stroke="currentColor" />
      <path d="M10 0v20M0 10h20" stroke="currentColor" />
    </svg>
  );
}

/** Deterministic barcode from a string. */
function Barcode({ seed }: { seed: string }) {
  let x = 0;
  const bars: ReactNode[] = [];
  for (let i = 0; x < 148; i++) {
    const c = seed.charCodeAt(i % seed.length) + i * 7;
    const w = 1 + (c % 3);
    if (i % 2 === 0) bars.push(<rect key={i} x={x} y="0" width={w} height="30" />);
    x += w + (c % 2);
  }
  return (
    <svg viewBox="0 0 150 30" className="st-code" aria-hidden="true">
      {bars}
    </svg>
  );
}

/** Renders a fragment at its 560px design width and scales it down when the column is narrower. */
function Fit({ children }: { children: ReactNode }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ s: 1, h: 0 });
  useLayoutEffect(() => {
    const o = outer.current, i = inner.current;
    if (!o || !i) return;
    const ro = new ResizeObserver(() => {
      const s = Math.min(1, o.clientWidth / 560);
      setBox({ s, h: i.offsetHeight * s });
    });
    ro.observe(o);
    ro.observe(i);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={outer} style={{ height: box.h || undefined }}>
      <div ref={inner} className="relative mx-auto" style={{ width: 560, transform: `scale(${box.s})`, transformOrigin: "top left", marginLeft: box.s < 1 ? 0 : undefined }}>
        {children}
      </div>
    </div>
  );
}

/**
 * Numbered pins that follow the element each note describes, frame by frame while the stamp is on
 * screen; a pin hides while its element is faded out or scrolled out of its tile.
 */
function Pins({ anchors }: { anchors: string[] }) {
  const layer = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<({ x: number; y: number } | null)[]>([]);
  useEffect(() => {
    const el = layer.current;
    const root = el?.parentElement;
    if (!el || !root) return;
    let raf = 0;
    let on = false;
    const visible = (node: HTMLElement, cx: number, cy: number) => {
      for (let n: HTMLElement | null = node; n && n !== root; n = n.parentElement) {
        const cs = getComputedStyle(n);
        if (Number(cs.opacity) < 0.3 || cs.visibility === "hidden") return false;
        if (n !== node && cs.overflow !== "visible") {
          const r = n.getBoundingClientRect();
          if (cx < r.left || cx > r.right || cy < r.top || cy > r.bottom) return false;
        }
      }
      return true;
    };
    const tick = () => {
      const rr = root.getBoundingClientRect();
      const s = rr.width / root.offsetWidth || 1;
      setPos(
        anchors.map((sel) => {
          const node = root.querySelector<HTMLElement>(sel);
          if (!node) return null;
          const r = node.getBoundingClientRect();
          if (!r.width) return null;
          // Visible if the element's own centre shows; the pin sits on its right edge, half outside.
          const px = r.right, py = r.top + Math.min(r.height / 2, 16 * s);
          return visible(node, r.left + r.width / 2, r.top + r.height / 2) ? { x: (px - rr.left) / s, y: (py - rr.top) / s } : null;
        }),
      );
      if (on) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      on = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (on) raf = requestAnimationFrame(tick);
    });
    io.observe(root);
    return () => { on = false; cancelAnimationFrame(raf); io.disconnect(); };
  }, [anchors]);
  return (
    <div ref={layer} className="pointer-events-none absolute inset-0" aria-hidden="true">
      {pos.map((p, n) =>
        p ? <span key={n} className="st-n st-pin" style={{ left: p.x, top: p.y }}>{n + 1}</span> : null,
      )}
    </div>
  );
}

function ProjectStamp({ p, index }: { p: Project; index: number }) {
  const f = FRAMES[p.slug];
  const o = outcomeOf(p);
  const no = `${p.year}.${String(index).padStart(2, "0")}`;
  return (
    <article className="stamp" aria-labelledby={`st-${p.slug}`}>
      <header className="st-head">
        <span className="st-index sc-cond" aria-hidden="true">{String(index).padStart(2, "0")}</span>
        <div>
          <h3 id={`st-${p.slug}`} className="st-title sc-cond">{shortTitle[p.slug]}</h3>
          <p className="sc-mono mt-3">{p.category}</p>
        </div>
        <div className="st-meta">
          <span className="sc-mono">No. {no}</span>
          <div className="st-list sc-mono">
            {CATEGORY_LINES(p).map((c) => <span key={c}>{c}</span>)}
          </div>
          <Cross />
        </div>
      </header>
      <div className="st-body">
        <div className="st-side">
          <p className="st-pt sc-cond" lang="pt-BR">{f.pt}</p>
          <div className="st-rule" />
          <div className="st-result">
            <b className="sc-cond" style={o.measured ? undefined : { color: "var(--grey)", fontSize: 44 }}>{o.value}</b>
            <span className="sc-mono">{o.measured ? o.label : p.durationDisplay === "TBD" ? "Impact to be measured" : p.durationDisplay}</span>
          </div>
          <div className="st-rule" />
          <ol className="st-notes">
            {f.notes.map(([text], n) => (
              <li key={n}><span className="st-n">{n + 1}</span>{text}</li>
            ))}
          </ol>
        </div>
        <figure className="st-figure m-0">
          <span className="st-fig-label sc-mono">Fig. {String(index).padStart(2, "0")} · live rebuild</span>
          <Cross className="tl" />
          <Cross className="br" />
          <Fit>
            <f.Fragment />
            <Pins anchors={f.notes.map(([, a]) => a)} />
          </Fit>
        </figure>
      </div>
      <footer className="st-foot">
        <Barcode seed={p.slug} />
        <span className="sc-mono hidden sm:block">{p.company} · {p.roleDisplay}</span>
        <a href={projectHref(p)} className="st-open sc-mono">
          {p.playInsteadOfOutcome ? "Play the game" : "Open the case"} <ArrowUpRight className="size-4" />
        </a>
      </footer>
    </article>
  );
}

function HeroStamp() {
  const facts = [projects.find((p) => p.slug === "meu-arco")!, projects.find((p) => p.slug === "students-transportation")!, projects.find((p) => p.slug === "lesson-plan-tool")!];
  return (
    <article className="stamp" aria-labelledby="st-hero">
      <header className="st-head" style={{ gridTemplateColumns: "1fr auto" }}>
        <div>
          <p className="sc-mono">Portfolio · 2015—2026 · No. 0000</p>
          <h1 id="st-hero" className="st-hero-title sc-cond mt-3">Rafael<br />Bacellar</h1>
        </div>
        <div className="st-meta">
          <span className="sc-mono">Senior product designer</span>
          <div className="st-list sc-mono">
            {person.skills.map((s) => <span key={s}>{s}</span>)}
          </div>
          <Cross />
        </div>
      </header>
      <div className="st-body" style={{ gridTemplateColumns: "minmax(0,1fr) 300px" }}>
        <div className="st-side">
          <p className="st-pt sc-cond" style={{ fontSize: 44 }}>Product design for the people who teach and learn.</p>
          <p lang="pt-BR" className="sc-mono" style={{ color: "var(--grey)" }}>Design de produto para quem ensina e aprende.</p>
          <div className="st-facts">
            {facts.map((p) => {
              const o = outcomeOf(p);
              return (
                <div key={p.slug}>
                  <b className="sc-cond">{o.value}</b>
                  <span className="sc-mono">{shortTitle[p.slug]}</span>
                </div>
              );
            })}
          </div>
          <ul className="sc-mono grid gap-1.5">
            {experience.slice(0, 4).map((e) => (
              <li key={e.company} className="flex justify-between gap-4 border-b border-black/20 pb-1.5">
                <span>{e.company} · {e.role}</span>
                <span>{e.from}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-4">
          <div className="st-portrait">
            <img src={portrait} alt="Rafael Bacellar" />
          </div>
          <p className="st-avail sc-mono"><i aria-hidden="true" /> Open to new projects</p>
          <a href={person.linkedin} target="_blank" rel="noreferrer" className="st-open sc-mono justify-between">
            Connect on LinkedIn <ArrowUpRight className="size-4" />
          </a>
        </div>
      </div>
      <footer className="st-foot">
        <Barcode seed="rafael-bacellar" />
        <span className="sc-mono">Research · Systems · AI workflows · Shipped UI</span>
        <span className="sc-mono">Fig. 00</span>
      </footer>
    </article>
  );
}

export function DirectionStampCanvas() {
  const ids = ["hero", ...projects.map((p) => p.slug)];
  const [sel, setSel] = useState("hero");
  const [zoom, setZoom] = useState(0.6);
  const canvas = useRef<HTMLDivElement>(null);
  const items = useRef<Record<string, HTMLElement | null>>({});
  const pan = useRef<{ x: number; y: number; l: number; t: number } | null>(null);
  const [panning, setPanning] = useState(false);
  const current = projects.find((p) => p.slug === sel);

  const focus = useCallback((id: string) => {
    setSel(id);
    const el = items.current[id], c = canvas.current;
    if (!el || !c || window.innerWidth < 1024) return;
    const r = el.getBoundingClientRect(), cr = c.getBoundingClientRect();
    c.scrollTo({ left: c.scrollLeft + r.left - cr.left - (cr.width - r.width) / 2, top: c.scrollTop + r.top - cr.top - 32, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => focus(sel), 60);
    return () => window.clearTimeout(t);
    // re-centre when zoom changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom]);

  const onKey = (e: KeyboardEvent) => {
    const i = ids.indexOf(sel);
    if ((e.key === "ArrowRight" || e.key === "ArrowDown") && i < ids.length - 1) { e.preventDefault(); focus(ids[i + 1]); }
    if ((e.key === "ArrowLeft" || e.key === "ArrowUp") && i > 0) { e.preventDefault(); focus(ids[i - 1]); }
  };

  const down = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" || (e.target as HTMLElement).closest("a,button") || window.innerWidth < 1024) return;
    const c = canvas.current!;
    pan.current = { x: e.clientX, y: e.clientY, l: c.scrollLeft, t: c.scrollTop };
  };
  const move = (e: PointerEvent) => {
    const p = pan.current;
    if (!p) return;
    if (!panning && Math.hypot(e.clientX - p.x, e.clientY - p.y) > 4) setPanning(true);
    canvas.current!.scrollLeft = p.l - (e.clientX - p.x);
    canvas.current!.scrollTop = p.t - (e.clientY - p.y);
  };
  const up = () => { pan.current = null; window.setTimeout(() => setPanning(false), 0); };

  const sizeOf = (id: string) => {
    const el = items.current[id];
    return el ? `${el.offsetWidth} × ${el.offsetHeight}` : "";
  };

  return (
    <div className="sc">
      <header className="sc-bar">
        <span className="sc-mark"><b className="sc-cond">RB—</b><span className="sc-mono" style={{ color: "var(--soft)" }}>Portfolio.canvas</span></span>
        <span className="sc-sep hidden md:block" />
        <span className="sc-mono hidden md:block" style={{ color: "var(--soft)" }}>{ids.length} frames · 2015—2026</span>
        <span className="ml-auto" />
        <div className="sc-zoom sc-mono hidden lg:inline-flex">
          <button type="button" aria-label="Zoom out" onClick={() => setZoom((z) => Math.max(0.4, +(z - 0.1).toFixed(1)))}><Minus className="size-3.5" /></button>
          <span aria-live="polite">{Math.round(zoom * 100)}%</span>
          <button type="button" aria-label="Zoom in" onClick={() => setZoom((z) => Math.min(1, +(z + 0.1).toFixed(1)))}><Plus className="size-3.5" /></button>
        </div>
        <a href="/play" className="sc-btn sc-mono"><Play className="size-3.5" /> Play</a>
        <a href={person.linkedin} target="_blank" rel="noreferrer" className="sc-btn is-solid sc-mono">Connect</a>
      </header>

      <div className="sc-work">
        <nav className="sc-layers" aria-label="Frames">
          <h2 className="sc-mono">Layers</h2>
          {ids.map((id, i) => {
            const p = projects.find((x) => x.slug === id);
            return (
              <button key={id} type="button" className="sc-layer sc-mono" aria-current={sel === id ? "true" : undefined} onClick={() => focus(id)}>
                <span>{String(i).padStart(2, "0")}</span>
                <b>{p ? shortTitle[p.slug] : "Rafael Bacellar"}</b>
                <span>{p?.year ?? ""}</span>
              </button>
            );
          })}
        </nav>

        <div
          ref={canvas}
          className={`sc-canvas ${panning ? "is-panning" : ""}`}
          tabIndex={0}
          onKeyDown={onKey}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerLeave={up}
          aria-label="Canvas. Drag to pan; arrow keys move between frames."
        >
          <div className="sc-world" style={{ zoom }}>
            {ids.map((id, i) => {
              const p = projects.find((x) => x.slug === id);
              return (
                <section
                  key={id}
                  ref={(el) => (items.current[id] = el)}
                  className="sc-sel"
                  data-on={sel === id ? "" : undefined}
                  onClickCapture={(e) => { if (panning) { e.preventDefault(); e.stopPropagation(); } else if (!(e.target as HTMLElement).closest("a")) setSel(id); }}
                >
                  <p className="sc-sel-label sc-mono">
                    <span>{String(i).padStart(2, "0")} — {p ? shortTitle[p.slug] : "Cover"}</span>
                    <span>{sel === id ? sizeOf(id) : p?.company}</span>
                  </p>
                  <span className="sc-sel-frame" aria-hidden="true"><i /><i /><i /><i /></span>
                  {p ? <ProjectStamp p={p} index={i} /> : <HeroStamp />}
                </section>
              );
            })}
          </div>
        </div>

        <aside className="sc-inspect" aria-label="Inspector" aria-live="polite">
          <p className="sc-mono mb-3" style={{ color: "var(--soft)" }}>Inspector</p>
          <div className="stamp">
            {current ? (
              <>
                <p className="sc-mono">Frame {String(ids.indexOf(sel)).padStart(2, "0")} · {current.company}</p>
                <p className="in-title sc-cond">{shortTitle[current.slug]}</p>
                <p className="sc-mono" style={{ color: "var(--grey)" }}>{current.category}</p>
                <dl className="in-dl sc-mono">
                  <div><dt>Year</dt><dd>{current.year}</dd></div>
                  <div><dt>Time</dt><dd>{current.durationDisplay === "TBD" ? "Ongoing" : current.durationDisplay}</dd></div>
                  <div className="col-span-2"><dt>Role</dt><dd>{current.roleDisplay}</dd></div>
                </dl>
                <div className="st-rule" />
                <div className="in-result mt-4">
                  <b className="sc-cond" style={{ color: outcomeOf(current).measured ? undefined : "var(--grey)" }}>{outcomeOf(current).value}</b>
                  <span className="sc-mono">{outcomeOf(current).measured ? outcomeOf(current).label : "Impact to be measured"}</span>
                </div>
                <ul className="in-hl">
                  {current.outcomeHighlights.map((h) => <li key={h}>{h.charAt(0) + h.slice(1).toLowerCase()}</li>)}
                </ul>
                <a href={projectHref(current)} className="st-open sc-mono w-full justify-between">
                  {current.playInsteadOfOutcome ? "Play the game" : "Open the case"} <ArrowUpRight className="size-4" />
                </a>
              </>
            ) : (
              <>
                <p className="sc-mono">Frame 00 · Cover</p>
                <p className="in-title sc-cond">Nine cases</p>
                <p className="text-[13px] leading-snug">Every frame holds a live rebuild of the real product. Numbers on the screen match the notes beside it.</p>
                <ul className="in-hl sc-mono">
                  <li>Drag the canvas to pan</li>
                  <li>← → to move between frames</li>
                  <li>Click a layer to jump</li>
                </ul>
                <button type="button" onClick={() => focus(ids[1])} className="st-open sc-mono w-full justify-between">
                  Start with frame 01 <ArrowUpRight className="size-4" />
                </button>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
