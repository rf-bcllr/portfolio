import { HeroStickers } from "./HeroStickers";
import { ResizableTitle } from "./ResizableTitle";
import "./hero.css";


type HeroSectionProps = {
  portraitSrc: string;
  /** Small round photo used in the navbar; shown on the sticker comments */
  avatarSrc: string;
  folderImages: [string, string, string];
  casesHref?: string;
  linkedinHref?: string;
  resumeHref?: string;
};

const SKILLS = ["UX/UI Design", "AI Tools", "Design Systems", "Research"];

export function HeroSection({
  portraitSrc,
  avatarSrc,
  folderImages,
  casesHref = "/work",
  linkedinHref = "https://linkedin.com/in/rfbcllr",
  resumeHref = "/resume",
}: HeroSectionProps) {
  return (

    <section className="relative mx-auto flex max-w-6xl flex-col items-center px-6 pb-44 pt-14 text-center md:pt-20">
      <ResizableTitle className="hero-reveal" />


      {/* Floating composition: profile card + folder in front, bottom-right */}
      <div className="hero-reveal relative mt-14 w-full max-w-[min(280px,calc(100vw-96px))] [animation-delay:160ms] sm:mt-16 sm:max-w-[340px]">
        <HeroStickers avatarSrc={avatarSrc} />

        <div className="hero-float">
              <div className="relative text-left">
                <div className="pointer-events-none absolute -inset-4 -rotate-1 border-2 border-dashed border-foreground/50" />
                <div className="relative border-2 border-foreground bg-card p-4 text-card-foreground shadow-[12px_12px_0_0_hsl(var(--foreground))] sm:p-6">
                  <div className="relative mx-auto mb-4 aspect-square w-full sm:mb-6">
                    <img
                      src={portraitSrc}
                      alt="Rafael Bacellar"
                      className="size-full object-cover grayscale transition-all duration-500 hover:grayscale-0"
                    />
                  </div>

              <h2 className="font-display text-[22px] font-bold leading-none tracking-[-0.03em] text-foreground sm:text-[28px]">
                Rafael Bacellar
              </h2>
              <p className="font-display mt-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-primary sm:mt-2">
                Senior Product Designer
              </p>
              <div className="mt-3 hidden grid-cols-2 gap-1.5 sm:mt-5 sm:grid">
                {SKILLS.map((skill) => (
                  <span
                    key={skill}
                    className="font-display flex items-center justify-center border border-foreground px-2 py-1 text-center text-[9px] font-bold uppercase tracking-[0.14em] text-foreground sm:py-1.5"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex gap-6 border-t-2 border-foreground pt-4">
                {[
                  { label: "LinkedIn", href: linkedinHref, external: true },
                  { label: "Resume", href: resumeHref, external: false },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    {...(link.external ? { target: "_blank", rel: "noreferrer" } : {})}
                    className="font-display border-b-2 border-foreground text-[10px] font-bold uppercase tracking-[0.22em] text-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
            <div className="font-display absolute -right-3 -top-3 flex items-center gap-2 bg-foreground px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-background sm:tracking-[0.2em]">
              <span className="relative inline-flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[hsl(var(--tag-green))] opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-[hsl(var(--tag-green))]" />
              </span>
              Available for new projects
            </div>
          </div>
        </div>

        <div className="hero-float hero-float--alt absolute -bottom-[132px] -right-10 z-20 sm:-bottom-[118px] sm:-right-12">
          <a href={casesHref} className="pfolder pfolder--compact" aria-label="Selected cases: 9 projects, 2023–2026">
            <div className="pfolder-art">
              <div className="pfolder-back" />
              {folderImages.map((src, i) => (
                <div key={src} className={`pfolder-sheet pfolder-sheet-${i + 1}`}>
                  <img src={src} alt="" />
                </div>
              ))}
              <div className="pfolder-front" />
            </div>
            <div className="flex flex-col items-center gap-1 bg-foreground px-3 py-2 text-center">
              <span className="font-display text-[11px] font-bold uppercase leading-none tracking-[0.14em] text-background">
                Selected cases
              </span>
              <span className="font-display text-[10px] font-bold uppercase leading-none tracking-[0.14em] text-background/60">
                9 projects · 2023–2026
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
