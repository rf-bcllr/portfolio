import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase, Sparkles, Zap } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CompanyLogos } from "@/components/CompanyLogos";
import { ContactFooter } from "@/components/ContactFooter";
import { useTranslations } from "@/hooks/useTranslations";
import heroPortrait from "@/assets/hero-portrait.png";


const profileSkills = ["UX Design", "AI Tools", "UX/UI Design", "Research"];

export default function Index() {
  const t = useTranslations();

  return (
    <div className="min-h-screen text-foreground">
      <SiteNav />

      <main>
        <section className="mx-auto flex min-h-[calc(100vh-88px)] max-w-6xl flex-wrap items-center justify-center gap-x-16 gap-y-12 px-6 pb-16 pt-14 md:pt-20">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-[280px] shrink-0"
          >
            <Card className="overflow-hidden p-0 shadow-card">
              <div className="flex items-center gap-2 bg-primary px-4 py-1.5">
                <span className="inline-block size-2 rounded-sm bg-white/60" />
                <span className="text-[10.5px] font-bold uppercase tracking-[0.09em] text-primary-foreground">
                  Profile
                </span>
              </div>
              <div className="flex flex-col items-center gap-5 px-6 pb-6 pt-7">
                <div className="size-[120px] overflow-hidden rounded-full border-[3px] border-card shadow-[0_0_0_2px_hsl(var(--border))]">
                  <img
                    src={heroPortrait}
                    alt="Rafael Bacellar"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    className="size-full object-cover"
                  />
                </div>

                <div className="text-center">
                  <div className="font-display text-[19px] font-bold leading-tight text-foreground">
                    Rafael Bacellar
                  </div>
                  <div className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                    Senior Product Designer
                  </div>
                  <div className="mx-auto mt-2.5 h-[2.5px] w-7 rounded-sm bg-primary" />
                </div>

                <div className="flex flex-wrap justify-center gap-1.5">
                  {profileSkills.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-border px-2.5 py-[3px] text-[11px] font-medium text-muted-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div className="mt-1 flex items-center gap-3.5 text-[13px] font-medium">
                  <a
                    href="https://linkedin.com/in/rfbcllr"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary"
                  >
                    LinkedIn
                  </a>
                  <span className="text-border">·</span>
                  <a href="mailto:rf.bcllr@gmail.com" className="text-muted-foreground">
                    Email
                  </a>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Right column */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="max-w-[500px]"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--tag-green-border))] bg-[hsl(var(--tag-green-bg))] px-3 py-1.5 text-xs font-semibold text-[hsl(var(--tag-green))]">
              <span className="inline-block size-[7px] rounded-full bg-[hsl(var(--tag-green))]" />
              Available for new projects
            </div>

            <h1 className="font-display text-7xl font-semibold leading-[1] tracking-[-0.04em] text-foreground md:text-8xl">
              Hello,
            </h1>

            <p className="mt-6 max-w-[430px] text-[17px] leading-[1.75] text-muted-foreground">
              I'm a Senior Product Designer with{" "}
              <strong className="font-semibold text-foreground">8+ years of experience</strong>{" "}
              creating digital products that connect people and solve real problems — from mobile apps to AI-powered tools.
            </p>

            <div className="mt-8 flex flex-wrap gap-2.5">
              <Button asChild variant="contrast" size="lg">
                <Link to="/work" data-cursor-action="navigate-internal">
                  View Work <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/resume" data-cursor-action="navigate-internal">
                  Resume
                </Link>
              </Button>
            </div>

            <div className="mt-11 inline-flex items-center gap-2.5 rounded-[10px] border border-border bg-primary/[0.04] px-5 py-3 shadow-card [border-left-width:3px] [border-left-color:hsl(var(--primary))]">
              <span className="text-base">📍</span>
              <span className="text-sm leading-snug text-muted-foreground">
                Based in <strong className="font-semibold text-foreground">Brazil</strong> · Open to remote worldwide
              </span>
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
