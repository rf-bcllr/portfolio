import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase, MapPin, Sparkles, Zap } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CompanyLogos } from "@/components/CompanyLogos";
import { ContactFooter } from "@/components/ContactFooter";
import { useTranslations } from "@/hooks/useTranslations";
import { HeroSticker } from "@/components/HeroSticker";
import { PostItNote } from "@/components/PostItNote";
import heroPortrait from "@/assets/hero-portrait.png";
import amayaSticker from "@/assets/amaya-sticker.png.asset.json";
import brazilSticker from "@/assets/brazil-sticker.png.asset.json";
import liaSticker from "@/assets/lia-sticker.png.asset.json";
import remoteWorkerSticker from "@/assets/remote_worker_sticker.png.asset.json";





const profileSkills = ["UX/UI Design", "AI Tools", "Design Systems", "Research"];

export default function Index() {
  const t = useTranslations();

  return (
    <div className="min-h-dvh text-foreground">
      <SiteNav />

      <main id="main-content">
        <section className="relative mx-auto grid min-h-[calc(100vh-88px)] max-w-6xl grid-cols-1 items-center gap-x-16 gap-y-12 px-6 pb-16 pt-14 md:pt-20 lg:grid-cols-[1fr_auto]">
          {/* FigJam sticker canvas — desktop only, laid out in the negative space */}
          <div className="pointer-events-none absolute inset-0 z-20 hidden lg:block" aria-hidden={false}>
            <div className="pointer-events-auto absolute left-[calc(50%+2rem)] top-[4%] w-[132px]">
              <HeroSticker
                src={liaSticker.url}
                alt="Sticker of Lia, a star-shaped AI mascot"
                comment="Lia is a mascot I've designed for the AI in a digital platform called iônica"
                rotate={9}
                pinPosition="bottom-left"
                commentWidth={260}
                className="h-[132px] w-[132px]"
              />
            </div>
            <div className="pointer-events-auto absolute bottom-[10%] left-[calc(50%-3rem)] w-[150px]">
              <HeroSticker
                src={brazilSticker.url}
                alt="Sticker reading Based in Brazil with a Brazilian flag"
                rotate={-11}
                className="h-[104px] w-[150px]"
              />
            </div>
            <div className="pointer-events-auto absolute bottom-[6%] right-[1%] w-[160px]">
              <HeroSticker
                src={remoteWorkerSticker.url}
                alt="Sticker of a laptop reading Work Anywhere"
                comment="I'm open to remote opportunities worldwide"
                rotate={-6}
                pinPosition="top-left"
                className="h-[112px] w-[160px]"
              />
            </div>
          </div>


          {/* Left column — hero */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="order-2 max-w-[640px] lg:order-1"
          >
            {/* Editorial availability badge — inverted, dense, uppercase */}
            <div className="mb-10 inline-flex animate-badge-pop items-center gap-3 border border-foreground bg-foreground px-4 py-2 text-background">
              <span className="relative inline-flex size-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[hsl(var(--tag-green))] opacity-75" />
                <span className="relative inline-flex size-2.5 rounded-full bg-[hsl(var(--tag-green))]" />
              </span>
              <span
                className="text-[10px] font-bold uppercase tracking-[0.22em]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Available for new projects
              </span>
            </div>

            {/* Massive editorial headline — comma in signature blue */}
            <h1 className="animate-headline-reveal font-display text-[26vw] font-bold leading-[0.78] tracking-[-0.055em] text-foreground sm:text-[18vw] lg:text-[200px]">
              Hello<span className="text-primary">,</span>
            </h1>

            {/* Paragraph anchored by a blue rule — the Especular move */}
            <p className="animate-text-reveal stagger-2 mt-12 max-w-[520px] border-l-[6px] border-primary pl-6 text-[17px] font-medium leading-[1.55] text-foreground opacity-0 sm:hidden">
              I'm your next end-to-end product designer
            </p>
            <p className="animate-text-reveal stagger-2 mt-12 hidden max-w-[520px] border-l-[6px] border-primary pl-6 text-[19px] font-medium leading-[1.5] text-foreground opacity-0 sm:block">
              I'm a Senior Product Designer with{" "}
              <strong className="font-bold">10+ years of experience</strong>{" "}
              creating digital products that connect people and solve real problems — from mobile apps to AI-powered tools.
            </p>

            {/* CTAs — flat, hairline, with a hard offset shadow on the secondary */}
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




            {/* Bottom editorial rule — location as metadata */}
            <div className="mt-16 flex flex-wrap items-end justify-between gap-6 border-t-2 border-foreground pt-6 w-full md:w-full">
              <div>
                <p
                  className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Location
                </p>
                <p className="mt-1 flex items-center gap-1.5 font-display text-lg font-bold text-foreground">
                  <MapPin className="size-4 text-primary" />
                  Based in Brazil <span className="text-muted-foreground">· Open to remote worldwide</span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right column — profile card with editorial frame */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative order-1 w-full max-w-[260px] justify-self-center sm:max-w-[320px] lg:order-2 lg:justify-self-end"
          >
            {/* Rotated dashed frame — hand-marked editorial layout register */}
            <div
              className="pointer-events-none absolute -inset-4 -rotate-1 border-2 border-dashed border-foreground/50"
              aria-hidden="true"
            />

            {/* Solid card with hard offset shadow */}
            <div className="relative border-2 border-foreground bg-card p-4 text-card-foreground shadow-[12px_12px_0_0_hsl(var(--foreground))] sm:p-6">
              <div className="mx-auto mb-4 aspect-square w-full overflow-hidden border-2 border-foreground sm:mb-6">
                <img
                  src={heroPortrait}
                  alt="Rafael Bacellar"
                  loading="eager"
                  decoding="async"
                  className="size-full object-cover grayscale transition-all duration-500 hover:grayscale-0"
                />
              </div>

              <h2 className="font-display text-[22px] font-bold leading-none tracking-[-0.03em] text-foreground sm:text-[28px]">
                Rafael Bacellar
              </h2>
              <p
                className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-primary sm:mt-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Senior Product Designer
              </p>

              <div className="mt-3 grid grid-cols-2 gap-1.5 sm:mt-5">
                {profileSkills.map((s) => (
                  <span
                    key={s}
                    className="flex items-center justify-center border border-foreground px-2 py-1 text-center text-[9px] font-bold uppercase tracking-[0.14em] text-foreground sm:py-1.5"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {s}
                  </span>
                ))}
              </div>


              <div className="mt-6 flex justify-between border-t-2 border-foreground pt-4">
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

            {/* Floating editorial ID tag */}
            <div
              className="absolute -right-3 -top-3 bg-foreground px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-background"
              style={{ fontFamily: "var(--font-display)" }}
            >
              REF-2026
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
