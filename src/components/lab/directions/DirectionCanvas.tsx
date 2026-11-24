/**
 * Direction C, "Canvas". Ref: rauno.me (the site as artboards on a canvas), dressed in the
 * portfolio's own look: Clash Display + Satoshi, the primary blue, 2px ink borders with the offset
 * shadow, the FigJam dot grid, the hero title's selection handles and Figma-comment pins. Removed
 * on purpose: stickers, emoji, pinging dots, pulsing buttons, dashed tilted outlines, tiny tracked
 * caps and generic icon cards. Every case holds its live stageshow rebuild with pinned notes.
 * Mockup only; theme tokens, so it follows light and dark.
 */
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { ArrowUpRight, Minus, Play, Plus } from "lucide-react";
import avatar from "@/assets/rafael-bacellar-avatar.jpg";
import inisAvatar from "@/assets/inis-avatar.png";
import { translations } from "@/hooks/useTranslations";
import { experience, outcomeOf, person, portrait, projectHref, projects, shortTitle, type Project } from "./shared";
import { FRAMES, Fit, Pins } from "./canvasFrames";
import "./site-canvas.css";

const quote = translations.en.recommendationsItems[0];

const ink = "border-2 border-foreground";
const btn =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-[transform,background-color,color] duration-150 active:translate-y-px";

function ProjectFrame({ p, index }: { p: Project; index: number }) {
  const f = FRAMES[p.slug];
  const o = outcomeOf(p);
  return (
    <article className={`cv-frame ${ink} rounded-[22px] bg-card p-8 text-card-foreground`} aria-labelledby={`cv-${p.slug}`}>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {String(index).padStart(2, "0")} · {p.category}
          </p>
          <h3 id={`cv-${p.slug}`} className="mt-1 font-display text-[52px] font-bold leading-[0.95] tracking-[-0.035em]">
            {shortTitle[p.slug]}
          </h3>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[p.company.replace("isaac (Arco Educação)", "isaac · Arco"), String(p.year)].map((c) => (
            <span key={c} className="rounded-full border border-border px-3 py-1 text-sm">
              {c}
            </span>
          ))}
        </div>
      </header>

      <div className="mt-7 grid grid-cols-[260px_minmax(0,1fr)] gap-8 max-lg:grid-cols-1">
        <div className="flex flex-col gap-5">
          <div>
            <p className={`font-display font-bold leading-none tracking-[-0.04em] ${o.measured ? "text-[64px]" : "text-[40px] text-muted-foreground"}`}>{o.value}</p>
            <p className="mt-2 text-sm text-muted-foreground">{o.measured ? o.label : "Impact to be measured"}</p>
          </div>
          <p className="border-t-2 border-foreground pt-4 font-display text-xl font-semibold leading-tight tracking-[-0.02em]" lang="pt-BR">
            {f.pt}
          </p>
          <ol className="flex flex-col gap-3">
            {f.notes.map(([text], n) => (
              <li key={n} className="grid grid-cols-[26px_1fr] gap-2.5 text-[15px] leading-snug">
                <span className="cv-pin cv-pin--static">{n + 1}</span>
                {text}
              </li>
            ))}
          </ol>
        </div>
        <figure className="m-0 rounded-2xl border border-border bg-secondary p-6 max-lg:order-first max-lg:p-3">
          <Fit>
            <f.Fragment />
            <Pins anchors={f.notes.map(([, a]) => a)} />
          </Fit>
        </figure>
      </div>

      <footer className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
        <div className="flex flex-wrap gap-1.5">
          {p.chips.filter((c) => c !== "In progress").map((c) => (
            <span key={c} className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground">
              {c}
            </span>
          ))}
        </div>
        <a href={projectHref(p)} className={`${btn} bg-foreground text-background hover:bg-primary hover:text-primary-foreground`}>
          {p.playInsteadOfOutcome ? "Play the game" : "Open the case study"} <ArrowUpRight className="size-4" />
        </a>
      </footer>
    </article>
  );
}

function HeroFrame() {
  const facts = ["meu-arco", "students-transportation", "lesson-plan-tool"].map((s) => projects.find((p) => p.slug === s)!);
  return (
    <article className={`cv-frame ${ink} rounded-[22px] bg-card p-8 text-card-foreground`} aria-labelledby="cv-hero">
      <div className="grid grid-cols-[minmax(0,1fr)_300px] gap-10 max-lg:grid-cols-1">
        <div className="flex flex-col">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="size-2 rounded-full bg-[hsl(var(--tag-green))]" aria-hidden="true" /> Open to new projects
          </p>
          <h1 id="cv-hero" className="mt-4 font-display text-[84px] font-bold leading-[0.9] tracking-[-0.045em] max-lg:text-[52px]">
            Rafael <span className="text-primary">Bacellar</span>
          </h1>
          <p className="mt-5 max-w-[30ch] text-[22px] leading-snug">
            Senior product designer. I design school and AI products, from research to the shipped screen.
          </p>
          <dl className="mt-8 grid grid-cols-3 border-y-2 border-foreground">
            {facts.map((p, i) => {
              const o = outcomeOf(p);
              return (
                <div key={p.slug} className={`py-4 ${i ? "border-l-2 border-foreground pl-4" : "pr-4"}`}>
                  <dt className="font-display text-[40px] font-bold leading-none tracking-[-0.04em] max-lg:text-[28px]">{o.value}</dt>
                  <dd className="mt-1.5 text-sm text-muted-foreground">{shortTitle[p.slug]}</dd>
                </div>
              );
            })}
          </dl>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={person.linkedin} target="_blank" rel="noreferrer" className={`${btn} bg-primary text-primary-foreground hover:bg-foreground hover:text-background`}>
              Let's connect <ArrowUpRight className="size-4" />
            </a>
            <a href="/resume" className={`${btn} border-2 border-foreground hover:bg-foreground hover:text-background`}>
              Resume
            </a>
          </div>
        </div>
        <div className="relative">
          <div className={`${ink} overflow-hidden rounded-2xl shadow-[8px_8px_0_0_hsl(var(--foreground))]`}>
            <img src={portrait} alt="Rafael Bacellar" className="aspect-[4/5] w-full object-cover grayscale transition duration-500 hover:grayscale-0" />
          </div>
          {/* A real recommendation as a design-tool comment */}
          <figure className="absolute -bottom-8 -left-16 w-[250px] rounded-2xl rounded-bl-none bg-card p-3 text-card-foreground shadow-[0_0_0.5px_0_rgba(0,0,0,0.18),0_3px_8px_0_rgba(0,0,0,0.1),0_1px_3px_0_rgba(0,0,0,0.1)] max-lg:static max-lg:mt-4 max-lg:w-auto">
            <figcaption className="flex items-center gap-2 text-sm font-semibold">
              <img src={inisAvatar} alt="" className="size-6 rounded-full object-cover" />
              {quote.author}
            </figcaption>
            <blockquote className="mt-1.5 text-sm leading-snug">“By far the most creative designer I've ever worked with.”</blockquote>
          </figure>
        </div>
      </div>
      <ul className="mt-12 grid grid-cols-2 gap-x-8 border-t border-border pt-5 text-sm max-lg:grid-cols-1">
        {experience.map((e) => (
          <li key={e.company} className="flex justify-between gap-4 border-b border-border py-2">
            <span>
              <b className="font-semibold">{e.company}</b> <span className="text-muted-foreground">· {e.role}</span>
            </span>
            <span className="tabular-nums text-muted-foreground">{e.from}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

export function DirectionCanvas() {
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
    // Centre in the free strip between the floating Frames (left) and Inspector (right) panels.
    const L = 288, R = 332, free = cr.width - L - R;
    c.scrollTo({ left: c.scrollLeft + r.left - cr.left - L - Math.max(0, (free - r.width) / 2), top: c.scrollTop + r.top - cr.top - 96, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => focus(sel), 60);
    return () => window.clearTimeout(t);
    // re-centre the selection when the zoom changes
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

  const size = (id: string) => {
    const el = items.current[id]?.querySelector(".cv-frame") as HTMLElement | null;
    return el ? `${el.offsetWidth} × ${el.offsetHeight}` : "";
  };

  return (
    <div className="cv relative bg-background font-sans text-foreground">
      {/* Floating toolbar, the site nav's pill */}
      <header className="cv-toolbar sticky top-[56px] z-30 mx-auto mt-3 flex h-14 w-fit max-w-[calc(100%-24px)] items-center gap-2 rounded-full border-2 border-foreground bg-card/90 px-2 shadow-[4px_4px_0_0_hsl(var(--foreground))] backdrop-blur-xl">
        <span className="flex items-center gap-2.5 pr-2">
          <img src={avatar} alt="" className="size-9 rounded-full border border-border object-cover" />
          <span className="font-bold tracking-tight">rfbcllr.</span>
          <span className="hidden text-sm text-muted-foreground md:inline">/ Portfolio 2026</span>
        </span>
        <span className="hidden h-6 w-px bg-border lg:block" />
        <div className="hidden items-center lg:flex">
          <button type="button" aria-label="Zoom out" onClick={() => setZoom((z) => Math.max(0.4, +(z - 0.1).toFixed(1)))} className="grid size-9 place-items-center rounded-full hover:bg-secondary">
            <Minus className="size-4" />
          </button>
          <span className="w-12 text-center text-sm tabular-nums" aria-live="polite">{Math.round(zoom * 100)}%</span>
          <button type="button" aria-label="Zoom in" onClick={() => setZoom((z) => Math.min(1, +(z + 0.1).toFixed(1)))} className="grid size-9 place-items-center rounded-full hover:bg-secondary">
            <Plus className="size-4" />
          </button>
        </div>
        <a href="/play" className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-85">
          <Play className="size-3.5" /> Play
        </a>
        <a href={person.linkedin} target="_blank" rel="noreferrer" className="hidden h-9 items-center rounded-full border border-border px-4 text-sm font-semibold hover:border-primary hover:bg-primary hover:text-primary-foreground sm:inline-flex">
          Let's connect
        </a>
      </header>

      <div className="cv-work">
        {/* Layers */}
        <nav aria-label="Frames" className={`cv-panel cv-layers ${ink} rounded-[22px] bg-card p-2`}>
          <p className="px-3 pb-1 pt-2 text-sm font-semibold">Frames</p>
          {ids.map((id, i) => {
            const p = projects.find((x) => x.slug === id);
            const on = sel === id;
            return (
              <button
                key={id}
                type="button"
                aria-current={on ? "true" : undefined}
                onClick={() => focus(id)}
                className={`flex min-h-10 w-full items-center gap-3 rounded-full px-3 text-left text-sm transition-colors ${on ? "bg-foreground text-background" : "hover:bg-secondary"}`}
              >
                <span className={`w-5 tabular-nums ${on ? "opacity-70" : "text-muted-foreground"}`}>{String(i).padStart(2, "0")}</span>
                <span className="min-w-0 flex-1 truncate font-medium">{p ? shortTitle[p.slug] : "Rafael Bacellar"}</span>
                <span className={`tabular-nums ${on ? "opacity-70" : "text-muted-foreground"}`}>{p?.year ?? ""}</span>
              </button>
            );
          })}
        </nav>

        {/* Canvas */}
        <div
          ref={canvas}
          tabIndex={0}
          onKeyDown={onKey}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerLeave={up}
          aria-label="Canvas. Drag to pan; arrow keys move between frames."
          className={`cv-canvas figjam-grid ${panning ? "is-panning" : ""}`}
        >
          <div className="cv-world" style={{ zoom }}>
            {ids.map((id, i) => {
              const p = projects.find((x) => x.slug === id);
              const on = sel === id;
              return (
                <section
                  key={id}
                  ref={(el) => (items.current[id] = el)}
                  className="cv-item"
                  data-on={on ? "" : undefined}
                  onClickCapture={(e) => {
                    if (panning) { e.preventDefault(); e.stopPropagation(); }
                    else if (!(e.target as HTMLElement).closest("a")) setSel(id);
                  }}
                >
                  <p className={`mb-3 flex justify-between text-[15px] ${on ? "font-semibold text-primary" : "text-muted-foreground"}`}>
                    <span>{p ? shortTitle[p.slug] : "Cover"}</span>
                    <span>{p ? p.company : ""}</span>
                  </p>
                  <div className="relative">
                    {p ? <ProjectFrame p={p} index={i} /> : <HeroFrame />}
                    <span className="cv-select" aria-hidden="true"><i /><i /><i /><i /><b>{on ? size(id) : ""}</b></span>
                  </div>
                </section>
              );
            })}
          </div>
        </div>

        {/* Inspector */}
        <aside aria-label="Inspector" aria-live="polite" className={`cv-panel cv-inspect ${ink} rounded-[22px] bg-card p-5`}>
          {current ? (
            <>
              <p className="text-sm text-muted-foreground">Frame {String(ids.indexOf(sel)).padStart(2, "0")} · {current.company}</p>
              <p className="mt-1 font-display text-[34px] font-bold leading-[0.95] tracking-[-0.035em]">{shortTitle[current.slug]}</p>
              <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <div><dt className="text-muted-foreground">Year</dt><dd className="font-medium">{current.year}</dd></div>
                <div><dt className="text-muted-foreground">Time</dt><dd className="font-medium">{current.durationDisplay === "TBD" ? "Ongoing" : current.durationDisplay}</dd></div>
                <div className="col-span-2"><dt className="text-muted-foreground">Role</dt><dd className="font-medium">{current.roleDisplay}</dd></div>
              </dl>
              <div className="mt-5 border-t-2 border-foreground pt-4">
                <p className={`font-display font-bold leading-none tracking-[-0.04em] ${outcomeOf(current).measured ? "text-[48px]" : "text-[30px] text-muted-foreground"}`}>{outcomeOf(current).value}</p>
                <p className="mt-1.5 text-sm text-muted-foreground">{outcomeOf(current).measured ? outcomeOf(current).label : "Impact to be measured"}</p>
              </div>
              <ul className="mt-4 flex flex-col gap-1.5 text-sm">
                {current.outcomeHighlights.map((h) => (
                  <li key={h} className="flex gap-2"><span className="text-primary" aria-hidden="true">—</span>{h.charAt(0) + h.slice(1).toLowerCase()}</li>
                ))}
              </ul>
              <a href={projectHref(current)} className={`${btn} mt-6 w-full bg-foreground text-background hover:bg-primary hover:text-primary-foreground`}>
                {current.playInsteadOfOutcome ? "Play the game" : "Open the case study"} <ArrowUpRight className="size-4" />
              </a>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">Frame 00 · Cover</p>
              <p className="mt-1 font-display text-[34px] font-bold leading-[0.95] tracking-[-0.035em]">Nine cases, working</p>
              <p className="mt-3 text-sm leading-relaxed">Each frame holds a live rebuild of the real product. The numbered pins follow the part of the screen each note talks about.</p>
              <ul className="mt-4 flex flex-col gap-1.5 text-sm text-muted-foreground">
                <li>Drag the canvas to move around</li>
                <li>← → to go frame by frame</li>
                <li>Pick a frame from the list to jump</li>
              </ul>
              <button type="button" onClick={() => focus(ids[1])} className={`${btn} mt-6 w-full bg-foreground text-background hover:bg-primary hover:text-primary-foreground`}>
                Start with Meu Arco <ArrowUpRight className="size-4" />
              </button>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
