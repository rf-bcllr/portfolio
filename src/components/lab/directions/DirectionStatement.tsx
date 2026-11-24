/**
 * Direction A, "Statement & index". Reference: ryo.lu (one big sentence with underlined
 * links, mono caps metadata) and lynnandtonic.com (the work as a table of contents).
 * Paper ground, ink type, one cobalt accent. Mockup only (see /lab/directions).
 */
import { useRef, useState, type MouseEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { companies, experience, Media, outcomeOf, person, portrait, projectHref, projects, shortTitle, type Project } from "./shared";

const C = {
  paper: "#F1EFE9",
  ink: "#151514",
  muted: "#5F5C55",
  line: "rgba(21,21,20,0.14)",
  cobalt: "#1D4ED8",
};

const display = { fontFamily: '"Schibsted Grotesk", ui-sans-serif, system-ui, sans-serif' };
const mono = { fontFamily: '"IBM Plex Mono", ui-monospace, monospace' };

const byYear = [...projects].sort((a, b) => b.year - a.year);

export function DirectionStatement() {
  const [hovered, setHovered] = useState<Project | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const frame = useRef<number>();

  const track = (e: MouseEvent) => {
    const { clientX, clientY } = e;
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => setPos({ x: clientX, y: clientY }));
  };

  const arco = projects.find((p) => p.slug === "meu-arco")!;
  const cheguei = projects.find((p) => p.slug === "students-transportation")!;

  const inlineCase = (p: Project, children: string) => (
    <a
      href={projectHref(p)}
      onMouseEnter={() => setHovered(p)}
      onMouseLeave={() => setHovered(null)}
      onFocus={() => setHovered(p)}
      onBlur={() => setHovered(null)}
      className="underline decoration-2 underline-offset-[0.18em] transition-colors hover:text-[var(--cobalt)] focus-visible:outline-2 focus-visible:outline-offset-4"
      style={{ textDecorationColor: C.cobalt }}
    >
      {children}
    </a>
  );

  return (
    <div
      onMouseMove={track}
      className="min-h-dvh antialiased"
      style={{ background: C.paper, color: C.ink, ...display, ["--cobalt" as string]: C.cobalt }}
    >
      {/* Header */}
      <header className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-6 md:px-10">
        <a href="/" className="text-[15px] font-semibold tracking-[-0.01em]">
          {person.name}
        </a>
        <nav aria-label="Primary" className="flex gap-5 text-[12px] uppercase tracking-[0.08em] md:gap-8" style={mono}>
          {[
            ["Work", "#a-work"],
            ["Resume", "/resume"],
            ["Play", "/play"],
          ].map(([label, href]) => (
            <a key={label} href={href} className="py-3 underline-offset-4 hover:underline">
              {label}
            </a>
          ))}
          <a href={person.linkedin} target="_blank" rel="noreferrer" className="hidden py-3 underline-offset-4 hover:underline sm:inline">
            LinkedIn ↗
          </a>
        </nav>
      </header>

      {/* Hero: one sentence, the work linked inline */}
      <section className="mx-auto grid min-h-[calc(100dvh-64px-44px)] max-w-[1240px] grid-rows-[1fr_auto] px-6 pb-8 md:px-10">
        <div className="grid items-center gap-10 py-10 lg:grid-cols-[1fr_auto]">
          <div>
            <h1 className="max-w-[15ch] text-[clamp(44px,6.6vw,104px)] font-medium leading-[0.98] tracking-[-0.035em]">
              Rafa designs school and AI products in Brazil.
            </h1>
            <p className="mt-8 max-w-[34ch] text-[clamp(20px,2.1vw,30px)] font-normal leading-[1.25] tracking-[-0.02em]" style={{ color: C.muted }}>
              Lately: {inlineCase(arco, "Meu Arco")}, an app that went from 2.9 to 4.8 stars, and{" "}
              {inlineCase(cheguei, "Cheguei")}, which onboarded 12k+ students in six months.
            </p>
          </div>
          <figure className="group relative mx-auto size-[min(68vw,360px)] shrink-0 lg:size-[clamp(280px,28vw,400px)]">
            <img
              src={portrait}
              alt="Rafael Bacellar"
              className="size-full rounded-full object-cover grayscale transition duration-500 group-hover:grayscale-0"
            />
            <span
              className="absolute bottom-[8%] left-[2%] flex items-center gap-2 rounded-full px-3.5 py-2 text-[11px] uppercase tracking-[0.08em] text-white"
              style={{ ...mono, background: C.cobalt }}
            >
              <span className="size-1.5 rounded-full bg-white" aria-hidden="true" />
              Open to new projects
            </span>
          </figure>
        </div>

        <div
          className="grid gap-3 border-t pt-4 text-[12px] uppercase tracking-[0.08em] sm:grid-cols-3"
          style={{ ...mono, borderColor: C.line, color: C.muted }}
        >
          <p>
            Now — {person.role}, {person.now}
          </p>
          <p className="sm:text-center">10+ years · edtech, fintech, health, AI</p>
          <a href="#a-work" className="sm:text-right" style={{ color: C.ink }}>
            Nine cases below ↓
          </a>
        </div>
      </section>

      {/* Work: a table of contents, preview follows the pointer */}
      <section id="a-work" className="mx-auto max-w-[1240px] scroll-mt-12 px-6 py-24 md:px-10">
        <div className="mb-10 flex items-baseline justify-between gap-6">
          <h2 className="text-[clamp(32px,4vw,56px)] font-medium leading-none tracking-[-0.04em]">Selected work</h2>
          <span className="text-[12px] uppercase tracking-[0.08em]" style={{ ...mono, color: C.muted }}>
            2023 — 2026
          </span>
        </div>

        <div
          className="hidden grid-cols-[56px_minmax(0,1.5fr)_minmax(0,1fr)_72px_minmax(0,1.1fr)] gap-6 border-b pb-3 text-[11px] uppercase tracking-[0.08em] md:grid"
          style={{ ...mono, color: C.muted, borderColor: C.line }}
        >
          <span>No.</span>
          <span>Project</span>
          <span>Company</span>
          <span>Year</span>
          <span>Result</span>
        </div>

        <ol>
          {byYear.map((p, i) => {
            const o = outcomeOf(p);
            return (
              <li key={p.slug} className="border-b" style={{ borderColor: C.line }}>
                <a
                  href={projectHref(p)}
                  onMouseEnter={() => setHovered(p)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(p)}
                  onBlur={() => setHovered(null)}
                  className="group grid grid-cols-[72px_minmax(0,1fr)] items-center gap-x-4 gap-y-1 py-5 transition-colors md:grid-cols-[56px_minmax(0,1.5fr)_minmax(0,1fr)_72px_minmax(0,1.1fr)] md:gap-6"
                >
                  <span className="row-span-3 overflow-hidden rounded-md md:hidden">
                    <Media project={p} className="aspect-square w-full object-cover" />
                  </span>
                  <span className="hidden text-[12px] md:block" style={{ ...mono, color: C.muted }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[22px] font-medium leading-tight tracking-[-0.025em] transition-transform duration-300 group-hover:translate-x-1.5 group-hover:text-[var(--cobalt)] md:text-[26px]">
                    {shortTitle[p.slug]}
                  </span>
                  <span className="text-[15px]" style={{ color: C.muted }}>
                    {p.company.replace("isaac (Arco Educação)", "isaac · Arco")}
                    <span className="md:hidden"> · {p.year}</span>
                  </span>
                  <span className="hidden text-[14px] md:block" style={mono}>
                    {p.year}
                  </span>
                  <span className="flex items-baseline gap-2 text-[15px]">
                    <strong className="font-semibold" style={{ color: o.measured ? C.ink : C.muted }}>
                      {o.value}
                    </strong>
                    {o.measured && <span className="truncate" style={{ color: C.muted }}>{o.label}</span>}
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Experience + companies */}
      <section className="mx-auto grid max-w-[1240px] gap-12 px-6 py-24 md:px-10 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <h2 className="max-w-[12ch] text-[clamp(32px,4vw,56px)] font-medium leading-[1] tracking-[-0.04em]">
            Ten years, six product teams.
          </h2>
          <p className="mt-6 max-w-[38ch] text-[18px] leading-relaxed" style={{ color: C.muted }}>
            From brand work at Sanar to research, design systems and AI workflows in education. {person.nowDetail}.
          </p>
        </div>
        <ul>
          {experience.map((e) => (
            <li key={e.company} className="grid grid-cols-[110px_1fr] gap-4 border-b py-4 sm:grid-cols-[130px_1fr_1fr]" style={{ borderColor: C.line }}>
              <span className="text-[13px]" style={{ ...mono, color: C.muted }}>
                {e.period}
              </span>
              <span className="text-[17px] font-medium tracking-[-0.01em]">{e.company}</span>
              <span className="col-start-2 text-[15px] sm:col-start-auto" style={{ color: C.muted }}>
                {e.role}
              </span>
            </li>
          ))}
        </ul>
        <ul className="flex flex-wrap items-center gap-x-10 gap-y-6 lg:col-span-2" aria-label="Companies">
          {companies.map((c) => (
            <li key={c.name}>
              <img src={c.logo} alt={c.name} className="h-7 w-auto opacity-60 brightness-0 transition-opacity hover:opacity-100" />
            </li>
          ))}
        </ul>
      </section>

      {/* Close: the type is the button */}
      <footer className="mx-auto max-w-[1240px] px-6 pb-12 pt-24 md:px-10">
        <p className="text-[12px] uppercase tracking-[0.08em]" style={{ ...mono, color: C.muted }}>
          Hiring, or building something for schools?
        </p>
        <a
          href={person.linkedin}
          target="_blank"
          rel="noreferrer"
          className="group mt-4 inline-flex items-center gap-4 text-[clamp(48px,9vw,148px)] font-medium leading-[0.95] tracking-[-0.05em]"
        >
          <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_4px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_4px]">
            Talk to Rafa
          </span>
          <ArrowUpRight className="size-[0.6em] transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" strokeWidth={1.5} />
        </a>
        <div className="mt-16 flex flex-wrap justify-between gap-4 border-t pt-4 text-[12px] uppercase tracking-[0.08em]" style={{ ...mono, color: C.muted, borderColor: C.line }}>
          <span>© {new Date().getFullYear()} {person.name}</span>
          <span>LinkedIn · Resume · Play</span>
        </div>
      </footer>

      {/* Pointer-following preview (desktop, pointer only) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-50 hidden w-[320px] overflow-hidden rounded-lg shadow-[0_24px_60px_-20px_rgba(21,21,20,0.45)] transition-opacity duration-200 [@media(hover:hover)]:md:block"
        style={{
          opacity: hovered ? 1 : 0,
          transform: `translate3d(${pos.x + 24}px, ${pos.y - 120}px, 0)`,
          background: C.ink,
        }}
      >
        {hovered && <Media key={hovered.slug} project={hovered} className="aspect-[4/3] w-full object-cover" eager />}
      </div>
    </div>
  );
}
