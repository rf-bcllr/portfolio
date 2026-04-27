import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase, MapPin, Sparkles, Zap } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
        <section className="mx-auto grid min-h-[calc(100vh-88px)] max-w-5xl gap-12 px-6 pb-16 pt-28 md:pt-32 lg:grid-cols-[264px_minmax(0,1fr)] lg:items-center lg:gap-16">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="mb-6 flex flex-wrap gap-2">
              <Badge variant="outline" className="rounded-full border-[1.5px] bg-card px-4 py-1.5 text-sm shadow-card">
                Rafa Bacellar
              </Badge>
              <Badge variant="secondary" className="rounded-full px-4 py-1.5 text-sm">
                End-to-End Product Designer
              </Badge>
            </div>

            <h1 className="font-display text-6xl font-semibold leading-none md:text-8xl">
              Designing useful things with a little chaos.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              Product Designer with 8+ years creating digital products, research systems, design systems and AI-assisted workflows for real teams.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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
            className="relative lg:order-first"
          >
            <Card className="relative overflow-hidden border-[1.5px] p-0 shadow-card lg:order-first">
              <div className="figjam-label-strip flex items-center gap-2 px-4 py-1.5">
                <span className="size-2 rounded-[1px] bg-primary-foreground/60" aria-hidden />
                <span className="text-[10.5px] font-bold uppercase tracking-[0.09em] text-primary-foreground">Profile</span>
              </div>
              <div className="flex flex-col items-center gap-5 p-6 text-center">
                <img
                  src={heroPortrait}
                  alt="Rafael Bacellar, Product Designer"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  className="size-32 rounded-full border-[3px] border-card object-cover shadow-[0_0_0_2px_hsl(var(--border))]"
                />
                <div>
                  <p className="text-xl font-bold leading-tight text-foreground">Rafael Bacellar</p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">Product Designer</p>
                  <div className="mx-auto mt-3 h-0.5 w-7 rounded-full bg-primary" />
                </div>
              </div>
            </Card>

            <div className="absolute -bottom-5 left-4 rounded-[10px] border-[1.5px] border-border bg-card p-4 shadow-card md:-left-8">
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

        <section className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-6 md:rotate-[-0.7deg]">
              <Briefcase className="mb-5 size-7" />
              <h2 className="font-display text-2xl font-semibold">8+ years</h2>
              <p className="mt-2 text-muted-foreground">Across edtech, fintech, retail, health and AI product workflows.</p>
            </Card>
            <Card className="p-6 md:translate-y-6 md:rotate-[0.5deg]">
              <Sparkles className="mb-5 size-7" />
              <h2 className="font-display text-2xl font-semibold">Systems thinker</h2>
              <p className="mt-2 text-muted-foreground">From research synthesis to component libraries and product storytelling.</p>
            </Card>
            <Card className="p-6 md:rotate-[-0.4deg]">
              <Zap className="mb-5 size-7" />
              <h2 className="font-display text-2xl font-semibold">Fast iterations</h2>
              <p className="mt-2 text-muted-foreground">Comfortable moving between FigJam, Figma, prototypes and shipped UI.</p>
            </Card>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-12">
          <Card className="p-6">
            <h2 className="mb-5 font-display text-3xl font-semibold">Core capabilities</h2>
            <div className="flex flex-wrap gap-3">
              {capabilities.map((capability) => (
                <span key={capability} className="rounded-full border border-border bg-secondary px-4 py-2 text-sm font-semibold text-muted-foreground">
                  {capability}
                </span>
              ))}
            </div>
          </Card>
        </section>

        <CompanyLogos title={t.companiesTitle} subtitle={t.companiesSubtitle} />
      </main>

      <ContactFooter contactTitle={t.contactTitle} contactDescription={t.contactDescription} backToTop={t.backToTop} />
    </div>
  );
}
