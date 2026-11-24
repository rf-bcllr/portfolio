/**
 * Direction C, "Canvas". Reference: rauno.me (the site as a row of labelled artboards on a
 * grey canvas you move through sideways). Reinterpreted as a design-tool workspace: layers on
 * the left, artboards in the middle, an inspector on the right with the case facts.
 * Warm grey canvas, white panels, one selection blue. Mockup only.
 */
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowUpRight, Minus, Play, Plus } from "lucide-react";
import avatar from "@/assets/rafael-bacellar-avatar.jpg";
import inisAvatar from "@/assets/inis-avatar.png";
import { experience, Media, outcomeOf, person, portrait, projectHref, projects, shortTitle, type Project } from "./shared";

const C = {
  canvas: "#E8E6E0",
  dot: "rgba(20,20,18,0.13)",
  panel: "#FFFFFF",
  ink: "#141412",
  muted: "#5E5D58",
  line: "#E4E2DC",
  select: "#1F6FEB",
};

const display = { fontFamily: '"Bricolage Grotesque", ui-sans-serif, system-ui, sans-serif' };
const ui = { fontFamily: '"JetBrains Mono", ui-monospace, monospace' };

type FrameId = "hello" | Project["slug"];

const dims = (p: Project) => {
  const m = p.mediaPresentation.aspect.match(/\[(\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)\]/);
  if (p.mediaPresentation.frame === "phone") return "390 × 844";
  if (!m) return "1440 × 900";
  const [w, h] = [Number(m[1]), Number(m[2])];
  return w > 100 ? `${w} × ${h}` : `${Math.round(1440)} × ${Math.round((1440 * h) / w)}`;
};

export function DirectionCanvas() {
  const [selected, setSelected] = useState<FrameId>("hello");
  const [zoom, setZoom] = useState(1);
  const refs = useRef<Record<string, HTMLDivElement | null>>({});
  const order: FrameId[] = ["hello", ...projects.map((p) => p.slug)];
  const current = projects.find((p) => p.slug === selected);

  useEffect(() => {
    refs.current[selected]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [selected, zoom]);

  const onKey = (e: KeyboardEvent) => {
    const i = order.indexOf(selected);
    if (e.key === "ArrowRight" && i < order.length - 1) {
      e.preventDefault();
      setSelected(order[i + 1]);
    }
    if (e.key === "ArrowLeft" && i > 0) {
      e.preventDefault();
      setSelected(order[i - 1]);
    }
  };

  const handles = (
    <>
      {["-left-[5px] -top-[5px]", "-right-[5px] -top-[5px]", "-bottom-[5px] -left-[5px]", "-bottom-[5px] -right-[5px]"].map((pos) => (
        <span key={pos} aria-hidden="true" className={`absolute ${pos} size-[9px] border bg-white`} style={{ borderColor: C.select }} />
      ))}
    </>
  );

  const frameShell = ({ id, label, size, width, children }: { id: FrameId; label: string; size: string; width: number; children: React.ReactNode }) => {
    const on = selected === id;
    return (
      <div key={id} ref={(el) => (refs.current[id] = el)} className="shrink-0" style={{ width }}>
        <button
          type="button"
          onClick={() => setSelected(id)}
          className="mb-2 block max-w-full truncate text-left text-[12px]"
          style={{ ...ui, color: on ? C.select : C.muted }}
        >
          {label}
        </button>
        <div
          role="button"
          tabIndex={-1}
          onClick={() => setSelected(id)}
          className="relative cursor-default bg-white transition-shadow hover:shadow-[0_0_0_1px_rgba(31,111,235,0.45)]"
          style={{ boxShadow: on ? `0 0 0 1.5px ${C.select}` : undefined }}
        >
          {children}
          {on && handles}
        </div>
        <div className="mt-2 flex justify-center" aria-hidden="true">
          <span className="rounded-[3px] px-1.5 py-0.5 text-[11px] text-white transition-opacity" style={{ ...ui, background: C.select, opacity: on ? 1 : 0 }}>
            {size}
          </span>
        </div>
      </div>
    );
  };

  const HelloFrame = (
    <div className="relative grid h-[460px] grid-cols-[1fr_200px] gap-8 p-10" style={{ color: C.ink }}>
      <div className="flex flex-col justify-between">
        <p className="text-[13px]" style={{ ...ui, color: C.muted }}>
          {person.role}
        </p>
        <div>
          <h1 className="text-[64px] font-extrabold leading-[0.92] tracking-[-0.04em]" style={display}>
            Hi, I'm Rafa.
          </h1>
          <p className="mt-5 max-w-[30ch] text-[19px] leading-[1.4]" style={display}>
            I design school and AI products, from research to the shipped screen. Ten years in, now at {person.now}.
          </p>
        </div>
      </div>
      <img src={portrait} alt="Rafael Bacellar" className="h-full w-full object-cover grayscale" />
      {/* Comment pin, design-tool style */}
      <figure className="absolute -bottom-10 left-[46%] flex w-[300px] gap-2.5 rounded-[14px] rounded-bl-[3px] bg-white p-3 shadow-[0_10px_30px_-12px_rgba(20,20,18,0.35)] ring-1 ring-black/5">
        <img src={inisAvatar} alt="" className="size-7 shrink-0 rounded-full object-cover" />
        <div>
          <figcaption className="text-[12px] font-semibold" style={display}>
            Inis Leahy <span className="font-normal" style={{ color: C.muted }}>· Senior Product Designer, Udemy</span>
          </figcaption>
          <blockquote className="mt-1 text-[13px] leading-snug" style={display}>
            “By far the most creative designer I've ever worked with.”
          </blockquote>
        </div>
      </figure>
    </div>
  );

  const projectFrame = (p: Project) => {
    const phone = p.mediaPresentation.frame === "phone";
    return (
      frameShell({
        id: p.slug,
        label: `${shortTitle[p.slug]} — ${p.company}`,
        size: dims(p),
        width: phone ? 260 : 600,
        children: <Media project={p} className={`block w-full ${phone ? "aspect-[9/18.2]" : "aspect-[16/10]"} object-cover`} />,
      })
    );
  };

  const Label = ({ children }: { children: React.ReactNode }) => (
    <p className="mb-2 text-[11px] uppercase tracking-[0.06em]" style={{ ...ui, color: C.muted }}>
      {children}
    </p>
  );

  const inspector = () => {
    if (!current) {
      return (
        <div className="flex flex-col gap-6">
          <div>
            <Label>Profile</Label>
            <p className="text-[18px] font-bold tracking-[-0.02em]" style={display}>
              {person.name}
            </p>
            <p className="text-[13px]" style={{ color: C.muted }}>
              {person.nowDetail}.
            </p>
          </div>
          <div>
            <Label>Experience</Label>
            <ul className="text-[13px]">
              {experience.map((e) => (
                <li key={e.company} className="flex justify-between gap-3 border-t py-2" style={{ borderColor: C.line }}>
                  <span className="truncate">{e.company}</span>
                  <span style={{ ...ui, color: C.muted }} className="text-[12px]">
                    {e.from}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Label>Skills</Label>
            <div className="flex flex-wrap gap-1.5">
              {person.skills.map((s) => (
                <span key={s} className="rounded-[5px] px-2 py-1 text-[12px]" style={{ background: C.canvas }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
          <p className="text-[12px]" style={{ ...ui, color: C.muted }}>
            Use ← → to move between frames.
          </p>
        </div>
      );
    }
    const o = outcomeOf(current);
    return (
      <div className="flex flex-col gap-6">
        <div>
          <Label>Frame</Label>
          <p className="text-[20px] font-bold leading-tight tracking-[-0.02em]" style={display}>
            {shortTitle[current.slug]}
          </p>
          <p className="mt-1 text-[13px]" style={{ color: C.muted }}>
            {current.category}
          </p>
        </div>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-[13px]">
          {[
            ["Company", current.company],
            ["Year", String(current.year)],
            ["Role", current.roleDisplay],
            ["Time", current.durationDisplay === "TBD" ? "Ongoing" : current.durationDisplay],
          ].map(([k, v]) => (
            <div key={k} className="min-w-0">
              <dt className="text-[11px] uppercase tracking-[0.06em]" style={{ ...ui, color: C.muted }}>
                {k}
              </dt>
              <dd className="mt-0.5">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="border-t pt-5" style={{ borderColor: C.line }}>
          <Label>Result</Label>
          <p className="text-[40px] font-extrabold leading-none tracking-[-0.04em]" style={{ ...display, color: o.measured ? C.ink : C.muted }}>
            {o.value}
          </p>
          {o.measured && <p className="mt-1.5 text-[13px]" style={{ color: C.muted }}>{o.label}</p>}
          <ul className="mt-4 flex flex-col gap-1.5 text-[13px]">
            {current.outcomeHighlights.map((h) => (
              <li key={h} className="flex gap-2">
                <span aria-hidden="true" style={{ color: C.select }}>
                  —
                </span>
                <span className="first-letter:uppercase">{h.charAt(0) + h.slice(1).toLowerCase()}</span>
              </li>
            ))}
          </ul>
        </div>
        <a
          href={projectHref(current)}
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg text-[14px] font-medium text-white transition active:scale-[0.98]"
          style={{ background: C.select, ...display }}
        >
          {current.playInsteadOfOutcome ? "Play the game" : "Open the case study"} <ArrowUpRight className="size-4" />
        </a>
      </div>
    );
  };

  return (
    <div className="antialiased" style={{ background: C.canvas, color: C.ink, ...display }}>
      {/* Toolbar */}
      <header className="sticky top-11 z-20 flex h-12 items-center justify-between gap-4 border-b px-3" style={{ background: C.panel, borderColor: C.line }}>
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-8 place-items-center rounded-md text-[13px] font-extrabold text-white" style={{ background: C.ink }}>
            rb
          </span>
          <p className="truncate text-[13px]" style={ui}>
            <span style={{ color: C.muted }}>Rafael Bacellar / </span>Portfolio 2026
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="hidden items-center rounded-lg border lg:flex" style={{ borderColor: C.line }}>
            <button type="button" aria-label="Zoom out" onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.25).toFixed(2)))} className="grid size-9 place-items-center rounded-l-lg hover:bg-black/5">
              <Minus className="size-3.5" />
            </button>
            <span className="w-12 text-center text-[12px]" style={ui} aria-live="polite">
              {Math.round(zoom * 100)}%
            </span>
            <button type="button" aria-label="Zoom in" onClick={() => setZoom((z) => Math.min(1.25, +(z + 0.25).toFixed(2)))} className="grid size-9 place-items-center rounded-r-lg hover:bg-black/5">
              <Plus className="size-3.5" />
            </button>
          </div>
          <a href="/play" aria-label="Play the portfolio game" className="grid size-9 place-items-center rounded-lg hover:bg-black/5">
            <Play className="size-4" />
          </a>
          <img src={avatar} alt="" className="mx-1 size-7 rounded-full object-cover ring-2 ring-white" />
          <a href={person.linkedin} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center rounded-lg px-3.5 text-[13px] font-medium text-white transition active:scale-[0.98]" style={{ background: C.select }}>
            Connect
          </a>
        </div>
      </header>

      {/* Desktop workspace */}
      <div className="hidden h-[calc(100dvh-44px-48px)] grid-cols-[232px_1fr_288px] lg:grid">
        <nav aria-label="Layers" className="overflow-y-auto border-r py-3" style={{ background: C.panel, borderColor: C.line }}>
          <p className="px-4 pb-2 text-[11px] uppercase tracking-[0.06em]" style={{ ...ui, color: C.muted }}>
            Layers
          </p>
          <ul className="text-[13px]">
            {order.map((id) => {
              const p = projects.find((x) => x.slug === id);
              const on = selected === id;
              return (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => setSelected(id)}
                    aria-current={on ? "true" : undefined}
                    className="flex h-9 w-full items-center gap-2.5 px-4 text-left transition-colors hover:bg-black/[0.04]"
                    style={{ background: on ? "rgba(31,111,235,0.1)" : undefined }}
                  >
                    <span aria-hidden="true" className="text-[11px]" style={{ ...ui, color: on ? C.select : C.muted }}>
                      #
                    </span>
                    <span className="truncate">{p ? shortTitle[p.slug] : "Hello"}</span>
                    {p && <span className="ml-auto text-[11px]" style={{ ...ui, color: C.muted }}>{p.year}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div
          tabIndex={0}
          onKeyDown={onKey}
          aria-label="Canvas. Use left and right arrow keys to move between frames."
          className="overflow-auto outline-none"
          style={{ backgroundImage: `radial-gradient(${C.dot} 1px, transparent 1px)`, backgroundSize: "22px 22px" }}
        >
          <div className="flex min-h-full w-max items-center gap-24 px-24 py-16" style={{ zoom }}>
            {frameShell({ id: "hello", label: "Hello", size: "1440 × 900", width: 720, children: HelloFrame })}
            {projects.map(projectFrame)}
          </div>
        </div>

        <aside aria-label="Inspector" className="overflow-y-auto border-l p-5" style={{ background: C.panel, borderColor: C.line }}>
          {inspector()}
        </aside>
      </div>

      {/* Phone and tablet: frames stack, facts sit under each */}
      <div className="flex flex-col gap-12 px-5 py-10 lg:hidden" style={{ backgroundImage: `radial-gradient(${C.dot} 1px, transparent 1px)`, backgroundSize: "22px 22px" }}>
        <div className="bg-white p-6">
          <p className="text-[12px]" style={{ ...ui, color: C.muted }}>
            {person.role}
          </p>
          <h1 className="mt-6 text-[48px] font-extrabold leading-[0.92] tracking-[-0.04em]">Hi, I'm Rafa.</h1>
          <p className="mt-4 text-[17px] leading-[1.45]">I design school and AI products, from research to the shipped screen. Ten years in, now at {person.now}.</p>
          <img src={portrait} alt="Rafael Bacellar" className="mt-6 aspect-square w-full object-cover grayscale" />
        </div>
        {projects.map((p) => {
          const o = outcomeOf(p);
          return (
            <a key={p.slug} href={projectHref(p)} className="block">
              <p className="mb-2 text-[12px]" style={{ ...ui, color: C.muted }}>
                {shortTitle[p.slug]} — {p.company}
              </p>
              <div className="bg-white">
                <Media project={p} className="block aspect-[16/10] w-full object-cover" />
              </div>
              <p className="mt-3 flex items-baseline justify-between gap-3">
                <span className="text-[26px] font-extrabold tracking-[-0.03em]" style={{ color: o.measured ? C.ink : C.muted }}>
                  {o.value}
                </span>
                <span className="text-right text-[13px]" style={{ color: C.muted }}>
                  {o.measured ? o.label : p.year}
                </span>
              </p>
            </a>
          );
        })}
      </div>
    </div>
  );
}
