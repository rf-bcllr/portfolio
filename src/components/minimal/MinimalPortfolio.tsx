/**
 * The minimal direction (ref: renan.design). One typeface, a dotted ground and a row of covers,
 * each a product screen on a flat colour. A cover opens into its project: the colour becomes the
 * ground of the live stage pieces, with the numbered notes set beside them as plain text.
 */
import { useCallback, useEffect, useLayoutEffect, useMemo, useState, type CSSProperties, type MouseEvent } from "react";
import { flushSync } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { Markers, type Piece } from "@/components/canvas/canvasFrames";
import { person } from "@/components/canvas/shared";
import { PROJECTS, type Project } from "./content";
import { CoverStage, Covers } from "./CoverStage";
import { ResumeView } from "./ResumeView";
import "./minimal.css";

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const RESUME = "resume";
const path = (id: string | null) => (id === RESUME ? "/resume" : id ? `/#${id}` : "/");

type Go = (id: string | null) => void;
type Doc = Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void>; finished: Promise<void> } };

/** A project lives in the hash and the resume at its own address, so links and the back button work. */
function useView(): [string | null, Go] {
  const { hash, pathname } = useLocation();
  const navigate = useNavigate();
  const id = decodeURIComponent(hash.slice(1));
  const view = pathname.startsWith("/resume") ? RESUME : PROJECTS.some((p) => p.id === id) ? id : null;
  const go = useCallback<Go>((next) => {
    const run = () => flushSync(() => navigate(path(next)));
    const doc = document as Doc;
    if (doc.startViewTransition && !reduced()) {
      // A skipped transition (hidden tab, a second click) still changes the view
      const t = doc.startViewTransition(run);
      t.ready.catch(() => undefined);
      t.finished.catch(() => undefined);
    } else run();
  }, [navigate]);
  return [view, go];
}

const plainClick = (e: MouseEvent) => e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;

/* ---------- Project: the live pieces on the cover's colour ---------- */

function PiecePanel({ p, piece, start, hero }: { p: Project; piece: Piece; start: number; hero: boolean }) {
  const anchors = useMemo(() => piece.notes.map((n) => n.a), [piece.notes]);
  const [dead, setDead] = useState(false);
  // Art hosted with the deployed site: without it, the panel steps aside (the first keeps its cover)
  if (dead && !hero) return null;
  return (
    <section className="mn-piece" aria-label={piece.name}>
      <div className={`mn-panel ${p.bleed && !piece.h ? "is-bleed" : ""} ${piece.h ? "is-tall" : ""} ${piece.notes.length ? "" : "is-art"}`} style={{ background: p.ground, viewTransitionName: hero ? "mn-hero" : undefined } as CSSProperties}>
        {dead ? (
          <div className={`mn-still ${p.ratio > 1 ? "is-wide" : ""}`} style={{ ["--ratio" as string]: p.ratio }}><Covers p={p} /></div>
        ) : (
          <div className="mn-fit" data-ss-fill="" style={piece.w ? { maxWidth: Math.min(1040, piece.w * (piece.h ? 780 / piece.h : 1.4)) } : undefined} onErrorCapture={(e) => { if (e.target instanceof HTMLImageElement) setDead(true); }}>
            <piece.C />
            {piece.notes.length > 0 && <Markers anchors={anchors} start={start} />}
          </div>
        )}
      </div>
      {piece.notes.length === 0 && <p className="mn-cap-art">{piece.name}</p>}
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
      <a href={path(next.id)} className="mn-next" onClick={(e) => { if (!plainClick(e)) return; e.preventDefault(); go(next.id); }}>
        <span className="mn-next-t"><span>Next project</span><b>{next.name}</b></span>
        <span className="mn-next-c" style={{ background: next.ground }}><Covers p={next} /></span>
      </a>
    </article>
  );
}

/* ---------- Shell ---------- */

export function MinimalPortfolio() {
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
  useEffect(() => {
    document.title = project ? `${project.name} · Rafael Bacellar` : view === RESUME ? "Resume · Rafael Bacellar" : "Rafael Bacellar, product designer";
  }, [project, view]);
  const link = (id: string | null) => ({
    href: path(id),
    onClick: (e: MouseEvent) => { if (!plainClick(e)) return; e.preventDefault(); go(id); },
  });
  return (
    <div className={`mn ${view ? "is-open" : ""}`}>
      <header className="mn-bar">
        <a {...link(null)} className="mn-brand">rfbcllr</a>
        <nav aria-label="Main">
          <a {...link(null)} aria-current={view ? undefined : "page"}>Work</a>
          <a {...link(RESUME)} aria-current={view === RESUME ? "page" : undefined}>Resume</a>
          <a href={person.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        </nav>
      </header>
      <main id="main-content">
        {project ? <ProjectView key={project.id} p={project} go={go} /> : view === RESUME ? <ResumeView /> : (
          <div className="mn-home"><CoverStage href={path} onOpen={go} last={last} /></div>
        )}
      </main>
    </div>
  );
}
