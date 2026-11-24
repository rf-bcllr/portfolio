/**
 * Direction 1, "Cordel". Reference: lynnandtonic.com (hand-made lettering, paper, the site as a
 * printed object). Turned into literatura de cordel, the Northeast's folk pamphlets sold hanging
 * on a string ("cordel") at the market: each case is a booklet on coloured paper, its real
 * screenshot printed as a one-colour woodcut, and the bio is a sextilha. Mockup only.
 */
import { ArrowUpRight } from "lucide-react";
import { experience, Media, outcomeOf, person, portrait, projectHref, projects, type Project } from "./shared";

const C = {
  wall: "#E6D7B8",
  ink: "#1B1712",
  muted: "#5A4E3C",
  string: "#6B5130",
};

const slab = { fontFamily: '"Alfa Slab One", ui-serif, Georgia, serif' };
const type = { fontFamily: '"Courier Prime", ui-monospace, monospace' };

/** Cordel covers are printed on cheap coloured paper. */
const PAPER = ["#F2C230", "#E9839A", "#7DB86B", "#79A9D1", "#EE9A45", "#F4E9D0", "#C9D96B"];

/** A cordel title per case (Portuguese, the genre's own voice) with a plain English line under it. */
const TITLES: Record<string, { pt: string; en: string }> = {
  "meu-arco": { pt: "A peleja do app de 2,9 estrelas", en: "How Meu Arco reached 4.8★" },
  "students-transportation": { pt: "O ônibus que avisava quando chegava", en: "Cheguei · school transport" },
  "health-food-delivery": { pt: "A marmita que mostrava a nutrição", en: "Saúde e Ponto · health delivery" },
  "ai-writing-assistant": { pt: "O robô que revisava o recado", en: "AI writing for school messages" },
  "ai-image-generation": { pt: "A professora e a máquina de figuras", en: "AI images for exam questions" },
  "lesson-plan-tool": { pt: "O plano de aula que economizou", en: "Lesson plans, $8.5k saved a month" },
  "credit-transfer-analysis": { pt: "O estudante e os créditos perdidos", en: "AI credit-transfer analysis" },
  "ionic-ai-identity": { pt: "Lia, Íon e a nave biblioteca", en: "AI mascots for Iônica" },
  "quest-for-the-next-product": { pt: "A jornada em busca do próximo produto", en: "My career as a playable RPG" },
};

const tilt = [-3, 2, -1.5, 3, -2, 1, -2.5, 2.5, -1];

function Booklet({ p, i }: { p: Project; i: number }) {
  const o = outcomeOf(p);
  const t = TITLES[p.slug];
  return (
    <li className="cordel-hang relative flex flex-col items-center pt-1" style={{ ["--tilt" as string]: `${tilt[i % tilt.length]}deg` }}>
      {/* clothes peg */}
      <span aria-hidden="true" className="relative z-10 -mb-3 h-7 w-3 rounded-[2px] bg-[#B98B55] shadow-[inset_-2px_0_0_rgba(0,0,0,0.18)]" />
      <a
        href={projectHref(p)}
        className="cordel-booklet group block w-[min(76vw,232px)] p-3 shadow-[0_14px_24px_-14px_rgba(40,25,5,0.55)] outline-offset-4"
        style={{ background: PAPER[i % PAPER.length], color: C.ink }}
      >
        <div className="border-2 p-3" style={{ borderColor: C.ink }}>
          <p className="flex justify-between text-[11px] uppercase tracking-[0.06em]" style={type}>
            <span>Folheto nº {String(i + 1).padStart(2, "0")}</span>
            <span>{p.year}</span>
          </p>
          <p className="mt-2 text-balance text-center text-[19px] uppercase leading-[1.05]" style={slab}>
            {t.pt}
          </p>
          <div className="woodcut relative mt-3 aspect-[4/3] overflow-hidden border-2" style={{ borderColor: C.ink }}>
            <Media project={p} className="size-full object-cover object-top" />
          </div>
          <p className="mt-2.5 text-center text-[12px] leading-tight" style={type}>
            {t.en}
          </p>
          <p className="mt-2 flex items-baseline justify-between border-t-2 pt-2" style={{ borderColor: C.ink }}>
            <span className="text-[18px]" style={slab}>
              {o.value}
            </span>
            <span className="text-[11px] uppercase" style={type}>
              {p.company.replace("isaac (Arco Educação)", "isaac")}
            </span>
          </p>
        </div>
      </a>
    </li>
  );
}

/** A catenary string drawn across the row; booklets hang from it. */
function StringLine() {
  return (
    <svg aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-3 h-10 w-full" viewBox="0 0 1000 40" preserveAspectRatio="none">
      <path d="M0 4 Q500 44 1000 4" fill="none" stroke={C.string} strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function DirectionCordel() {
  const rows = [projects.slice(0, 5), projects.slice(5)];
  return (
    <div
      className="min-h-dvh antialiased"
      style={{
        color: C.ink,
        backgroundColor: C.wall,
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .35 0 0 0 0 .25 0 0 0 0 .1 0 0 0 .09 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        ...type,
      }}
    >
      <style>{`
        .woodcut img, .woodcut video, .woodcut [role=img] { filter: grayscale(1) contrast(1.7) brightness(1.12); mix-blend-mode: multiply; transition: filter .4s ease; }
        .cordel-booklet:hover .woodcut img, .cordel-booklet:hover .woodcut video, .cordel-booklet:focus-visible .woodcut img, .cordel-booklet:focus-visible .woodcut video { filter: none; mix-blend-mode: normal; }
        .cordel-hang { transform: rotate(var(--tilt)); transform-origin: 50% 0; transition: transform .5s cubic-bezier(.3,1.6,.5,1); }
        .cordel-hang:hover, .cordel-hang:focus-within { transform: rotate(0deg) translateY(-4px); }
        @media (prefers-reduced-motion: reduce) { .cordel-hang, .cordel-hang:hover { transition: none; } }
      `}</style>

      {/* Masthead */}
      <header className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-6 py-5 text-[13px] uppercase tracking-[0.06em] md:px-10">
        <span>Folhetaria Bacellar</span>
        <nav aria-label="Primary" className="flex gap-5">
          <a href="#cordel-work" className="py-2 hover:underline">Folhetos</a>
          <a href="/resume" className="py-2 hover:underline">Resume</a>
          <a href="/play" className="py-2 hover:underline">Play</a>
        </nav>
      </header>

      {/* Hero: the cover of the main folheto */}
      <section className="mx-auto grid max-w-[1240px] items-center gap-10 px-6 pb-20 pt-6 md:px-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="text-[14px] uppercase tracking-[0.08em]" style={{ color: C.muted }}>
            Literatura de cordel · product design · 2015–2026
          </p>
          <h1 className="mt-4 text-[clamp(52px,8.6vw,132px)] uppercase leading-[0.9] tracking-[-0.01em]" style={slab}>
            Rafa Bacellar
          </h1>
          <p className="mt-6 max-w-[30ch] text-[clamp(20px,2vw,26px)] leading-[1.3]">
            Senior product designer. Nine stories of school apps, AI tools and one video game, printed for whoever needs a designer.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-6 text-[15px]">
            <a
              href={person.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center gap-2 border-2 px-5 uppercase tracking-[0.04em] transition-transform active:translate-y-px"
              style={{ borderColor: C.ink, background: C.ink, color: "#F2C230" }}
            >
              Talk to Rafa <ArrowUpRight className="size-4" />
            </a>
            <a href="#cordel-work" className="underline decoration-2 underline-offset-4">
              See the nine folhetos ↓
            </a>
          </div>
        </div>
        <figure className="mx-auto w-full max-w-[400px] -rotate-2 p-4 shadow-[0_24px_40px_-20px_rgba(40,25,5,0.6)]" style={{ background: "#F2C230" }}>
          <div className="border-[3px] p-4" style={{ borderColor: C.ink }}>
            <p className="text-center text-[22px] uppercase leading-none" style={slab}>
              O designer que veio da Bahia
            </p>
            <div className="woodcut mt-4 aspect-square overflow-hidden border-[3px]" style={{ borderColor: C.ink }}>
              <img src={portrait} alt="Rafael Bacellar" className="size-full object-cover" />
            </div>
            <p className="mt-3 flex justify-between text-[12px] uppercase">
              <span>Autor: Rafa Bacellar</span>
              <span>Nº 00</span>
            </p>
          </div>
        </figure>
      </section>

      {/* The string */}
      <section id="cordel-work" className="scroll-mt-12 pb-16 pt-10" aria-labelledby="cordel-work-h">
        <div className="mx-auto max-w-[1240px] px-6 md:px-10">
          <h2 id="cordel-work-h" className="text-[clamp(32px,4.4vw,60px)] uppercase leading-none" style={slab}>
            Nove folhetos
          </h2>
          <p className="mt-3 max-w-[52ch] text-[16px]" style={{ color: C.muted }}>
            Nine cases, hung the way cordel is sold at the market. Hover a booklet to see the real screen in colour; click it to read the case.
          </p>
        </div>
        {rows.map((row, r) => (
          <div key={r} className="relative mt-10">
            <StringLine />
            <ul className="mx-auto flex max-w-[1320px] flex-wrap justify-center gap-x-6 gap-y-14 px-4 pt-2">
              {row.map((p, i) => (
                <Booklet key={p.slug} p={p} i={r * 5 + i} />
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* The author, in verse */}
      <section className="mx-auto grid max-w-[1240px] gap-12 px-6 py-24 md:px-10 lg:grid-cols-2">
        <div>
          <h2 className="text-[clamp(32px,4.4vw,60px)] uppercase leading-none" style={slab}>
            Sobre o autor
          </h2>
          <div className="mt-8 grid gap-8 text-[19px] leading-[1.5] sm:grid-cols-2" lang="pt-BR">
            <p>
              Vou contar uma história
              <br />
              de um designer da Bahia
              <br />
              que fez app para escola
              <br />
              com pesquisa e ousadia,
              <br />e hoje ensina a máquina
              <br />a ajudar quem ensina todo dia.
            </p>
            <p>
              Passou por Sanar, Sebrae,
              <br />
              pela ClassApp e isaac também,
              <br />
              hoje está na FTD
              <br />
              desenhando o que convém.
              <br />
              Se precisar de designer,
              <br />
              chame no LinkedIn, meu bem.
            </p>
          </div>
          <p className="mt-6 max-w-[52ch] text-[15px]" style={{ color: C.muted }}>
            In English: a designer from Bahia who made school apps with research and nerve, and now teaches machines to help the people who teach.
            Sanar, Sebrae, ClassApp, isaac, now FTD Educação.
          </p>
        </div>
        <ul className="self-end border-t-2" style={{ borderColor: C.ink }}>
          {experience.map((e) => (
            <li key={e.company} className="grid grid-cols-[120px_1fr] gap-4 border-b-2 border-dashed py-3 text-[15px]" style={{ borderColor: C.ink }}>
              <span>{e.period}</span>
              <span>
                <strong className="font-bold">{e.company}</strong> · {e.role}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <footer className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-4 border-t-2 px-6 py-8 text-[13px] uppercase md:px-10" style={{ borderColor: C.ink }}>
        <span>Impresso no Brasil · {new Date().getFullYear()}</span>
        <a href={person.linkedin} target="_blank" rel="noreferrer" className="py-2 underline decoration-2 underline-offset-4">
          Encomende um folheto: LinkedIn ↗
        </a>
      </footer>
    </div>
  );
}
