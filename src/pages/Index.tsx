import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CompanyLogos } from "@/components/CompanyLogos";
import { ContactFooter } from "@/components/ContactFooter";
import { useTranslations } from "@/hooks/useTranslations";
import heroPortrait from "@/assets/hero-portrait.png";

const capabilities = [
  "Product Design",
  "User Research",
  "Design Systems",
  "AI Workflows",
  "UX Writing",
  "Prototyping",
];

export default function Index() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <main>
        <section className="mx-auto grid min-h-[calc(100vh-92px)] max-w-6xl gap-10 px-6 pb-16 pt-12 md:pt-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.72fr)] lg:items-end">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="mb-8 flex flex-wrap gap-2">
              <Badge variant="outline" className="border-border/80 bg-card/70 px-4 py-2 text-sm shadow-card backdrop-blur">
                Rafa Bacellar
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm shadow-card">
                End-to-End Product Designer
              </Badge>
            </div>

            <h1 className="max-w-5xl font-display text-6xl font-semibold leading-[0.86] md:text-8xl lg:text-[8.8rem]">
              Designing useful things with a little chaos.
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              Product Designer with 8+ years creating digital products, research systems, design systems and AI-assisted workflows for real teams.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="contrast" size="lg">
                <Link to="/work" data-cursor-action="navigate-internal">
                  View work <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/resume" data-cursor-action="navigate-internal">
                  Resume
                </Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, rotate: 1 }}
            animate={{ opacity: 1, scale: 1, rotate: -1 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-[24px] border border-border bg-card/75 p-4 shadow-card-hover backdrop-blur">
              <div className="absolute left-6 top-6 z-10 rounded-full border border-border bg-card/85 px-4 py-2 text-sm font-semibold backdrop-blur">
                rfbcllr.fig
              </div>
              <div className="figjam-grid rounded-[20px] border border-border bg-secondary/70 pt-10">
                <img
                  src={heroPortrait}
                  alt="Rafael Bacellar, Product Designer"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  className="mx-auto h-[360px] w-auto object-contain md:h-[480px]"
                />
              </div>
            </div>

            <div className="absolute -bottom-5 left-4 rounded-[24px] border border-border bg-card/90 p-4 shadow-card backdrop-blur md:-left-8">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-secondary p-3"><MapPin className="size-5" /></span>
                <div>
                  <p className="text-sm font-semibold">Brazil-based</p>
                  <p className="text-xs text-muted-foreground">Remote & on-site</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <div className="grid gap-0 overflow-hidden rounded-[24px] border border-border bg-card/65 shadow-card backdrop-blur md:grid-cols-3">
            <div className="border-b border-border p-6 md:border-b-0 md:border-r md:p-8">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-muted-foreground">Experience</p>
              <h2 className="mt-5 font-display text-4xl font-semibold">8+ years</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">Across edtech, fintech, retail, health and AI product workflows.</p>
            </div>
            <div className="border-b border-border p-6 md:border-b-0 md:border-r md:p-8">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-muted-foreground">Practice</p>
              <h2 className="mt-5 font-display text-4xl font-semibold">Systems thinker</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">From research synthesis to component libraries and product storytelling.</p>
            </div>
            <div className="p-6 md:p-8">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-muted-foreground">Pace</p>
              <h2 className="mt-5 font-display text-4xl font-semibold">Fast iterations</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">Comfortable moving between FigJam, Figma, prototypes and shipped UI.</p>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-8 px-6 py-16 md:grid-cols-[0.76fr_1.24fr] md:items-start md:py-24">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-muted-foreground">Capabilities</p>
            <h2 className="mt-4 font-display text-5xl font-semibold leading-[0.95]">Core capabilities</h2>
          </div>
            <div className="flex flex-wrap gap-3 border-t border-border pt-6 md:pt-8">
              {capabilities.map((capability) => (
                <span key={capability} className="rounded-full border border-border bg-card/70 px-4 py-2 text-sm font-semibold text-muted-foreground shadow-card backdrop-blur">
                  {capability}
                </span>
              ))}
            </div>
        </section>

        <CompanyLogos title={t.companiesTitle} subtitle={t.companiesSubtitle} />
      </main>

      <ContactFooter contactTitle={t.contactTitle} contactDescription={t.contactDescription} backToTop={t.backToTop} />
    </div>
  );
}
