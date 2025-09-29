import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useTranslations } from "@/hooks/useTranslations";
import MediaLightbox from "@/components/MediaLightbox";
import { ArrowRight } from "lucide-react";
import { ProjectCard } from "@/components/ProjectCard";
import { CertificationCard } from "@/components/CertificationCard";
import { AnimatedSection } from "@/components/AnimatedSection";

import avatar from "@/assets/rafael-bacellar-avatar.jpg";
import projectThumbNew1 from "@/assets/project-thumb-new-1.jpg";
import projectThumbNew2 from "@/assets/project-thumb-new-2.jpg";

const Index = () => {
  const [spot, setSpot] = useState({ x: 0, y: 0 });
  const [language, setLanguage] = useState<"pt" | "en">("pt");
  const [scrolled, setScrolled] = useState(false);
  const t = useTranslations(language);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSpot({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const projectMedia = [
    { src: "/lovable-uploads/90169309-3cbd-483f-8bdc-c5e96fc950da.png", href: "https://bento.me/rfbcllr", title: "Risk Analysis Dashboard - Cybersecurity Interface" },
    { src: "https://creatorspace.imgix.net/users/clnkcjnw802u4ou01tta5rqcm/6d1gUMMWYdGdDNPe-26ddde76011107.Y3JvcCw4MDgsNjMyLDAsMA%2520(1).png?w=750&h=750", href: "https://bento.me/rfbcllr", title: "Login, Onboarding and Home @Mural" },
    { src: "https://creatorspace.imgix.net/users/clnkcjnw802u4ou01tta5rqcm/EC90UL0Vda7i4S30-Screenshot%25202023-10-10%2520at%252022.10.09.png?w=750&h=750", href: "https://www.figma.com/proto/YpQOWHj5nJEZqHdi7hn3VR/Sa%C3%BAde-e-Ponto?kind=&node-id=978-7363&page-id=5%3A5&scaling=scale-down&show-proto-sidebar=1&starting-point-node-id=978%3A7363&mode=design&t=7depr6rbcfCS1Mkq-1", title: "Healthy Food & Groceries App Prototype" },
    { src: "https://storage.googleapis.com/creatorspace-public/users%2Fclnkcjnw802u4ou01tta5rqcm%2FUKVcVl4DB6Bzva11-ScreenRecording2024-11-19at08.19.59-ezgif.com-crop.gif", href: "https://bento.me/rfbcllr", title: "New app @isaac (GIF)" },
    { src: "https://storage.googleapis.com/creatorspace-public/users%2Fclnkcjnw802u4ou01tta5rqcm%2F6fsoLs1a9Yicj3I3-IA.gif", href: "https://bento.me/rfbcllr", title: "AI interactions (GIF)" },
    { src: "https://creatorspace.imgix.net/richdata/behance/posts/aHR0cHM6Ly9taXItczMtY2RuLWNmLmJlaGFuY2UubmV0L3Byb2plY3RzLzQwNC82ZThiZmIxNTgyNTU0MDcuWTNKdmNDdzJORGdzTlRBM0xEYzBPU3d5TlRVLnBuZw==.png?w=750&h=750", href: "https://www.behance.net/rfbcllr", title: "Behance project thumbnail 1" },
    { src: projectThumbNew1, href: "https://www.behance.net/rfbcllr", title: "Project thumbnail 2" },
    { src: projectThumbNew2, href: "https://www.behance.net/rfbcllr", title: "Project thumbnail 3" },
  ];

  const experienceBadges = [
    { years: 1, org: "isaac" },
    { years: 3, org: "ClassApp" },
    { years: 2, org: "Le biscuit" },
    { years: 2, org: "Sebrae" },
    { years: 2, org: "Sanar" },
  ];

  const formatExperience = (years: number, org: string) => {
    const isEn = language === "en";
    const word = isEn ? (years === 1 ? "year" : "years") : (years === 1 ? "ano" : "anos");
    return `+${years} ${word} @${org}`;
  };

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeMedia, setActiveMedia] = useState(0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="container mx-auto flex items-center justify-between py-4">
          {!scrolled ? (
            <a href="#inicio" className="font-semibold text-lg transition-opacity duration-300">rfbcllr.</a>
          ) : (
            <a href="#inicio" className="flex items-center">
              <img
                src={avatar}
                alt="Rafael Bacellar avatar"
                className="h-8 w-8 rounded-full border border-border object-cover transition-transform duration-300"
              />
            </a>
          )}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6">
              <a href="#projetos" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{t.projects}</a>
              <a href="#sobre" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{t.about}</a>
              <a href="#contato" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{t.contact}</a>
            </div>
            <div className="flex items-center gap-2">
              <LanguageToggle language={language} onLanguageChange={setLanguage} />
              <ThemeToggle />
              <Button asChild variant="contrast" size="sm">
                <a href="https://linkedin.com/in/rfbcllr" target="_blank" rel="noreferrer">LinkedIn</a>
              </Button>
            </div>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section
          id="inicio"
          onMouseMove={onMove}
          style={{ ['--x' as any]: `${spot.x}px`, ['--y' as any]: `${spot.y}px` }}
          className="relative overflow-hidden min-h-[90vh] flex items-center"
        >
          <div className="pointer-events-none absolute inset-0 -z-10 opacity-70" style={{
            background: "radial-gradient(800px at var(--x) var(--y), hsl(var(--primary)/0.3), transparent 70%)",
          }} />
          
          {/* Marquee com nome repetido */}
          <div className="absolute top-1/3 left-0 w-full overflow-hidden opacity-[0.03] pointer-events-none select-none -z-5">
            <div className="flex whitespace-nowrap animate-marquee">
              <span className="text-[clamp(4rem,15vw,12rem)] font-bold font-display px-8">
                Rafael Bacellar · Rafael Bacellar · Rafael Bacellar · Rafael Bacellar ·
              </span>
              <span className="text-[clamp(4rem,15vw,12rem)] font-bold font-display px-8">
                Rafael Bacellar · Rafael Bacellar · Rafael Bacellar · Rafael Bacellar ·
              </span>
            </div>
          </div>

          <div className="container mx-auto px-6 py-20">
            <div className="max-w-5xl mx-auto text-center">
              <div className="mb-8 animate-enter">
                <img
                  src={avatar}
                  alt="Retrato de Rafael Bacellar, Product Designer"
                  loading="eager"
                  width={160}
                  height={160}
                  className="mx-auto aspect-square size-32 md:size-40 rounded-full border-2 border-border object-cover"
                  style={{ boxShadow: "var(--shadow-elegant)" }}
                />
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight animate-fade-in font-display text-balance leading-[1.1]">
                {t.heroTitle}
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground animate-fade-in" style={{ animationDelay: "0.1s" }}>
                {t.heroDescription}
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <Button asChild variant="contrast" size="lg" className="text-base px-8">
                  <a href="https://linkedin.com/in/rfbcllr" target="_blank" rel="noreferrer" aria-label={t.talkOnLinkedIn}>
                    {t.talkOnLinkedIn}
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-base px-8">
                  <a href="#projetos">{t.viewProjects}</a>
                </Button>
              </div>
              <div className="mt-10 flex flex-wrap justify-center items-center gap-3 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                {t.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-sm px-4 py-1.5">{skill}</Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Projetos */}
        <section id="projetos" className="container mx-auto px-6 py-32">
          <AnimatedSection className="mb-16 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight font-display text-balance mb-4">
              {t.realExperiences}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">{t.projectsSubtitle}</p>
          </AnimatedSection>

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
            {projectMedia.map((item, i) => (
              <div key={i} className="mb-6 break-inside-avoid">
                <ProjectCard
                  src={item.src}
                  alt={item.title ?? `Project media ${i + 1}`}
                  index={i}
                  onClick={() => {
                    setActiveMedia(i);
                    setLightboxOpen(true);
                  }}
                />
              </div>
            ))}
          </div>

          <MediaLightbox
            items={projectMedia}
            index={activeMedia}
            open={lightboxOpen}
            onOpenChange={setLightboxOpen}
            onIndexChange={setActiveMedia}
          />

          <AnimatedSection className="mt-12 flex justify-center" delay={0.3}>
            <Button asChild variant="soft" size="lg" className="text-base px-8">
              <a href="https://www.behance.net/rfbcllr" target="_blank" rel="noreferrer">{t.moreOnBento}</a>
            </Button>
          </AnimatedSection>
        </section>

        {/* Sobre */}
        <section id="sobre" className="container mx-auto px-6 py-32">
          <div className="grid gap-12 lg:grid-cols-2 max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight font-display mb-6 text-balance">
                {t.aboutTitle}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t.aboutDescription}
              </p>
              <div className="mt-8">
                <Button asChild variant="contrast" size="lg" className="gap-2 text-base px-8">
                  <Link to={language === "pt" ? "/experiencia" : "/experience"}>
                    {t.fullExperience}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="rounded-2xl border p-8 hover-lift" style={{ boxShadow: "var(--shadow-card)" }}>
              <h3 className="text-xl font-semibold font-display mb-6">{t.competenciesTitle}</h3>
              <ul className="grid list-disc gap-3 pl-5 text-muted-foreground sm:grid-cols-2">
                {t.competencies.map((item) => (
                  <li key={item} className="leading-relaxed">{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Certificações */}
        <section id="certificacoes" className="container mx-auto px-6 py-32 max-w-4xl">
          <AnimatedSection className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-display mb-3">{t.certificationsTitle}</h2>
            <p className="text-lg text-muted-foreground">{t.certificationsSubtitle}</p>
          </AnimatedSection>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 max-w-2xl mx-auto">
            <CertificationCard
              title="Foundations of UX Design by Google"
              href="https://www.coursera.org/account/accomplishments/certificate/AHMR4UGP2G98"
              index={0}
            />
            <CertificationCard
              title="Strategic Design by The Starter"
              href="https://app.crowdclass.com/tokens/8394"
              index={1}
            />
            <CertificationCard
              title="UX Design for AI Systems"
              href="https://app.crowdclass.com/tokens/9153"
              index={2}
            />
            <CertificationCard
              title="UX Design Leadership"
              href="https://app.crowdclass.com/tokens/12141"
              index={3}
            />
          </div>
        </section>

        {/* Recomendações */}
        <section id="recomendacoes" className="container mx-auto px-6 py-16">
          <header className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight font-display">{t.recommendationsTitle}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {experienceBadges.map(({ years, org }) => (
                <Badge key={`${org}-${years}`} variant="secondary">{formatExperience(years, org)}</Badge>
              ))}
            </div>
          </header>

          <div className="grid gap-6 md:grid-cols-2">
            {t.recommendationsItems?.map((rec, idx) => (
              <Card className="p-6" key={idx}>
                <p className="text-sm text-muted-foreground">“{rec.quote}”</p>
                <p className="mt-3 font-medium">{rec.author}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Contato */}
        <section id="contato" className="relative isolate">
          <div className="absolute inset-0 -z-10 opacity-[0.08]" style={{ background: "var(--gradient-hero)" }} />
          <div className="container mx-auto px-6 py-24 md:py-32 text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight font-display mb-6 text-balance">
              {t.contactTitle}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">{t.contactDescription}</p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Button asChild variant="outline" size="lg" className="text-base px-8">
                <a href="#inicio">{t.backToTop}</a>
              </Button>
              <Button asChild variant="contrast" size="lg" className="text-base px-8">
                <a href="https://linkedin.com/in/rfbcllr" target="_blank" rel="noreferrer">LinkedIn</a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-10 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Rafael Bacellar · Todos os direitos reservados</p>
      </footer>
    </div>
  );
};

export default Index;
