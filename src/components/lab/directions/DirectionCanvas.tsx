/**
 * Direction C, "Canvas". Ref: rauno.me (the site as a design file). Chrome modelled on a design tool:
 * a toolbar with working Move / Hand / Annotations tools and zoom, a Layers panel of sections and
 * frames, and a Design panel that reads the real size and position of what is selected. Each case is a
 * section; inside it, frames hold stageshow pieces rebuilt from the real screens, annotated with
 * numbered markers and note cards in Rafa's own documentation style. The portfolio's identity stays in
 * the content (Clash Display, Satoshi, the primary blue). Mockup only.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent as RPointerEvent } from "react";
import { ArrowUpRight, ChevronDown, Hand, Hash, LayoutGrid, MessageSquareText, Minus, MousePointer2, Play, Plus, Frame as FrameIcon } from "lucide-react";
import avatar from "@/assets/rafael-bacellar-avatar.jpg";
import inisAvatar from "@/assets/inis-avatar.png";
import { translations } from "@/hooks/useTranslations";
import { experience, person, portrait } from "./shared";
import { Fit, Markers, SECTIONS, type Piece, type Sec } from "./canvasFrames";
import "./figma-canvas.css";

const quote = translations.en.recommendationsItems[0];
type Tool = "move" | "hand";

/* ---------- About section frames (the portfolio's own identity) ---------- */

function CoverFrame() {
  return (
    <div className="fg-about fg-cover">
      <div>
        <p className="fg-avail"><i /> Open to new projects</p>
        <p className="fg-name font-display">Rafael <span>Bacellar</span></p>
        <p className="fg-lede">Senior product designer. I design school and AI products, from research to the shipped screen.</p>
        <div className="fg-cover-row">
          <a href={person.linkedin} target="_blank" rel="noreferrer" className="fg-cta">Let's connect <ArrowUpRight className="size-4" /></a>
          <a href="/resume" className="fg-cta is-ghost">Resume</a>
        </div>
      </div>
      <img src={portrait} alt="Rafael Bacellar" className="fg-portrait" />
    </div>
  );
}
function ExperienceFrame() {
  return (
    <div className="fg-about fg-exp">
      <p className="font-display fg-h">Ten years, six product teams</p>
      <ul>{experience.map((e) => <li key={e.company}><b>{e.company}</b><span>{e.role}</span><em>{e.period}</em></li>)}</ul>
    </div>
  );
}
function CommentFrame() {
  return (
    <div className="fg-about fg-comment">
      <div className="fg-bubble">
        <p className="fg-bubble-h"><img src={inisAvatar} alt="" /> <b>{quote.author}</b></p>
        <p className="fg-bubble-r">{quote.role}</p>
        <p>“Rafael is by far the most creative designer I've ever worked with. He really has the eye for details and ends up spotting flaws no one else does.”</p>
      </div>
    </div>
  );
}

const ABOUT: Sec = {
  id: "about", title: "Rafael Bacellar", facts: "Senior Product Designer · FTD Educação · 10+ years", result: { value: "", label: "", measured: false },
  pieces: [
    { id: "about-cover", name: "Cover", C: CoverFrame, notes: [] },
    { id: "about-exp", name: "Experience", C: ExperienceFrame, notes: [] },
    { id: "about-comment", name: "Comment · Inis Leahy", C: CommentFrame, notes: [] },
  ],
};
const ALL: Sec[] = [ABOUT, ...SECTIONS];
const pieceList = ALL.flatMap((s) => s.pieces.map((p) => ({ sec: s, p })));
const secOf = (id: string) => ALL.find((s) => s.id === id || s.pieces.some((p) => p.id === id))!;

/* ---------- Frame + section ---------- */

type ItemProps = { sel: string; notesOn: boolean; onSelect: (id: string) => void; setRef: (id: string, el: HTMLElement | null) => void };

function FrameItem({ p, start, sel, notesOn, onSelect, setRef }: ItemProps & { p: Piece; start: number }) {
  const anchors = useMemo(() => p.notes.map((n) => n.a), [p.notes]);
  const on = sel === p.id;
  const [size, setSize] = useState("");
  const box = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!on || !box.current) return;
    const el = box.current;
    setSize(`${el.offsetWidth} × ${el.offsetHeight}`);
  }, [on]);
  return (
    <div className="fg-frame-wrap">
      <p className={`fg-label ${on ? "is-on" : ""}`} onClick={(e) => { e.stopPropagation(); onSelect(p.id); }}>
        <FrameIcon className="size-3" /> {p.name}
      </p>
      <div
        ref={(el) => { box.current = el; setRef(p.id, el); }}
        className={`fg-frame ${on ? "is-sel" : ""}`}
        onClick={(e) => { if ((e.target as HTMLElement).closest("a")) return; e.stopPropagation(); onSelect(p.id); }}
      >
        <Fit>
          <p.C />
          {notesOn && p.notes.length > 0 && <Markers anchors={anchors} start={start} />}
        </Fit>
        <span className="fg-sel" aria-hidden="true"><i /><i /><i /><i /><b>{on ? size : ""}</b></span>
      </div>
      {notesOn && p.notes.length > 0 && (
        <div className="fg-notes">
          {p.notes.map((n, i) => (
            <div key={n.t} className="fg-note">
              <p className="fg-note-h"><span className="fg-marker is-static">{start + i}</span><b>{n.t}</b></p>
              <p>{n.d}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SectionItem({ s, ...rest }: ItemProps & { s: Sec }) {
  let n = 1;
  return (
    <section ref={(el) => rest.setRef(s.id, el)} className={`fg-section ${rest.sel === s.id ? "is-sel" : ""}`} onClick={() => rest.onSelect(s.id)} aria-label={s.title}>
      <span className="fg-sec-name"><Hash className="size-3" /> {s.title}</span>
      {s.id !== "about" && (
        <header className="fg-banner">
          <div>
            <p className="fg-banner-t font-display">{s.title}</p>
            <p className="fg-banner-s">{s.facts}</p>
          </div>
          <div className="fg-banner-r">
            {s.result.value && (
              <p className={`fg-result ${s.result.measured ? "" : "is-muted"}`}>
                <b className="font-display">{s.result.value}</b>
                {s.result.measured && <span>{s.result.label}</span>}
              </p>
            )}
            {s.href && <a href={s.href} className="fg-open" onClick={(e) => e.stopPropagation()}>{s.cta} <ArrowUpRight className="size-3.5" /></a>}
          </div>
        </header>
      )}
      <div className="fg-row">
        {s.pieces.map((p) => {
          const start = n;
          n += p.notes.length;
          return <FrameItem key={p.id} p={p} start={start} {...rest} />;
        })}
      </div>
    </section>
  );
}

/* ---------- Workspace ---------- */

export function DirectionCanvas() {
  const [sel, setSel] = useState("about-cover");
  const [tool, setTool] = useState<Tool>("move");
  const [notesOn, setNotesOn] = useState(true);
  const [zoom, setZoom] = useState(0.7);
  const [open, setOpen] = useState<Record<string, boolean>>({ about: true, "meu-arco": true });
  const canvas = useRef<HTMLDivElement>(null);
  const refs = useRef<Record<string, HTMLElement | null>>({});
  const pan = useRef<{ x: number; y: number; l: number; t: number; moved: boolean } | null>(null);
  const [panning, setPanning] = useState(false);
  const [geo, setGeo] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  const setRef = useCallback((id: string, el: HTMLElement | null) => { refs.current[id] = el; }, []);
  const current = secOf(sel);
  const piece = current.pieces.find((p) => p.id === sel);

  const focus = useCallback((id: string, smooth = true) => {
    setSel(id);
    setOpen((o) => ({ ...o, [secOf(id).id]: true }));
    const el = refs.current[id], c = canvas.current;
    if (!el || !c || window.innerWidth < 1024) return;
    const r = el.getBoundingClientRect(), cr = c.getBoundingClientRect();
    const fitsX = r.width < cr.width - 80;
    c.scrollTo({
      left: c.scrollLeft + r.left - cr.left - (fitsX ? (cr.width - r.width) / 2 : 60),
      top: c.scrollTop + r.top - cr.top - 80,
      behavior: smooth ? "smooth" : "auto",
    });
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => focus(sel, false), 120);
    return () => window.clearTimeout(t);
    // re-centre the selection when the zoom changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom]);

  // Real geometry of the selection, in canvas units, measured once layout settles.
  useEffect(() => {
    const t = window.setTimeout(() => {
      const el = refs.current[sel], world = canvas.current?.firstElementChild as HTMLElement | null;
      if (!el || !world) return setGeo(null);
      const r = el.getBoundingClientRect(), wr = world.getBoundingClientRect();
      setGeo({ w: el.offsetWidth, h: el.offsetHeight, x: Math.round((r.left - wr.left) / zoom), y: Math.round((r.top - wr.top) / zoom) });
    }, 450);
    return () => window.clearTimeout(t);
  }, [sel, zoom, notesOn]);

  const onKey = (e: KeyboardEvent) => {
    const k = e.key.toLowerCase();
    if (k === "v") setTool("move");
    if (k === "h") setTool("hand");
    if (k === "c") setNotesOn((v) => !v);
    const i = pieceList.findIndex((x) => x.p.id === sel);
    if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); focus(pieceList[Math.min(pieceList.length - 1, i + 1)].p.id); }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); focus(pieceList[Math.max(0, i - 1)].p.id); }
  };

  const down = (e: RPointerEvent) => {
    if (e.pointerType !== "mouse" || window.innerWidth < 1024) return;
    if (tool === "move" && (e.target as HTMLElement).closest(".fg-frame, a, button, .fg-label")) return;
    const c = canvas.current!;
    pan.current = { x: e.clientX, y: e.clientY, l: c.scrollLeft, t: c.scrollTop, moved: false };
  };
  const move = (e: RPointerEvent) => {
    const p = pan.current;
    if (!p) return;
    if (!p.moved && Math.hypot(e.clientX - p.x, e.clientY - p.y) > 4) { p.moved = true; setPanning(true); }
    canvas.current!.scrollLeft = p.l - (e.clientX - p.x);
    canvas.current!.scrollTop = p.t - (e.clientY - p.y);
  };
  const up = () => { pan.current = null; window.setTimeout(() => setPanning(false), 0); };
  const select = (id: string) => { if (!panning && tool === "move") setSel(id); };

  return (
    <div className="fg" onKeyDown={onKey}>
      <header className="fg-bar">
        <div className="fg-bar-l">
          <span className="fg-menu" aria-hidden="true"><LayoutGrid className="size-4" /></span>
          <div className="fg-tools" role="toolbar" aria-label="Tools">
            <button type="button" aria-pressed={tool === "move"} aria-label="Move tool (V)" title="Move (V)" onClick={() => setTool("move")}><MousePointer2 className="size-4" /></button>
            <button type="button" aria-pressed={tool === "hand"} aria-label="Hand tool (H)" title="Hand (H)" onClick={() => setTool("hand")}><Hand className="size-4" /></button>
            <button type="button" aria-pressed={notesOn} aria-label="Show annotations (C)" title="Annotations (C)" onClick={() => setNotesOn((v) => !v)}><MessageSquareText className="size-4" /></button>
          </div>
        </div>
        <p className="fg-file"><span>Rafael Bacellar /</span> Portfolio 2026 <ChevronDown className="size-3.5" /></p>
        <div className="fg-bar-r">
          <img src={avatar} alt="" className="fg-me" />
          <a href="/play" className="fg-icon-btn" aria-label="Play the portfolio game"><Play className="size-4" /></a>
          <a href={person.linkedin} target="_blank" rel="noreferrer" className="fg-share">Connect</a>
          <div className="fg-zoom">
            <button type="button" aria-label="Zoom out" onClick={() => setZoom((z) => Math.max(0.4, +(z - 0.1).toFixed(1)))}><Minus className="size-3.5" /></button>
            <span aria-live="polite">{Math.round(zoom * 100)}%</span>
            <button type="button" aria-label="Zoom in" onClick={() => setZoom((z) => Math.min(1.2, +(z + 0.1).toFixed(1)))}><Plus className="size-3.5" /></button>
          </div>
        </div>
      </header>

      <div className="fg-work">
        <nav className="fg-panel fg-layers" aria-label="Layers">
          <p className="fg-panel-h">Layers</p>
          <ul>
            {ALL.map((s) => (
              <li key={s.id}>
                <button type="button" className={`fg-layer is-sec ${sel === s.id ? "is-on" : ""}`} aria-expanded={!!open[s.id]} onClick={() => { setOpen((o) => ({ ...o, [s.id]: !o[s.id] })); focus(s.id); }}>
                  <ChevronDown className={`size-3 shrink-0 transition-transform ${open[s.id] ? "" : "-rotate-90"}`} /><Hash className="size-3 shrink-0" /><span>{s.title}</span>
                </button>
                {open[s.id] && (
                  <ul>
                    {s.pieces.map((p) => (
                      <li key={p.id}>
                        <button type="button" className={`fg-layer ${sel === p.id ? "is-on" : ""}`} aria-current={sel === p.id ? "true" : undefined} onClick={() => focus(p.id)}>
                          <FrameIcon className="size-3 shrink-0" /><span>{p.name}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div
          ref={canvas}
          tabIndex={0}
          className={`fg-canvas tool-${tool} ${panning ? "is-panning" : ""}`}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerLeave={up}
          aria-label="Canvas. V selects, H pans, C toggles annotations; arrow keys move between frames."
        >
          <div className="fg-world" style={{ zoom }}>
            {ALL.map((s) => <SectionItem key={s.id} s={s} sel={sel} notesOn={notesOn} onSelect={select} setRef={setRef} />)}
          </div>
        </div>

        <aside className="fg-panel fg-design" aria-label="Design" aria-live="polite">
          <p className="fg-panel-h">{piece ? "Frame" : "Section"}</p>
          <p className="fg-design-name">{piece ? piece.name : current.title}</p>
          {geo && (
            <dl className="fg-geo">
              <div><dt>X</dt><dd>{geo.x}</dd></div><div><dt>Y</dt><dd>{geo.y}</dd></div>
              <div><dt>W</dt><dd>{geo.w}</dd></div><div><dt>H</dt><dd>{geo.h}</dd></div>
            </dl>
          )}
          {piece && piece.notes.length > 0 && (
            <>
              <p className="fg-panel-h mt-5">Annotations</p>
              <ol className="fg-anns">{piece.notes.map((n) => <li key={n.t}><b>{n.t}</b><span>{n.d}</span></li>)}</ol>
            </>
          )}
          {current.id !== "about" ? (
            <>
              <p className="fg-panel-h mt-5">Case</p>
              <p className="fg-case-t font-display">{current.title}</p>
              <p className="fg-case-s">{current.facts}</p>
              {current.result.value && (
                <p className={`fg-case-r ${current.result.measured ? "" : "is-muted"}`}><b className="font-display">{current.result.value}</b>{current.result.measured && <span>{current.result.label}</span>}</p>
              )}
              {current.href && <a href={current.href} className="fg-share fg-share-block">{current.cta} <ArrowUpRight className="size-3.5" /></a>}
            </>
          ) : (
            <>
              <p className="fg-panel-h mt-5">How to read this file</p>
              <ul className="fg-help">
                <li>Each section is a case; each frame rebuilds one strong point of the real product.</li>
                <li>Red numbers follow the part of the screen each note talks about.</li>
                <li>V select · H pan · C annotations · ← → frames</li>
              </ul>
              <button type="button" className="fg-share fg-share-block" onClick={() => focus("arco-alerts")}>Start with Meu Arco <ArrowUpRight className="size-3.5" /></button>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
