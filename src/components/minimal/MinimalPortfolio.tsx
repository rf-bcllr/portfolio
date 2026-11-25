/**
 * The minimal direction (ref: renan.design). One typeface, a dotted ground and a row of covers,
 * each a product screen on a flat colour. A cover opens into its project: the colour becomes the
 * ground of the live stage pieces, with the numbered notes set beside them as plain text.
 */
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import { flushSync } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import esdrasAvatar from "@/assets/esdras-avatar.png";
import inisAvatar from "@/assets/inis-avatar.png";
import { Markers, type Piece } from "@/components/canvas/canvasFrames";
import { experience, person, portrait } from "@/components/canvas/shared";
import { FigmaComment } from "@/components/hero/FigmaComment";
import { translations } from "@/hooks/useTranslations";
import { PROJECTS, type Project } from "./content";
import "./minimal.css";

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const [inis, esdras] = translations.en.recommendationsItems;
const ABOUT = "about";

type Go = (id: string | null) => void;
type Doc = Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void>; finished: Promise<void> } };

/** The open project lives in the hash, so links and the back button work. */
function useView(): [string | null, Go] {
  const { hash, pathname } = useLocation();
  const navigate = useNavigate();
  const id = decodeURIComponent(hash.slice(1));
  const view = id === ABOUT || PROJECTS.some((p) => p.id === id) ? id : null;
  const go = useCallback<Go>((next) => {
    const run = () => flushSync(() => navigate({ pathname, hash: next ? `#${next}` : "" }));
    const doc = document as Doc;
    if (doc.startViewTransition && !reduced()) {
      // A skipped transition (hidden tab, a second click) still changes the view
      const t = doc.startViewTransition(run);
      t.ready.catch(() => undefined);
      t.finished.catch(() => undefined);
    } else run();
  }, [navigate, pathname]);
  return [view, go];
}

const plainClick = (e: MouseEvent) => e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;

function Covers({ p }: { p: Project }) {
  return (
    <>
      {p.covers.map((c) => (
        <img key={c.src} src={c.src} alt="" draggable={false} className={c.flat ? "is-flat" : ""} style={{ left: `${c.left}%`, top: `${c.top}%`, width: `${c.width}%` }} />
      ))}
    </>
  );
}

/* ---------- Home: the row of covers ---------- */

let savedScroll = 0;
let entered = false;

function Home({ go, last }: { go: Go; last: string | null }) {
  const { pathname } = useLocation();
  const track = useRef<HTMLUListElement>(null);
  const target = useRef<number | null>(null);
  const raf = useRef(0);
  const drag = useRef<{ x: number; left: number; moved: boolean; v: number; px: number } | null>(null);
  const suppress = useRef(false);
  const [edge, setEdge] = useState({ start: true, end: false });
  const [first] = useState(() => !entered);

  const glide = useCallback((to: number) => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    target.current = Math.max(0, Math.min(max, to));
    if (reduced()) { el.scrollLeft = target.current; target.current = null; return; }
    cancelAnimationFrame(raf.current);
    let at = el.scrollLeft;
    const step = () => {
      const t = target.current;
      if (t === null) return;
      at += (t - at) * 0.14;
      if (Math.abs(t - at) < 0.6) { el.scrollLeft = t; target.current = null; return; }
      el.scrollLeft = at;
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  }, []);

  const page = useCallback((dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const from = target.current ?? el.scrollLeft;
    const pad = parseFloat(getComputedStyle(el).paddingLeft);
    const stops = [...el.children].map((c) => (c as HTMLElement).offsetLeft - pad);
    const next = dir > 0 ? stops.find((s) => s > from + 8) : [...stops].reverse().find((s) => s < from - 8);
    glide(next ?? (dir > 0 ? el.scrollWidth : 0));
  }, [glide]);

  useLayoutEffect(() => {
    entered = true;
    const el = track.current;
    if (!el) return;
    el.scrollLeft = savedScroll;
    const onScroll = () => {
      savedScroll = el.scrollLeft;
      setEdge({ start: el.scrollLeft < 4, end: el.scrollLeft > el.scrollWidth - el.clientWidth - 4 });
    };
    // A mouse wheel moves the row; at either end the page keeps its own scroll
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) { target.current = null; return; }
      const max = el.scrollWidth - el.clientWidth;
      const from = target.current ?? el.scrollLeft;
      if ((e.deltaY > 0 && from >= max - 1) || (e.deltaY < 0 && from <= 1)) return;
      e.preventDefault();
      glide(from + (e.deltaMode === 1 ? e.deltaY * 32 : e.deltaY) * 1.2);
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => { el.removeEventListener("scroll", onScroll); el.removeEventListener("wheel", onWheel); cancelAnimationFrame(raf.current); };
  }, [glide]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest("input, textarea, [role=dialog]")) return;
      if (e.key === "ArrowRight") { e.preventDefault(); page(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); page(-1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [page]);

  const down = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    suppress.current = false;
    target.current = null;
    drag.current = { x: e.clientX, left: track.current!.scrollLeft, moved: false, v: 0, px: e.clientX };
  };
  useEffect(() => {
    const move = (e: globalThis.PointerEvent) => {
      const d = drag.current, el = track.current;
      if (!d || !el) return;
      if (!d.moved && Math.abs(e.clientX - d.x) > 5) { d.moved = true; suppress.current = true; el.dataset.drag = ""; }
      if (!d.moved) return;
      d.v = d.v * 0.6 + (e.clientX - d.px) * 0.4;
      d.px = e.clientX;
      el.scrollLeft = d.left - (e.clientX - d.x);
    };
    const up = () => {
      const d = drag.current, el = track.current;
      drag.current = null;
      if (!d?.moved || !el) return;
      delete el.dataset.drag;
      glide(el.scrollLeft - d.v * 14);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); window.removeEventListener("pointercancel", up); };
  }, [glide]);

  const open = (id: string) => (e: MouseEvent) => {
    if (!plainClick(e)) return;
    e.preventDefault();
    if (suppress.current) { suppress.current = false; return; }
    const el = e.currentTarget.querySelector<HTMLElement>(".mn-cover");
    // One element may carry the name: the cover being opened takes it from the one last visited
    track.current?.querySelectorAll<HTMLElement>(".mn-cover").forEach((c) => c.style.removeProperty("view-transition-name"));
    if (el) el.style.setProperty("view-transition-name", "mn-hero");
    go(id);
  };
  const hero = (id: string) => (last === id ? { viewTransitionName: "mn-hero" } as React.CSSProperties : undefined);

  return (
    <div className="mn-home">
      <h1 className="mn-lede">Senior product designer. <span>School and AI products, from research to the shipped screen.</span></h1>
      <ul ref={track} className={`mn-track ${first ? "is-first" : ""}`} onPointerDown={down} aria-label="Projects">
        {PROJECTS.map((p, i) => (
          <li key={p.id} style={{ ["--ratio" as string]: p.ratio, ["--i" as string]: i }}>
            <a href={`${pathname}#${p.id}`} onClick={open(p.id)} draggable={false} className="mn-card">
              <span className="mn-cover" style={{ background: p.ground, ...hero(p.id) }}><Covers p={p} /></span>
              <span className="mn-cap"><b>{p.name}</b><span>{p.company}</span></span>
            </a>
          </li>
        ))}
        <li style={{ ["--ratio" as string]: 0.8, ["--i" as string]: PROJECTS.length }}>
          <a href={`${pathname}#${ABOUT}`} onClick={open(ABOUT)} draggable={false} className="mn-card">
            <span className="mn-cover is-photo" style={hero(ABOUT)}><img src={portrait} alt="" draggable={false} /></span>
            <span className="mn-cap"><b>About</b><span>Rafael Bacellar</span></span>
          </a>
        </li>
      </ul>
      <div className="mn-foot">
        <button type="button" aria-label="Previous project" disabled={edge.start} onClick={() => page(-1)}><ArrowLeft size={18} strokeWidth={1.75} /></button>
        <button type="button" aria-label="Next project" disabled={edge.end} onClick={() => page(1)}><ArrowRight size={18} strokeWidth={1.75} /></button>
      </div>
    </div>
  );
}

/* ---------- Project: the live pieces on the cover's colour ---------- */

function PiecePanel({ p, piece, start, hero }: { p: Project; piece: Piece; start: number; hero: boolean }) {
  const anchors = useMemo(() => piece.notes.map((n) => n.a), [piece.notes]);
  const [dead, setDead] = useState(false);
  // Art hosted with the deployed site: without it, the panel steps aside (the first keeps its cover)
  if (dead && !hero) return null;
  return (
    <section className="mn-piece" aria-label={piece.name}>
      <div className={`mn-panel ${p.bleed && !piece.h ? "is-bleed" : ""} ${piece.h ? "is-tall" : ""} ${piece.w ? "" : "is-art"}`} style={{ background: p.ground, viewTransitionName: hero ? "mn-hero" : undefined } as React.CSSProperties}>
        {dead ? (
          <div className={`mn-still ${p.ratio > 1 ? "is-wide" : ""}`} style={{ ["--ratio" as string]: p.ratio }}><Covers p={p} /></div>
        ) : (
          <div className="mn-fit" data-ss-fill="" style={piece.w ? { maxWidth: Math.min(1040, piece.w * (piece.h ? 780 / piece.h : 1.4)) } : undefined} onErrorCapture={(e) => { if (e.target instanceof HTMLImageElement) setDead(true); }}>
            <piece.C />
            {piece.notes.length > 0 && <Markers anchors={anchors} start={start} />}
          </div>
        )}
      </div>
      {piece.notes.length > 0 && (
        <ol className="mn-notes" start={start}>
          {piece.notes.map((n, i) => (
            <li key={n.t}><span className="fg-marker" aria-hidden="true">{start + i}</span><div><b>{n.t}</b><p>{n.d}</p></div></li>
          ))}
        </ol>
      )}
    </section>
  );
}

function ProjectView({ p, go }: { p: Project; go: Go }) {
  const { pathname } = useLocation();
  const next = PROJECTS[(PROJECTS.indexOf(p) + 1) % PROJECTS.length];
  let n = 1;
  return (
    <article className="mn-project">
      <header className="mn-head">
        <h1>{p.name}</h1>
        <p>{p.line}</p>
      </header>
      {p.pieces.map((piece, i) => {
        const start = n;
        n += piece.notes.length;
        return <PiecePanel key={piece.id} p={p} piece={piece} start={start} hero={i === 0} />;
      })}
      {p.case && (
        <div className="mn-case">
          <section><h2>Challenge</h2><p>{p.case.challenge}</p></section>
          <section><h2>What I did</h2><ul>{p.case.did.map((d) => <li key={d}>{d}</li>)}</ul></section>
          <section><h2>Results</h2><ul>{p.case.results.map((d) => <li key={d}>{d}</li>)}</ul></section>
          <section>
            <h2>Facts</h2>
            <dl><div><dt>Company</dt><dd>{p.company}</dd></div>{p.case.meta.filter(([k]) => k !== "Company").map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
            {p.link && <a className="mn-link" href={p.link.href}>{p.link.label}</a>}
          </section>
        </div>
      )}
      <a href={`${pathname}#${next.id}`} className="mn-next" onClick={(e) => { if (!plainClick(e)) return; e.preventDefault(); go(next.id); }}>
        <span className="mn-next-t"><span>Next project</span><b>{next.name}</b></span>
        <span className="mn-next-c" style={{ background: next.ground }}><Covers p={next} /></span>
      </a>
    </article>
  );
}

/* ---------- About ---------- */

function About() {
  const [open, setOpen] = useState<"inis" | "esdras" | null>("inis");
  const toggle = (k: "inis" | "esdras") => setOpen((o) => (o === k ? null : k));
  return (
    <article className="mn-about">
      <div className="mn-photo">
        <img src={portrait} alt="Rafael Bacellar" style={{ viewTransitionName: "mn-hero" } as React.CSSProperties} />
        <FigmaComment avatarSrc={inisAvatar} authorName={inis.author} timestamp={inis.role} open={open === "inis"} onToggle={() => toggle("inis")} width={236} side="right" className="mn-pin-inis"
          message={"“By far the most creative designer I’ve ever worked with. He has the eye for details and spots flaws no one else does.”"} />
        <FigmaComment avatarSrc={esdrasAvatar} authorName={esdras.author} timestamp={esdras.role} open={open === "esdras"} onToggle={() => toggle("esdras")} width={236} side="left" className="mn-pin-esdras"
          message={"“My reference of a dedicated and curious designer, always bringing something new to the table.”"} />
      </div>
      <div className="mn-about-t">
        <h1>Rafael Bacellar</h1>
        <p>{person.nowDetail}.</p>
        <ul className="mn-exp">{experience.map((e) => <li key={e.company}><b>{e.company}</b><span>{e.role}</span><em>{e.period}</em></li>)}</ul>
        <p className="mn-links"><a className="mn-link" href="/resume">Resume</a><a className="mn-link" href={person.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></p>
      </div>
    </article>
  );
}

/* ---------- Shell ---------- */

export function MinimalPortfolio() {
  const { pathname } = useLocation();
  const [view, go] = useView();
  const [last, setLast] = useState<string | null>(null);
  useLayoutEffect(() => {
    if (view) setLast(view);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [view]);
  useEffect(() => {
    if (!view) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !(e.target as HTMLElement).closest("[role=dialog]")) go(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view, go]);

  const project = PROJECTS.find((p) => p.id === view);
  const link = (id: string | null) => ({
    href: id ? `${pathname}#${id}` : pathname,
    onClick: (e: MouseEvent) => { if (!plainClick(e)) return; e.preventDefault(); go(id); },
  });
  return (
    <div className={`mn ${view ? "is-open" : ""}`}>
      <header className="mn-bar">
        <a {...link(null)} className="mn-brand">Rafael Bacellar</a>
        <nav aria-label="Main">
          <a {...link(null)} aria-current={view ? undefined : "page"}>Work</a>
          <a {...link(ABOUT)} aria-current={view === ABOUT ? "page" : undefined}>About</a>
          <a href={person.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        </nav>
      </header>
      <main id="main-content">
        {project ? <ProjectView key={project.id} p={project} go={go} /> : view === ABOUT ? <About /> : <Home go={go} last={last} />}
      </main>
    </div>
  );
}
