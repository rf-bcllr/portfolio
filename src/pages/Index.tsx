import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase, MapPin, Sparkles, Zap } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CompanyLogos } from "@/components/CompanyLogos";
import { ContactFooter } from "@/components/ContactFooter";
import { FigmaComment } from "@/components/FigmaComment";
import { HeroSticker } from "@/components/HeroSticker";
import { PostItNote } from "@/components/PostItNote";
import { useTranslations } from "@/hooks/useTranslations";
import heroPortrait from "@/assets/hero-portrait.png";
import amayaSticker from "@/assets/amaya-sticker.webp";
import liaSticker from "@/assets/lia-sticker.webp";
import remoteSticker from "@/assets/remote_worker_sticker.webp";
import brazilSticker from "@/assets/brazil-sticker.webp";

const specialties = ["UX/UI Design", "AI Tools", "Design Systems", "Research"];

const stickers = [
  {
    src: amayaSticker,
    alt: "Amaya, Rafael's dog, drawn as a sticker",
    comment: "My main design companion, Amaya",
    rotate: -5,
  },
  {
    src: liaSticker,
    alt: "Lia, a star-headed mascot",
    comment: "Lia is a mascot I've designed for the AI in a digital platform called iônica",
    rotate: 4,
  },
  {
    src: remoteSticker,
    alt: "Sticker of a person working on a laptop anywhere",
    comment: "I'm open to remote opportunities worldwide",
    rotate: -3,
  },
];

export default function Index() {
  const t = useTranslations();

  return (
    <div className="min-h-dvh text-foreground">
      <SiteNav />

      <main id="main-content">
        <section className="mx-auto max-w-5xl px-6 pb-20 pt-14 md:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="grid grid-cols-1 gap-x-14 gap-y-10 lg:grid-cols-[minmax(0,1fr)_260px]"
          >
            {/* ── Main column ─────────────────────────────── */}
            <div className="max-w-[640px]">
              {/* Identity line */}
              <div className="flex items-center gap-3">
                <img
                  src={heroPortrait}
                  alt="Rafael Bacellar"
                  loading="eager"
                  decoding="async"
                  width={60}
                  height={60}
                  className="size-14 shrink-0 rounded-full border-2 border-foreground object-cover grayscale transition-all duration-500 hover:grayscale-0 sm:size-[60px]"
                />
                <div>
                  <p className="font-display text-lg font-bold leading-none tracking-[-0.02em]">
                    Rafael Bacellar
                  </p>
                  <p
                    className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Senior Product Designer
                  </p>
                </div>
              </div>

              {/* Availability tag */}
              <div className="mt-8 inline-flex animate-badge-pop items-center gap-3 border border-foreground bg-foreground px-4 py-2 text-background">
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
              <h1 className="animate-headline-reveal mt-6 font-display font-bold leading-[0.85] tracking-[-0.05em] text-foreground text-[clamp(3.5rem,13vw,7.5rem)]">
                Hello<span className="text-primary">,</span>
              </h1>

              <p className="animate-text-reveal stagger-2 mt-6 max-w-[560px] text-balance text-[clamp(1.25rem,2.4vw,1.75rem)] font-medium leading-[1.35] text-foreground opacity-0">
                I'm Rafael — a product designer building digital products that connect people
                and solve real problems<span className="text-primary">.</span>
              </p>

              {/* Post-it (mobile / tablet flow) */}
              <div className="mt-10 flex justify-start lg:hidden" data-no-draw="true">
                <PostItNote rotate={-1.5}>
                  Senior Product Designer with 10+ years of experience creating digital products
                  that connect people and solve real problems — from mobile apps to AI-powered
                  tools.
                </PostItNote>
              </div>

              {/* CTAs */}
              <div className="animate-text-reveal stagger-3 mt-10 flex flex-wrap gap-5 opacity-0">
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

              {/* Stickers row (mobile / tablet) */}
              <div className="mt-12 flex flex-wrap items-end gap-x-10 gap-y-8 lg:hidden">
                {stickers.map((s) => (
                  <HeroSticker key={s.alt} src={s.src} alt={s.alt} size={76} rotate={s.rotate}>
                    <FigmaComment comment={s.comment} width={220} />
                  </HeroSticker>
                ))}
              </div>

              {/* Meta line */}
              <div className="mt-14 border-t-2 border-foreground pt-5">
                <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
                  <p className="flex items-center gap-2 font-display text-base font-bold text-foreground">
                    <MapPin className="size-4 text-primary" />
                    Based in Brazil
                    <span className="font-medium text-muted-foreground">
                      · Open to remote worldwide
                    </span>
                    <img
                      src={brazilSticker}
                      alt=""
                      aria-hidden="true"
                      width={34}
                      height={34}
                      loading="lazy"
                      className="size-[34px] object-contain"
                      style={{ transform: "rotate(-6deg)" }}
                    />
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
                <p
                  className="mt-4 text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {specialties.join(" · ")}
                </p>
              </div>
            </div>

            {/* ── Board column (desktop only) ──────────────── */}
            <div className="hidden lg:flex lg:flex-col lg:items-start lg:gap-16 lg:pt-6">
              <div data-no-draw="true">
                <PostItNote rotate={-2}>
                  Senior Product Designer with 10+ years of experience creating digital products
                  that connect people and solve real problems — from mobile apps to AI-powered
                  tools.
                </PostItNote>
              </div>

              {stickers.map((s, i) => (
                <HeroSticker
                  key={s.alt}
                  src={s.src}
                  alt={s.alt}
                  size={92}
                  rotate={s.rotate}
                  pinPosition={i % 2 === 0 ? "bottom-right" : "bottom-left"}
                  className={i === 1 ? "self-end" : undefined}
                >
                  <FigmaComment
                    comment={s.comment}
                    width={230}
                    align={i % 2 === 0 ? "left" : "right"}
                  />
                </HeroSticker>
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
