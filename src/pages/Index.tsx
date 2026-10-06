import { motion } from "framer-motion";
import { Briefcase, Sparkles, Zap } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { Card } from "@/components/ui/card";
import { CompanyLogos } from "@/components/CompanyLogos";
import { ContactFooter } from "@/components/ContactFooter";
import { GameCharacter } from "@/components/GameCharacter";
import { PreferToPlayCard } from "@/components/PreferToPlayCard";
import { HeroSection } from "@/components/hero/HeroSection";
import { featuredProjects } from "@/data/featuredProjects";
import avatar from "@/assets/rafael-bacellar-avatar.jpg";
import { useTranslations } from "@/hooks/useTranslations";
import heroPortrait from "@/assets/hero-portrait.png";


const folderImages = [
  { slug: "ionic-ai-identity", index: 0 },
  { slug: "health-food-delivery", index: 0 },
  { slug: "meu-arco", index: 1 },
].map(({ slug, index }) => {
  const project = featuredProjects.find((p) => p.slug === slug);
  const media = project?.mediaItems[index];
  return media?.poster ?? media?.src ?? project?.poster ?? "";
}) as [string, string, string];

export default function Index() {
  const t = useTranslations();

  return (
    <div className="min-h-dvh text-foreground">
      <SiteNav />

      <main id="main-content">
        <HeroSection
          portraitSrc={heroPortrait}
          avatarSrc={avatar}
          folderImages={folderImages}
        />

        <section className="mx-auto max-w-6xl px-6 pb-16 pt-8 sm:py-16">
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

        <PreferToPlayCard />
      </main>

      <ContactFooter
        contactTitle={t.contactTitle}
        contactDescription={t.contactDescription}
        backToTop={t.backToTop}
        character={<GameCharacter />}
      />
    </div>
  );
}
