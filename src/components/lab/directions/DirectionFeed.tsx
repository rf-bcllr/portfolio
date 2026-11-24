/**
 * Direction B, "Work feed". Reference: recent.design (a left rail that holds the person,
 * a dense media-first feed with filter chips, a side column of supporting lists).
 * White ground, monochrome UI, the project media is the only colour. Mockup only.
 */
import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { translations } from "@/hooks/useTranslations";
import avatar from "@/assets/rafael-bacellar-avatar.jpg";
import inisAvatar from "@/assets/inis-avatar.png";
import { experience, Media, outcomeOf, person, projectHref, projects, shortTitle } from "./shared";

const C = {
  bg: "#FFFFFF",
  rail: "#F6F6F4",
  ink: "#0B0B0A",
  muted: "#6A6A66",
  line: "#E7E6E2",
  card: "#F6F6F4",
  live: "#16A34A",
};

const sans = { fontFamily: '"Geist", ui-sans-serif, system-ui, sans-serif' };
const mono = { fontFamily: '"Geist Mono", ui-monospace, monospace' };

const FILTERS = [
  { id: "all", label: "All", test: () => true },
  { id: "ai", label: "AI", test: (c: string[]) => c.includes("AI") },
  { id: "mobile", label: "Mobile", test: (c: string[]) => c.includes("Mobile") },
  { id: "systems", label: "Design systems", test: (c: string[]) => c.includes("Design System") },
  { id: "research", label: "Research", test: (c: string[]) => c.includes("Research") },
  { id: "play", label: "Games", test: (c: string[]) => c.includes("Game Design") },
] as const;

const quote = translations.en.recommendationsItems[0];

export function DirectionFeed() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const visible = useMemo(() => {
    const f = FILTERS.find((x) => x.id === filter)!;
    return projects.filter((p) => f.test(p.chips));
  }, [filter]);

  return (
    <div className="min-h-dvh antialiased lg:grid lg:grid-cols-[264px_1fr]" style={{ background: C.bg, color: C.ink, ...sans }}>
      {/* Rail */}
      <aside
        className="flex flex-col gap-8 border-b px-5 py-6 lg:sticky lg:top-11 lg:h-[calc(100dvh-44px)] lg:border-b-0 lg:border-r"
        style={{ background: C.rail, borderColor: C.line }}
      >
        <div className="flex items-center gap-3">
          <img src={avatar} alt="" className="size-10 rounded-full object-cover" />
          <div>
            <p className="text-[15px] font-semibold leading-tight tracking-[-0.01em]">{person.name}</p>
            <p className="text-[13px]" style={{ color: C.muted }}>
              {person.role}
            </p>
          </div>
        </div>

        <p className="text-[14px] leading-[1.55]" style={{ color: C.muted }}>
          I design school and AI products. Now at <span style={{ color: C.ink }}>{person.now}</span>, before that isaac and ClassApp.
        </p>

        <nav aria-label="Sections" className="hidden flex-col text-[14px] lg:flex">
          {[
            ["Work", "#b-feed", true],
            ["Resume", "/resume", false],
            ["Certifications", "/certifications", false],
            ["Play the portfolio", "/play", false],
          ].map(([label, href, active]) => (
            <a key={label as string} href={href as string} className="flex min-h-9 items-center gap-2 rounded-md px-2 -mx-2 transition-colors hover:bg-black/5">
              {label}
              {active && <span className="size-1.5 rounded-full" style={{ background: C.ink }} aria-hidden="true" />}
            </a>
          ))}
        </nav>

        <div className="mt-auto hidden flex-col gap-3 lg:flex">
          <p className="flex items-center gap-2 text-[13px]" style={{ color: C.muted }}>
            <span className="size-2 rounded-full" style={{ background: C.live }} aria-hidden="true" />
            Open to new projects
          </p>
          <a
            href={person.linkedin}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center justify-center rounded-full text-[14px] font-medium text-white transition active:scale-[0.98]"
            style={{ background: C.ink }}
          >
            Message on LinkedIn
          </a>
        </div>
      </aside>

      <div className="min-w-0 xl:grid xl:grid-cols-[1fr_300px]">
        {/* Feed */}
        <main id="b-feed" className="min-w-0 px-5 py-6 lg:px-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-[15px] font-semibold">
                Work <span className="font-normal" style={{ color: C.muted }}>Nine product cases, 2023–2026.</span>
              </h1>
            </div>
          </div>

          <div role="group" aria-label="Filter projects" className="mb-6 flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const count = projects.filter((p) => f.test(p.chips)).length;
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(f.id)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-[13px] transition-colors"
                  style={{
                    background: active ? C.ink : C.bg,
                    color: active ? "#fff" : C.ink,
                    borderColor: active ? C.ink : C.line,
                  }}
                >
                  {f.label}
                  <span style={{ ...mono, opacity: 0.6 }} className="text-[11px]">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <ul className="gap-4 [column-fill:_balance] sm:columns-2 2xl:columns-3">
            {visible.map((p) => {
              const o = outcomeOf(p);
              return (
                <li key={p.slug} className="mb-4 break-inside-avoid">
                  <a href={projectHref(p)} className="group block rounded-2xl p-1.5 transition-transform duration-300 hover:-translate-y-0.5" style={{ background: C.card }}>
                    <div className="relative overflow-hidden rounded-xl bg-white">
                      <Media project={p} className="block w-full transition-transform duration-500 group-hover:scale-[1.02]" />
                      <span className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/95 opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                        <ArrowUpRight className="size-4" />
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-3 px-2 pb-1.5 pt-3">
                      <div className="min-w-0">
                        <p className="truncate text-[14px] font-medium">{shortTitle[p.slug]}</p>
                        <p className="truncate text-[13px]" style={{ color: C.muted }}>
                          {p.company} · {p.year}
                        </p>
                      </div>
                      <span
                        className="shrink-0 rounded-full border px-2.5 py-1 text-[12px]"
                        style={{ ...mono, borderColor: C.line, color: o.measured ? C.ink : C.muted, background: "#fff" }}
                      >
                        {o.value}
                      </span>
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
        </main>

        {/* Side column */}
        <aside className="flex flex-col gap-4 border-t px-5 py-6 xl:border-l xl:border-t-0 xl:px-5" style={{ borderColor: C.line }}>
          <section className="rounded-2xl p-4" style={{ background: C.card }}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[14px] font-semibold">Experience</h2>
              <a href="/resume" className="text-[13px] underline-offset-4 hover:underline" style={{ color: C.muted }}>
                Resume
              </a>
            </div>
            <ul className="flex flex-col">
              {experience.slice(0, 5).map((e) => (
                <li key={e.company} className="flex items-center justify-between gap-3 border-t py-2.5 first:border-t-0" style={{ borderColor: C.line }}>
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-medium">{e.company}</p>
                    <p className="truncate text-[12px]" style={{ color: C.muted }}>
                      {e.role}
                    </p>
                  </div>
                  <span className="shrink-0 text-[12px]" style={{ ...mono, color: C.muted }}>
                    {e.from}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl p-4" style={{ background: C.card }}>
            <h2 className="mb-3 text-[14px] font-semibold">Word from a colleague</h2>
            <blockquote className="text-[14px] leading-[1.55]">
              “Rafael is by far the most creative designer I've ever worked with. He really has the eye for details and ends up spotting flaws no one else
              does.”
            </blockquote>
            <figcaption className="mt-3 flex items-center gap-2.5">
              <img src={inisAvatar} alt="" className="size-7 rounded-full object-cover" />
              <span className="text-[12px] leading-tight" style={{ color: C.muted }}>
                <span className="block font-medium" style={{ color: C.ink }}>
                  {quote.author}
                </span>
                {quote.role}
              </span>
            </figcaption>
          </section>

          <a href="/play" className="group rounded-2xl p-4 text-white transition-transform hover:-translate-y-0.5" style={{ background: C.ink }}>
            <p className="text-[14px] font-semibold">Rather play than scroll?</p>
            <p className="mt-1 text-[13px] text-white/70">My career as a 2D side-scrolling RPG.</p>
            <span className="mt-4 inline-flex items-center gap-1 text-[13px]">
              Start the game <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </a>
        </aside>
      </div>
    </div>
  );
}
