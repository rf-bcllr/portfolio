import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase, MapPin, Sparkles, Zap } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CompanyLogos } from "@/components/CompanyLogos";
import { WorkProjectCard } from "@/components/WorkProjectCard";
import { ContactFooter } from "@/components/ContactFooter";
import { useTranslations } from "@/hooks/useTranslations";
import { featuredProjects } from "@/data/featuredProjects";
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
  const previewProjects = featuredProjects.slice(0, 2);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <main>
        <section className="mx-auto grid min-h-[calc(100vh-88px)] max-w-6xl gap-10 px-6 pb-16 pt-14 md:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="mb-6 flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-card px-4 py-2 text-sm shadow-card">
                Rafa Bacellar
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                End-to-End Product Designer
              </Badge>
            </div>

            <h1 className="font-display text-6xl font-semibold leading-[0.9] md:text-8xl lg:text-9xl">
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
            className="relative"
          >
            <Card className="relative overflow-hidden p-5 shadow-card-hover">
              <div className="absolute left-6 top-6 z-10 rounded-full border border-border bg-card/85 px-4 py-2 text-sm font-semibold backdrop-blur">
                rfbcllr.fig
              </div>
              <div className="rounded-[20px] border border-border bg-secondary pt-10">
                <img
                  src={heroPortrait}
                  alt="Rafael Bacellar, Product Designer"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  className="mx-auto h-[360px] w-auto object-contain md:h-[480px]"
                />
              </div>
            </Card>

            <div className="absolute -bottom-5 left-4 rounded-[24px] border border-border bg-card p-4 shadow-card md:-left-8">
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

        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-9 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="mb-3 inline-flex rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-muted-foreground">
                Focused work
              </span>
              <h2 className="font-display text-4xl font-semibold md:text-6xl">Selected projects</h2>
            </div>
            <Button asChild variant="outline">
              <Link to="/work" data-cursor-action="navigate-internal">
                All work <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-7">
            {previewProjects.map((project, index) => (
              <WorkProjectCard key={project.slug} project={project} index={index} compact />
            ))}
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
