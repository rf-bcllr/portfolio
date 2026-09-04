import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase, Sparkles, Zap } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CompanyLogos } from "@/components/CompanyLogos";
import { ContactFooter } from "@/components/ContactFooter";
import { StickerComment } from "@/components/StickerComment";
import { PostItNote } from "@/components/PostItNote";
import { useTranslations } from "@/hooks/useTranslations";
import amayaSticker from "@/assets/amaya-sticker.webp";
import liaSticker from "@/assets/lia-sticker-2.webp";
import remoteSticker from "@/assets/remote_worker_sticker.webp";
import brazilSticker from "@/assets/brazil-sticker-2.webp";
import ramenSticker from "@/assets/ramen-sticker.webp";
import gitSticker from "@/assets/git-sticker.webp";

const specialties = ["UX/UI Design", "AI Tools", "Design Systems", "Research"];

type Sticker = {
  src: string;
  alt: string;
  comment?: string;
  link?: { label: string; href: string };
  rotate: number;
  side: "left" | "right";
  size: number;
  /** desktop-only nudge so the board feels hand-placed */
  offset?: string;
};

const stickers: Sticker[] = [
  {
    src: amayaSticker,
    alt: "Amaya, Rafael's dog, drawn as a sticker",
    comment: "My main design companion, Amaya",
    rotate: -6,
    side: "right",
    size: 132,
    offset: "lg:-translate-x-2",
  },
  {
    src: liaSticker,
    alt: "Lia, a star-shaped AI mascot",
    comment: "Lia is a mascot I've designed for the AI in a digital platform called iônica",
    rotate: 5,
    side: "left",
    size: 128,
    offset: "lg:translate-x-2 lg:translate-y-12",
  },
  {
    src: ramenSticker,
    alt: "A bowl of ramen sticker",
    comment: "Ramen is my favorite food",
    rotate: -4,
    side: "right",
    size: 124,
    offset: "lg:translate-x-4 lg:translate-y-12",
  },
  {
    src: gitSticker,
    alt: "GitHub octocat coding on a laptop sticker",
    comment: "I also build things!",
    link: { label: "Check my GitHub", href: "https://github.com/genai-ftd" },
    rotate: 6,
    side: "left",
    size: 128,
    offset: "lg:-translate-x-4",
  },
  {
    src: remoteSticker,
    alt: "Sticker of a person working remotely on a laptop",
    comment: "I'm open to remote opportunities worldwide",
    rotate: -5,
    side: "right",
    size: 126,
    offset: "lg:-translate-x-2",
  },
  {
    src: brazilSticker,
    alt: "Based in Brazil sticker",
    rotate: -6,
    side: "left",
    size: 150,
  },
];

export default function Index() {
  const t = useTranslations();

  return (
    <div className="min-h-dvh text-foreground">
      <SiteNav />

      <main id="main-content">
        <section className="mx-auto max-w-6xl px-6 pb-24 pt-14 md:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="grid grid-cols-1 gap-x-16 gap-y-16 lg:grid-cols-[minmax(0,1fr)_360px]"
          >
            {/* ── Main column ─────────────────────────────── */}
            <div className="max-w-[640px]">
              {/* Availability tag */}
              <div className="inline-flex animate-badge-pop items-center gap-3 border border-foreground bg-foreground px-4 py-2 text-background">
                <span className="relative inline-flex size-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[hsl(var(--tag-green))] opacity-75" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-[hsl(var(--tag-green))]" />
                </span>
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.22em]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Available for full-time &amp; freelance work
                </span>
              </div>

              {/* Typographic opening */}
              <h1 className="animate-headline-reveal mt-8 font-display font-bold leading-[0.88] tracking-[-0.05em] text-foreground text-[clamp(2.75rem,7.5vw,5rem)]">
                I'm Rafael Bacellar<span className="text-primary">.</span>
              </h1>

              <p className="animate-text-reveal stagger-2 mt-5 text-balance text-[clamp(1.25rem,2.4vw,1.875rem)] font-medium leading-[1.3] text-muted-foreground opacity-0">
                Your next product designer<span className="text-primary">.</span>
              </p>

              {/* Post-it */}
              <div className="mt-10 flex justify-start" data-no-draw="true">
                <PostItNote rotate={-1.5}>
                  Senior Product Designer with over 6 years of experience building end-to-end
                  digital products that connect people and solve real problems.
                </PostItNote>
              </div>

              {/* CTAs */}
              <div className="animate-text-reveal stagger-3 mt-12 flex flex-wrap gap-5 opacity-0">
                <Button asChild variant="contrast" size="lg" className="btn-arrow-shift">
                  <Link to="/work" data-cursor-action="navigate-internal">
                    View Work <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-2 border-foreground bg-background text-foreground shadow-[6px_6px_0_0_hsl(var(--foreground))] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0_0_hsl(var(--foreground))]"
                >
                  <Link to="/resume" data-cursor-action="navigate-internal">
                    Resume
                  </Link>
                </Button>
              </div>

              {/* Stickers board (mobile / tablet) */}
              <div className="mt-16 flex flex-wrap items-center justify-start gap-x-10 gap-y-12 lg:hidden">
                {stickers.map((s) => (
                  <StickerComment
                    key={s.alt}
                    src={s.src}
                    alt={s.alt}
                    comment={s.comment}
                    link={s.link}
                    rotate={s.rotate}
                    side="right"
                    size={Math.round(s.size * 0.82)}
                  />
                ))}
              </div>

              {/* Meta line */}
              <div className="mt-16 border-t-2 border-foreground pt-5">
                <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
                  <p
                    className="text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {specialties.join(" · ")}
                  </p>
                  <div className="flex gap-6">
                    <a
                      href="https://linkedin.com/in/rfbcllr"
                      target="_blank"
                      rel="noreferrer"
                      className="border-b-2 border-foreground text-[10px] font-bold uppercase tracking-[0.22em] text-foreground transition-colors hover:border-primary hover:text-primary"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      LinkedIn
                    </a>
                    <a
                      href="mailto:rf.bcllr@gmail.com"
                      className="border-b-2 border-foreground text-[10px] font-bold uppercase tracking-[0.22em] text-foreground transition-colors hover:border-primary hover:text-primary"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      Email
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Board column (desktop only) ──────────────── */}
            <div className="hidden lg:grid lg:grid-cols-2 lg:content-start lg:justify-items-center lg:gap-x-6 lg:gap-y-16 lg:pt-6">
              {stickers.map((s) => (
                <StickerComment
                  key={s.alt}
                  src={s.src}
                  alt={s.alt}
                  comment={s.comment}
                  link={s.link}
                  rotate={s.rotate}
                  side={s.side}
                  size={s.size}
                  className={s.offset}
                />
              ))}
            </div>
          </motion.div>
        </section>



        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-8 flex items-end justify-between gap-6 border-b-2 border-foreground pb-4">
            <h2 className="animate-section-reveal font-display text-4xl font-bold leading-[0.9] tracking-[-0.035em] opacity-0 md:text-5xl">
              At a glance<span className="text-primary">.</span>
            </h2>
            <span
              className="animate-text-reveal stagger-2 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground opacity-0"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Signals
            </span>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: Briefcase, title: "10+ years", text: "Across edtech, fintech, retail, health and AI product workflows.", delay: 0 },
              { icon: Sparkles, title: "Systems thinker", text: "From research synthesis to component libraries and product storytelling.", delay: 0.1 },
              { icon: Zap, title: "Fast iterations", text: "Comfortable moving between FigJam, Figma, prototypes and shipped UI.", delay: 0.2 },
            ].map(({ icon: Icon, title, text, delay }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <Card className="p-6">
                  <Icon className="mb-5 size-7" />
                  <h3 className="font-display text-2xl font-bold tracking-[-0.03em]">{title}</h3>
                  <p className="mt-2 text-muted-foreground">{text}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <CompanyLogos title={t.companiesTitle} subtitle={t.companiesSubtitle} />
      </main>

      <ContactFooter contactTitle={t.contactTitle} contactDescription={t.contactDescription} backToTop={t.backToTop} />
    </div>
  );
}
