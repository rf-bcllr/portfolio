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



type Sticker = {
  src: string;
  alt: string;
  comment?: string;
  link?: { label: string; href: string };
  rotate: number;
  size: number;
  pin: "tl" | "tr" | "bl" | "br";
  desktopPos: string;
  mobilePos: string;
  mobileSize: number;
};

const stickers: Sticker[] = [
  {
    src: amayaSticker,
    alt: "Amaya, Rafael's dog, drawn as a sticker",
    comment: "My main design companion, Amaya",
    rotate: -7,
    size: 210,
    mobileSize: 132,
    pin: "tl",
    desktopPos: "left-[2%] top-[1%]",
    mobilePos: "left-0 top-2",
  },
  {
    src: liaSticker,
    alt: "Lia, a star-shaped AI mascot",
    comment: "Lia is a mascot I've designed for the AI in a digital platform called iônica",
    rotate: 6,
    size: 202,
    mobileSize: 126,
    pin: "tr",
    desktopPos: "right-[2%] top-[4%]",
    mobilePos: "right-0 top-10",
  },
  {
    src: ramenSticker,
    alt: "A bowl of ramen sticker",
    comment: "Ramen is my favorite food",
    rotate: -5,
    size: 190,
    mobileSize: 118,
    pin: "bl",
    desktopPos: "left-[4%] top-[38%]",
    mobilePos: "left-1 top-[53%]",
  },
  {
    src: gitSticker,
    alt: "GitHub octocat coding on a laptop sticker",
    comment: "I also build things!",
    link: { label: "Check my GitHub", href: "https://github.com/genai-ftd" },
    rotate: 7,
    size: 196,
    mobileSize: 122,
    pin: "br",
    desktopPos: "right-[3%] top-[40%]",
    mobilePos: "right-1 top-[55%]",
  },
  {
    src: brazilSticker,
    alt: "Based in Brazil sticker",
    rotate: -6,
    size: 212,
    mobileSize: 136,
    pin: "bl",
    desktopPos: "left-[17%] bottom-[1%]",
    mobilePos: "left-0 bottom-0",
  },
  {
    src: remoteSticker,
    alt: "Sticker of a person working remotely on a laptop",
    comment: "I'm open to remote opportunities worldwide",
    rotate: -5,
    size: 202,
    mobileSize: 128,
    pin: "br",
    desktopPos: "right-[16%] bottom-[3%]",
    mobilePos: "right-0 bottom-7",
  },
];


export default function Index() {
  const t = useTranslations();

  return (
    <div className="min-h-dvh text-foreground">
      <SiteNav />

      <main id="main-content">
        <section className="relative mx-auto max-w-7xl overflow-x-clip px-6 pb-24 pt-8 md:pt-12">
          <div className="relative h-[880px] overflow-visible sm:h-[820px] lg:h-[700px]" aria-label="Interactive introduction">
          {/* Organic sticker canvas — desktop */}
          <div className="pointer-events-none absolute inset-0 hidden lg:block">
            {stickers.map((s) => (
              <div key={s.alt} className={`pointer-events-auto absolute z-10 transition-[z-index] hover:z-40 focus-within:z-40 ${s.desktopPos}`}>
                <StickerComment
                  src={s.src}
                  alt={s.alt}
                  comment={s.comment}
                  link={s.link}
                  rotate={s.rotate}
                  size={s.size}
                  pin={s.pin}
                />
              </div>
            ))}
            <div className="pointer-events-auto absolute bottom-[1%] right-[40%] z-20" data-no-draw="true">
              <PostItNote rotate={3.5} className="max-w-[250px] p-5">
                Senior Product Designer with over 6 years of experience building end-to-end digital products that connect people and solve real problems.
              </PostItNote>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="absolute inset-x-0 top-[22%] z-20 mx-auto flex w-[min(620px,90%)] flex-col items-center text-center lg:top-[26%]"
          >
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
            <h1 className="animate-headline-reveal mt-8 font-display font-bold leading-[0.9] tracking-[-0.05em] text-foreground text-[clamp(2.5rem,6vw,4.5rem)]">
              I'm Rafael Bacellar<span className="text-primary">.</span>
            </h1>

            <p className="animate-text-reveal stagger-2 mt-4 text-balance text-[clamp(1.125rem,2vw,1.625rem)] font-medium leading-[1.3] text-muted-foreground opacity-0">
              Your next product designer<span className="text-primary">.</span>
            </p>

            {/* CTAs */}
            <div className="animate-text-reveal stagger-3 mt-10 flex flex-wrap justify-center gap-5 opacity-0">
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

          </motion.div>

          {/* Organic sticker canvas — mobile / tablet */}
          <div className="pointer-events-none absolute inset-0 lg:hidden">
            {stickers.map((s) => (
              <div key={s.alt} className={`pointer-events-auto absolute z-10 transition-[z-index] hover:z-40 focus-within:z-40 ${s.mobilePos}`}>
                <StickerComment src={s.src} alt={s.alt} comment={s.comment} link={s.link} rotate={s.rotate} pin={s.pin} size={s.mobileSize} />
              </div>
            ))}
            <div className="pointer-events-auto absolute bottom-[13%] left-[22%] z-20 sm:bottom-[11%] sm:left-[34%]" data-no-draw="true">
              <PostItNote rotate={-3} className="max-w-[220px] p-4">
                Senior Product Designer with over 6 years of experience building end-to-end digital products that connect people and solve real problems.
              </PostItNote>
            </div>
          </div>
          </div>


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
