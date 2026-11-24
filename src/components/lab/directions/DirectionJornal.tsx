/**
 * Direction 2, "O Bacellar". Reference: vanschneider.com (editorial voice, nav as categorised
 * columns, a statement set like print). Turned into a Brazilian broadsheet front page: the
 * results are the headlines, the real screens print in halftone and turn to colour on hover.
 * Chrome in Portuguese, stories in English. Mockup only.
 */
import { ArrowUpRight } from "lucide-react";
import { translations } from "@/hooks/useTranslations";
import { experience, Media, person, portrait, projectHref, projects, type Project } from "@/components/canvas/shared";

const C = {
  paper: "#EFEADF",
  ink: "#1A1916",
  muted: "#55524A",
  rule: "#1A1916",
  red: "#B3261E",
};

const masthead = { fontFamily: '"UnifrakturMaguntia", ui-serif, serif' };
const serif = { fontFamily: '"Newsreader", ui-serif, Georgia, serif' };
const label = { fontFamily: '"Archivo Narrow", ui-sans-serif, sans-serif' };

const get = (slug: string) => projects.find((p) => p.slug === slug)!;
const quote = translations.en.recommendationsItems[0];

function Photo({ p, className = "", aspect = "aspect-[16/10]" }: { p: Project; className?: string; aspect?: string }) {
  return (
    <div className={`halftone relative overflow-hidden ${aspect} ${className}`}>
      <Media project={p} className="size-full object-cover object-top" />
    </div>
  );
}

function Kicker({ children, red = false }: { children: React.ReactNode; red?: boolean }) {
  return (
    <p className="text-[12px] font-bold uppercase tracking-[0.12em]" style={{ ...label, color: red ? C.red : C.ink }}>
      {children}
    </p>
  );
}

function Story({ p, kicker, head, deck, size = "md" }: { p: Project; kicker: string; head: string; deck?: string; size?: "md" | "sm" }) {
  return (
    <article className="group">
      <a href={projectHref(p)} className="block">
        <Kicker>{kicker}</Kicker>
        <h3
          className={`mt-1.5 text-balance font-bold leading-[1.05] tracking-[-0.01em] decoration-2 underline-offset-4 group-hover:underline ${size === "md" ? "text-[28px]" : "text-[21px]"}`}
          style={serif}
        >
          {head}
        </h3>
      </a>
      {deck && (
        <p className="mt-2 text-[16px] leading-[1.45]" style={{ ...serif, color: C.muted }}>
          {deck}
        </p>
      )}
    </article>
  );
}

export function DirectionJornal() {
  const arco = get("meu-arco");
  const cheguei = get("students-transportation");
  const lesson = get("lesson-plan-tool");
  const saude = get("health-food-delivery");
  const writing = get("ai-writing-assistant");
  const images = get("ai-image-generation");
  const credit = get("credit-transfer-analysis");
  const ionic = get("ionic-ai-identity");

  const date = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date());

  return (
    <div className="min-h-dvh antialiased" style={{ background: C.paper, color: C.ink, ...serif }}>
      <style>{`
        .halftone { background: ${C.paper}; }
        .halftone > img, .halftone > video, .halftone > [role=img] { filter: grayscale(1) contrast(1.35) brightness(1.06); mix-blend-mode: multiply; transition: filter .45s ease; }
        .halftone::after { content: ""; position: absolute; inset: 0; pointer-events: none; mix-blend-mode: multiply; opacity: .55;
          background-image: radial-gradient(circle at center, ${C.ink} 0.7px, transparent 1.05px); background-size: 3.5px 3.5px; transition: opacity .45s ease; }
        a:hover .halftone > *, .halftone:hover > * { filter: none; }
        a:hover .halftone::after, .halftone:hover::after { opacity: 0; }
        .col-rule > * + * { border-left: 1px solid ${C.rule}; }
      `}</style>

      <div className="mx-auto max-w-[1280px] px-5 md:px-10">
        {/* Ears + masthead */}
        <header className="grid items-center gap-4 pt-6 md:grid-cols-[180px_1fr_180px]">
          <p className="hidden border p-2 text-[12px] leading-snug md:block" style={{ ...label, borderColor: C.rule }}>
            <span className="font-bold uppercase tracking-[0.08em]" style={{ color: C.red }}>
              Plantão
            </span>
            <br />
            Rafa is open to new projects. Details on page 1.
          </p>
          <a href="/" className="block text-center text-[clamp(52px,10vw,128px)] leading-[0.9]" style={masthead}>
            O Bacellar
          </a>
          <p className="hidden border p-2 text-right text-[12px] leading-snug md:block" style={{ ...label, borderColor: C.rule }}>
            <span className="font-bold uppercase tracking-[0.08em]">Previsão</span>
            <br />
            Clear skies, 100% chance of user research.
          </p>
        </header>

        <div
          className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-y-[3px] border-double py-2 text-[12px] uppercase tracking-[0.08em]"
          style={{ ...label, borderColor: C.rule }}
        >
          <span>Ano XI · Nº 09</span>
          <span className="first-letter:uppercase">{date}</span>
          <nav aria-label="Sections" className="flex gap-4">
            <a href="#jornal-front" className="py-1.5 hover:underline">Educação</a>
            <a href="#jornal-ai" className="py-1.5 hover:underline">IA</a>
            <a href="/resume" className="py-1.5 hover:underline">Carreira</a>
            <a href="/play" className="py-1.5 hover:underline">Passatempos</a>
          </nav>
        </div>

        {/* Front page */}
        <main id="jornal-front" className="grid gap-8 py-8 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1fr)] lg:gap-0">
          {/* Lead story */}
          <article className="lg:pr-8">
            <Kicker red>Manchete · Educação</Kicker>
            <h1 className="mt-2 text-balance text-[clamp(38px,5vw,68px)] font-extrabold leading-[0.98] tracking-[-0.02em]">
              School app climbs from 2.9 to 4.8 stars after three platforms fold into one
            </h1>
            <p className="mt-4 max-w-[60ch] text-[21px] leading-[1.35]" style={{ color: C.muted }}>
              Meu Arco merged overlapping school workflows for Arco Educação into one modular app. SUS score of 90, support tickets down 35%, rollout
              finished ahead of schedule.
            </p>
            <p className="mt-4 text-[13px] uppercase tracking-[0.08em]" style={label}>
              By {person.name}, product designer · 16 weeks · research to handoff
            </p>
            <a href={projectHref(arco)} className="mt-5 block">
              <Photo p={arco} aspect="aspect-[16/9]" className="border" />
            </a>
            <div className="mt-5 gap-6 text-[16px] leading-[1.55] [column-rule:1px_solid_#1A1916] sm:columns-2 xl:columns-3">
              <p className="first-letter:float-left first-letter:mr-2 first-letter:text-[64px] first-letter:font-extrabold first-letter:leading-[0.8]">
                {arco.summary} Before it, a teacher opened three tabs every morning: the LMS, the gradebook and the resource library. Research covered
                25+ schools and 45+ usability-test participants.
              </p>
              <p className="mt-3">
                The work ran from research to handoff over 16 weeks. The SUS score reached 90, the rollout hit 100% ahead of schedule, and support tickets
                fell by 35%.{" "}
                <a href={projectHref(arco)} className="font-semibold underline decoration-1 underline-offset-2">
                  Read the full case →
                </a>
              </p>
            </div>
          </article>

          {/* Right column */}
          <aside className="flex flex-col gap-7 border-t pt-7 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0" style={{ borderColor: C.rule }}>
            <div>
              <a href={projectHref(cheguei)} className="block">
                <Photo p={cheguei} aspect="aspect-[4/3]" className="mb-3 border" />
              </a>
              <Story
                p={cheguei}
                kicker="Transporte escolar"
                head="12,000 students ride with Cheguei in its first six months"
                deck="Parents rate the pickup and drop-off flow 97% satisfactory; transport calls to schools fall 85%."
              />
            </div>
            <div className="border-t pt-6" style={{ borderColor: C.rule }}>
              <Story
                p={lesson}
                kicker="Economia"
                head="Teachers' lesson-plan tool replaces a licence, saving $8.5k a month"
                deck="Plans by grade, topic and duration, adaptable to inclusive-education needs."
                size="sm"
              />
            </div>
            <blockquote className="border-y-[3px] border-double py-4" style={{ borderColor: C.rule }}>
              <p className="text-[22px] font-medium leading-[1.3]">“By far the most creative designer I've ever worked with.”</p>
              <footer className="mt-2 text-[12px] uppercase tracking-[0.08em]" style={label}>
                {quote.author}, {quote.role}
              </footer>
            </blockquote>
          </aside>
        </main>

        {/* Second fold: AI desk */}
        <section id="jornal-ai" className="scroll-mt-12 border-t-[3px] border-double py-8" style={{ borderColor: C.rule }} aria-labelledby="jornal-ai-h">
          <h2 id="jornal-ai-h" className="text-[13px] font-bold uppercase tracking-[0.14em]" style={label}>
            Inteligência artificial · the AI desk
          </h2>
          <div className="col-rule mt-5 grid gap-8 md:grid-cols-3 md:gap-0 [&>*]:md:px-6 [&>*:first-child]:md:pl-0 [&>*:last-child]:md:pr-0">
            <div>
              <a href={projectHref(images)} className="block">
                <Photo p={images} className="mb-3 border" />
              </a>
              <Story p={images} kicker="Em andamento" head="Public-school teachers get an AI that draws exam figures" deck="Built into FTD com Você for math word problems and chemistry formulas." size="sm" />
            </div>
            <div>
              <Story p={writing} kicker="Em andamento" head="An assistant that checks tone before a school message reaches families" deck="Moderation first, then tone and length controls, with usage tracked on a dashboard." size="sm" />
              <div className="mt-5 border-t pt-5" style={{ borderColor: C.rule }}>
                <Story p={credit} kicker="Ensino superior" head="Transfer students see where their credits land before they apply" deck="Transcript in, credit map out, across Edvisorly's partner universities." size="sm" />
              </div>
            </div>
            <div>
              <a href={projectHref(ionic)} className="block">
                <Photo p={ionic} className="mb-3 border" />
              </a>
              <Story p={ionic} kicker="Identidade" head="Meet Lia and Íon, the new faces of Iônica's library spaceship" deck="Twenty-plus alternatives explored before the final pair; named with the content team." size="sm" />
            </div>
          </div>
        </section>

        {/* Back of the page: classifieds, career, puzzles */}
        <section className="grid gap-8 border-t-[3px] border-double py-8 md:grid-cols-[1.2fr_1fr_1fr]" style={{ borderColor: C.rule }}>
          <div className="border-[3px] border-double p-5" style={{ borderColor: C.rule }}>
            <p className="text-[13px] font-bold uppercase tracking-[0.14em]" style={{ ...label, color: C.red }}>
              Classificados
            </p>
            <p className="mt-2 text-[30px] font-extrabold leading-[1.02] tracking-[-0.01em]">Senior product designer seeks a team that makes things for learners.</p>
            <p className="mt-3 text-[16px] leading-[1.45]" style={{ color: C.muted }}>
              10+ years in edtech, fintech, health and AI. Research, design systems, prototyping, shipped UI. Speaks Portuguese and English.
            </p>
            <a
              href={person.linkedin}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex h-11 items-center gap-2 px-4 text-[14px] font-bold uppercase tracking-[0.08em] text-white transition-transform active:translate-y-px"
              style={{ ...label, background: C.ink }}
            >
              Reply via LinkedIn <ArrowUpRight className="size-4" />
            </a>
          </div>

          <div>
            <p className="text-[13px] font-bold uppercase tracking-[0.14em]" style={label}>
              Carreira · movimento
            </p>
            <ul className="mt-3 text-[15px]">
              {experience.map((e) => (
                <li key={e.company} className="flex justify-between gap-3 border-b border-dotted py-2" style={{ borderColor: C.rule }}>
                  <span>
                    <strong>{e.company}</strong> <span style={{ color: C.muted }}>· {e.role}</span>
                  </span>
                  <span className="shrink-0 tabular-nums" style={label}>
                    {e.from}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-5">
            <a href="/play" className="group block border p-4" style={{ borderColor: C.rule }}>
              <p className="text-[13px] font-bold uppercase tracking-[0.14em]" style={label}>
                Passatempos
              </p>
              <p className="mt-1.5 text-[21px] font-bold leading-tight group-hover:underline">Play the editor's career as a 2D side-scroller.</p>
              <p className="mt-1 text-[14px]" style={{ color: C.muted }}>
                Every job a chapter, every project a card. Start the game →
              </p>
            </a>
            <div className="flex gap-4">
              <div className="halftone relative size-24 shrink-0 overflow-hidden border">
                <img src={portrait} alt="Rafael Bacellar" className="size-full object-cover" />
              </div>
              <p className="text-[14px] leading-[1.45]" style={{ color: C.muted }}>
                <strong style={{ color: C.ink }}>Expediente.</strong> Written, designed and printed by {person.name}. {person.nowDetail}. Also on the menu:{" "}
                <a href={projectHref(saude)} className="underline">
                  Saúde e Ponto
                </a>
                , 92% task completion.
              </p>
            </div>
          </div>
        </section>

        <footer className="flex flex-wrap justify-between gap-3 border-t py-5 text-[12px] uppercase tracking-[0.08em]" style={{ ...label, borderColor: C.rule }}>
          <span>© {new Date().getFullYear()} O Bacellar · Tiragem: one portfolio</span>
          <span>LinkedIn · Resume · Play</span>
        </footer>
      </div>
    </div>
  );
}
