import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ContactFooter } from "@/components/ContactFooter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTranslations } from "@/hooks/useTranslations";
import { useParallaxLayers } from "@/hooks/useParallax";
import { ArrowRight, Heart, Zap, ChevronRight, Search, RefreshCw, Rocket, TrendingUp } from "lucide-react";
import { ProjectCard } from "@/components/ProjectCard";
import { CertificationCard } from "@/components/CertificationCard";
import { CompanyLogos } from "@/components/CompanyLogos";
import { AnimatedSection } from "@/components/AnimatedSection";
import { InteractiveHeadline } from "@/components/InteractiveHeadline";
import { Marquee } from "@/components/Marquee";
import avatar from "@/assets/rafael-bacellar-avatar.jpg";
import heroPortrait from "@/assets/hero-portrait.png";
import professionalPhoto from "@/assets/rafael-professional.png";
import aboutMePortrait from "@/assets/about-me-portrait-new.jpg";
import projectThumbNew1 from "@/assets/project-thumb-new-1.jpg";
import projectThumbNew2 from "@/assets/project-thumb-new-2.jpg";
import projMuralNew from "@/assets/proj-mural-new.png";
import projHealthyNew from "@/assets/proj-healthy-new.png";
import projThumbNew3 from "@/assets/proj-thumb-new-3.png";
import inisAvatar from "@/assets/inis-avatar.png";
import esdrasAvatar from "@/assets/esdras-avatar.png";
const Index = () => {
  const [scrolled, setScrolled] = useState(false);
  const t = useTranslations();
  
  // Parallax layers: [background, marquee, avatar]
  const [bgParallax, marqueeParallax, avatarParallax] = useParallaxLayers([
    { speed: 0.3, direction: 'down' }, // Background moves slower, downward
    { speed: 0.15, direction: 'down' }, // Marquee moves even slower
    { speed: 0.5, direction: 'up' }, // Avatar moves faster, upward
  ]);
  
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const projectMedia = [
    // Column 1
    {
      src: "/lovable-uploads/cyberbrake-dashboard.png",
      title: "Risk Analysis Dashboard for Cyberbrake",
      chips: ["UI/UX", "Data Viz"],
      slug: "cyberbrake"
    },
    {
      src: projMuralNew,
      title: "Mural",
      chips: ["Branding", "UI"],
      slug: "mural"
    },
    {
      src: projHealthyNew,
      title: "Healthy Food Delivery App",
      chips: ["UI/UX", "Research"],
      slug: "health-food-delivery"
    },
    {
      src: projectThumbNew2,
      title: "Students' Transportation Feature",
      chips: ["UI/UX", "Research"],
      slug: "students-transportation"
    },
    // Column 2
    {
      src: "https://storage.googleapis.com/creatorspace-public/users%2Fclnkcjnw802u4ou01tta5rqcm%2FUKVcVl4DB6Bzva11-ScreenRecording2024-11-19at08.19.59-ezgif.com-crop.gif",
      title: "Meu Arco",
      chips: ["UI/UX", "Research"],
      slug: "meu-arco"
    },
    {
      src: "https://storage.googleapis.com/creatorspace-public/users%2Fclnkcjnw802u4ou01tta5rqcm%2F6fsoLs1a9Yicj3I3-IA.gif",
      title: "AI Writing Assistant",
      chips: ["UI/UX", "AI"],
      slug: "ai-writing-assistant"
    },
    // Column 3
    {
      src: projThumbNew3,
      title: "Healthy Food Delivery App",
      chips: ["UI/UX", "Research"],
      slug: "health-food-delivery"
    },
    {
      src: projectThumbNew1,
      title: "Digital Signature Feature",
      chips: ["UI/UX", "Research"],
      slug: "digital-signature"
    }
  ];
  return <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="container mx-auto flex items-center justify-between py-4">
          {!scrolled ? <a href="#inicio" data-cursor-action="home" className="font-semibold text-lg transition-opacity duration-300">rfbcllr.</a> : <a href="#inicio" data-cursor-action="home" className="flex items-center">
              <img src={avatar} alt="Rafael Bacellar avatar" className="h-8 w-8 rounded-full border border-border object-cover transition-transform duration-300" />
            </a>}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button asChild variant="contrast" size="sm">
                <a href="https://linkedin.com/in/rfbcllr" target="_blank" rel="noreferrer" data-cursor-link>LinkedIn</a>
              </Button>
            </div>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section id="inicio" className="relative overflow-hidden min-h-[70vh] flex items-center justify-center">
          
          {/* Marquee com nome repetido - Background */}
          <div className="absolute top-1/2 left-0 w-full overflow-hidden opacity-[0.03] pointer-events-none select-none -z-10" style={{
            transform: `translateY(${marqueeParallax}px)`,
            willChange: 'transform'
          }}>
            <div className="flex whitespace-nowrap animate-marquee">
              <span className="text-[clamp(4rem,15vw,12rem)] font-bold font-display px-8">
                Rafael Bacellar · Rafael Bacellar · Rafael Bacellar · Rafael Bacellar ·
              </span>
              <span className="text-[clamp(4rem,15vw,12rem)] font-bold font-display px-8">
                Rafael Bacellar · Rafael Bacellar · Rafael Bacellar · Rafael Bacellar ·
              </span>
            </div>
          </div>

          <div className="container mx-auto px-6 py-8 md:py-12">
            <div className="max-w-6xl mx-auto text-center">
              
              {/* Intro Text */}
              <motion.p 
                className="text-sm md:text-base text-muted-foreground mb-6 tracking-wide"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0 }}
              >
                👋🏿 Hi, my name is
              </motion.p>

              {/* Layered Typography + Photo Container */}
              <div className="relative flex flex-col items-center justify-center">
                
                {/* Line 1: "Rafa" - Above photo */}
                <motion.span 
                  className="block text-[clamp(3.5rem,14vw,11rem)] font-bold font-display leading-[0.85] tracking-tight relative z-20"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  Rafa
                </motion.span>

                {/* Photo - Positioned between the text lines, overlapping "Rafa" */}
                <motion.div 
                  className="relative z-10 -mt-8 md:-mt-14 lg:-mt-20 -mb-2 md:-mb-4 lg:-mb-6"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                  style={{
                    transform: `translateY(${avatarParallax * 0.5}px)`,
                    willChange: 'transform'
                  }}
                >
                  <img 
                    src={heroPortrait} 
                    alt="Rafael Bacellar, Product Designer"
                    className="h-[180px] md:h-[260px] lg:h-[340px] w-auto object-contain mx-auto"
                    style={{
                      maskImage: 'linear-gradient(to bottom, black 0%, black 75%, transparent 100%)',
                      WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 75%, transparent 100%)'
                    }}
                  />
                </motion.div>

                {/* Line 2: "Bacellar" - Outline style, behind photo */}
                <motion.span 
                  className="block text-[clamp(3.5rem,14vw,11rem)] font-bold font-display leading-[0.85] tracking-tight relative z-[5]"
                  style={{
                    WebkitTextStroke: '1.5px currentColor',
                    WebkitTextFillColor: 'transparent'
                  }}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  Bacellar
                </motion.span>
              </div>

              {/* Description */}
              <motion.p 
                className="mt-6 md:mt-8 max-w-xl mx-auto text-sm md:text-base text-muted-foreground"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45 }}
              >
                {t.heroDescription}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div 
                className="mt-8 flex flex-wrap justify-center gap-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.55 }}
              >
                <Button asChild variant="contrast" size="lg" className="text-base px-8">
                  <a href="https://linkedin.com/in/rfbcllr" target="_blank" rel="noreferrer" data-cursor-link aria-label={t.talkOnLinkedIn}>
                    {t.talkOnLinkedIn}
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-base px-8">
                  <a href="#projetos" data-cursor-action="scroll-down">{t.viewProjects}</a>
                </Button>
              </motion.div>

              {/* Skills Marquee */}
              <motion.div 
                className="mt-10 w-full max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.65 }}
              >
                <Marquee items={t.skills} speed="slow" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Companies Section */}
        <CompanyLogos title={t.companiesTitle} subtitle={t.companiesSubtitle} />

        {/* Projetos */}
        <section id="projetos" className="container mx-auto px-6 py-32">
          <AnimatedSection className="mb-16 text-center max-w-3xl mx-auto">
            <InteractiveHeadline 
              text={t.realExperiences}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight font-display text-balance mb-4"
            />
            <p className="text-lg md:text-xl text-muted-foreground">{t.projectsSubtitle}</p>
          </AnimatedSection>

          {/* Projects Grid - Manual Three-Column Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Column 1: Cyberbrake, Mural, Healthy Food Delivery App, Students' Transportation Feature */}
            <div className="space-y-6">
              <ProjectCard 
                src={projectMedia[0].src} 
                alt={projectMedia[0].title ?? "Project 1"} 
                title={projectMedia[0].title} 
                chips={projectMedia[0].chips} 
                index={0}
                slug={projectMedia[0].slug}
              />
              <ProjectCard 
                src={projectMedia[1].src} 
                alt={projectMedia[1].title ?? "Project 2"} 
                title={projectMedia[1].title} 
                chips={projectMedia[1].chips} 
                index={1}
                slug={projectMedia[1].slug}
              />
              <ProjectCard 
                src={projectMedia[2].src} 
                alt={projectMedia[2].title ?? "Project 3"} 
                title={projectMedia[2].title} 
                chips={projectMedia[2].chips} 
                index={2}
                slug={projectMedia[2].slug}
              />
              <ProjectCard 
                src={projectMedia[3].src} 
                alt={projectMedia[3].title ?? "Project 4"} 
                title={projectMedia[3].title} 
                chips={projectMedia[3].chips} 
                index={3}
                slug={projectMedia[3].slug}
              />
            </div>

            {/* Column 2: Meu Arco, AI Writing Assistant */}
            <div className="space-y-6">
              <ProjectCard 
                src={projectMedia[4].src} 
                alt={projectMedia[4].title ?? "Project 5"} 
                title={projectMedia[4].title} 
                chips={projectMedia[4].chips} 
                index={4}
                slug={projectMedia[4].slug}
              />
              <ProjectCard 
                src={projectMedia[5].src} 
                alt={projectMedia[5].title ?? "Project 6"} 
                title={projectMedia[5].title} 
                chips={projectMedia[5].chips} 
                index={5}
                slug={projectMedia[5].slug}
              />
            </div>

            {/* Column 3: Healthy Food Delivery App, Digital Signature Feature */}
            <div className="space-y-6">
              <ProjectCard 
                src={projectMedia[6].src} 
                alt={projectMedia[6].title ?? "Project 7"} 
                title={projectMedia[6].title} 
                chips={projectMedia[6].chips} 
                index={6}
                slug={projectMedia[6].slug}
              />
              <ProjectCard 
                src={projectMedia[7].src} 
                alt={projectMedia[7].title ?? "Project 8"} 
                title={projectMedia[7].title} 
                chips={projectMedia[7].chips} 
                index={7}
                slug={projectMedia[7].slug}
              />
            </div>
          </div>
        </section>

        {/* Design Process Section */}
        <section id="design-process" className="container mx-auto px-6 py-32">
          <AnimatedSection className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight font-display mb-6 text-center">
              {t.designProcessTitle}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center mb-16">
              {t.designProcessIntro}
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { 
                  icon: Search, 
                  title: t.designProcessStrategize?.title || "Strategize",
                  description: t.designProcessStrategize?.description || "Explore the problem as deeply as possible. Understand the needs of the users and business, the context and the competition.",
                  delay: 0
                },
                { 
                  icon: RefreshCw, 
                  title: t.designProcessIterate?.title || "Iterate",
                  description: t.designProcessIterate?.description || "Generate as many ideas as possible. Do not be afraid to experiment and try out new ideas. Sketch, create wireframes, build prototypes.",
                  delay: 0.1
                },
                { 
                  icon: Rocket, 
                  title: t.designProcessLaunch?.title || "Launch",
                  description: t.designProcessLaunch?.description || "Test feasibility of the product and get feedback from users. Be prepared to make changes to the product based on the feedback.",
                  delay: 0.2
                },
                { 
                  icon: TrendingUp, 
                  title: t.designProcessMeasure?.title || "Measure",
                  description: t.designProcessMeasure?.description || "The design process is never really finished. Use metrics and data to iterate and improve the product and its performance.",
                  delay: 0.3
                }
              ].map((process, index) => (
                <motion.div
                  key={process.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: process.delay,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  viewport={{ once: true }}
                >
                  <Card className="rounded-2xl p-6 hover-lift h-full" style={{ boxShadow: "var(--shadow-card)" }}>
                    <process.icon className="w-8 h-8 text-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-3">{process.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{process.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </section>

        {/* Sobre */}
        <section id="sobre" className="container mx-auto px-6 py-32">
          <InteractiveHeadline
            text={t.aboutTitle}
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight font-display mb-12 text-balance text-center lg:text-left"
          />
          
          <AnimatedSection>
            <div className="grid gap-16 lg:gap-20 lg:grid-cols-[1fr_1.2fr] max-w-6xl mx-auto items-start">
              {/* Left Column - Visual Card (Photo + Floating Emojis + Text) */}
              <div className="order-1 lg:order-1 flex flex-col justify-between">
                <div>
                  {/* Photo Card with Floating Emojis */}
                  <Card className="relative overflow-visible p-0 mb-8 max-w-md mx-auto lg:mx-0 rounded-xl hover-lift" style={{
                  boxShadow: "var(--shadow-elegant)"
                }}>
                    <div className="relative">
                      <img src={aboutMePortrait} alt="Portrait of Rafael Bacellar, Product Designer" loading="lazy" className="w-full max-h-[420px] object-cover object-[center_30%] rounded-xl" />
                      
                      {/* Liquid Glass Floating Chips */}
                      <motion.div 
                        className="liquid-glass-chip absolute -top-8 -left-6 text-lg pointer-events-auto cursor-pointer"
                        style={{ animation: 'floatReaction 10s ease-in-out infinite', animationDelay: '0s' }}
                        whileHover={{ scale: 1.15 }}
                        aria-label="Creative Writing"
                      >
                        <span aria-hidden="true">✍🏿</span>
                        <span className="font-medium">Creative Writing</span>
                      </motion.div>

                      <motion.div 
                        className="liquid-glass-chip absolute -top-6 -right-8 text-base pointer-events-auto cursor-pointer"
                        style={{ animation: 'floatReactionAlt 12s ease-in-out infinite', animationDelay: '1.5s' }}
                        whileHover={{ scale: 1.15 }}
                        aria-label="Visual Design"
                      >
                        <span aria-hidden="true">🎨</span>
                        <span className="font-medium">Visual Design</span>
                      </motion.div>

                      <motion.div 
                        className="liquid-glass-chip absolute top-1/2 -right-10 text-sm pointer-events-auto cursor-pointer"
                        style={{ animation: 'floatReaction 11s ease-in-out infinite', animationDelay: '3s' }}
                        whileHover={{ scale: 1.15 }}
                        aria-label="Fast Iterations"
                      >
                        <span aria-hidden="true">⚡</span>
                        <span className="font-medium">Fast Iterations</span>
                      </motion.div>

                      <motion.div 
                        className="liquid-glass-chip absolute -bottom-4 -left-8 text-base pointer-events-auto cursor-pointer"
                        style={{ animation: 'floatReactionAlt 13s ease-in-out infinite', animationDelay: '4.5s' }}
                        whileHover={{ scale: 1.15 }}
                        aria-label="Communication"
                      >
                        <span aria-hidden="true">💬</span>
                        <span className="font-medium">Communication</span>
                      </motion.div>

                      <motion.div 
                        className="liquid-glass-chip absolute bottom-8 -right-6 text-base pointer-events-auto cursor-pointer"
                        style={{ animation: 'floatReaction 14s ease-in-out infinite', animationDelay: '6s' }}
                        whileHover={{ scale: 1.15 }}
                        aria-label="Problem Solving"
                      >
                        <span aria-hidden="true">🧠</span>
                        <span className="font-medium">Problem Solving</span>
                      </motion.div>

                      <motion.div 
                        className="liquid-glass-chip absolute -bottom-6 left-1/2 -translate-x-1/2 text-lg pointer-events-auto cursor-pointer"
                        style={{ animation: 'floatReactionAlt 15s ease-in-out infinite', animationDelay: '2s' }}
                        whileHover={{ scale: 1.15 }}
                        aria-label="Brazilian Designer"
                      >
                        <span aria-hidden="true">🇧🇷</span>
                        <span className="font-medium">Brazilian</span>
                      </motion.div>
                    </div>
                  </Card>

                  {/* About Me Text */}
                  <div className="text-center lg:text-left max-w-md mx-auto lg:mx-0">
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {t.aboutDescription}
                    </p>
                  </div>
                </div>

                {/* CTA Button - Desktop only, bottom aligned */}
                <div className="hidden lg:block mt-8">
                  <Button asChild variant="contrast" size="default">
                    <Link to="/experience" data-cursor-action="navigate-internal">
                      {t.fullExperience} <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Right Column - Skills Cards */}
              <div className="space-y-6 order-2 lg:order-2 flex flex-col justify-between">
                {/* My Power Skills Card */}
                <Card className="rounded-2xl p-6 hover-lift" style={{
                boxShadow: "var(--shadow-card)"
              }}>
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-5 h-5 text-foreground" aria-hidden="true" />
                    <h3 className="text-xl font-semibold font-display text-foreground">{t.powerSkillsTitle}</h3>
                  </div>
                  <ul className="space-y-2">
                    {t.powerSkills.map((skill, index) => <motion.li key={skill.text} initial={{
                    opacity: 0,
                    x: -10
                  }} whileInView={{
                    opacity: 1,
                    x: 0
                  }} transition={{
                    delay: index * 0.06,
                    duration: 0.42,
                    ease: [0.16, 1, 0.3, 1]
                  }} viewport={{
                    once: true
                  }} className="text-muted-foreground flex items-center gap-2" aria-label={skill.text}>
                        <span aria-hidden="true">{skill.emoji}</span>
                        <span>{skill.text}</span>
                      </motion.li>)}
                  </ul>
                </Card>

                {/* Hobbies Card */}
                <Card className="rounded-2xl p-6 hover-lift" style={{
                boxShadow: "var(--shadow-card)"
              }}>
                  <div className="flex items-center gap-2 mb-4">
                    <Heart className="w-5 h-5 text-foreground" aria-hidden="true" />
                    <h3 className="text-xl font-semibold font-display text-foreground">{t.hobbiesTitle}</h3>
                  </div>
                  <ul className="space-y-2">
                    {t.hobbies.map((hobby, index) => <motion.li key={hobby.text} initial={{
                    opacity: 0,
                    x: -10
                  }} whileInView={{
                    opacity: 1,
                    x: 0
                  }} transition={{
                    delay: index * 0.06,
                    duration: 0.42,
                    ease: [0.16, 1, 0.3, 1]
                  }} viewport={{
                    once: true
                  }} className="text-muted-foreground flex items-center gap-2" aria-label={hobby.text}>
                        <span aria-hidden="true">{hobby.emoji}</span>
                        <span>{hobby.text}</span>
                      </motion.li>)}
                  </ul>
                </Card>
              </div>
            </div>

            {/* CTA Button - Mobile only, centered */}
            <div className="flex justify-center mt-16 lg:hidden">
              <Button asChild variant="contrast" size="lg">
                <Link to="/experience" data-cursor-action="navigate-internal">
                  {t.fullExperience} <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </AnimatedSection>
        </section>

        {/* Certificações */}
        <section id="certificacoes" className="container mx-auto px-6 py-32">
          <AnimatedSection className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-display mb-3">{t.certificationsTitle}</h2>
            <p className="text-lg text-muted-foreground">{t.certificationsSubtitle}</p>
          </AnimatedSection>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 max-w-6xl mx-auto">
            <CertificationCard title="Foundations of UX Design by Google" href="https://www.coursera.org/account/accomplishments/certificate/AHMR4UGP2G98" index={0} />
            <CertificationCard title="Strategic Design by The Starter" href="https://app.crowdclass.com/tokens/8394" index={1} />
            <CertificationCard title="UX Design for AI Systems" href="https://app.crowdclass.com/tokens/9153" index={2} />
            <CertificationCard title="UX Design Leadership" href="https://app.crowdclass.com/tokens/12141" index={3} />
            <CertificationCard title="Game UX Design Foundations" href="https://www.interaction-design.org/members/rafael-bacellar-ramos-reis/certificate/masterclass/mcc_5847201105b245858759024389ba2499" index={4} />
            <CertificationCard title="UX/UI na Prática (Masterclass)" href="https://www.sympla.com.br/download-certificado?t=wEW3bUAO3xBIV29pYRsKL4vdl1mx8jSIU2FaPKEkrrI" index={5} />
            <CertificationCard title="Design for the 21st Century with Don Norman" href="https://www.interaction-design.org/members/rafael-bacellar-ramos-reis/certificate/masterclass/mcc_e5b0cd9411fb4af9993fc87c1b4f8291" index={6} />
          </div>
        </section>

        {/* Recomendações */}
        <section id="recomendacoes" className="container mx-auto px-6 py-32">
          <header className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-display">{t.recommendationsTitle}</h2>
          </header>

          <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
            {t.recommendationsItems?.map((rec, idx) => {
            const avatar = idx === 0 ? inisAvatar : esdrasAvatar;
            return <Card className="p-8 hover-lift" key={idx} style={{
              boxShadow: "var(--shadow-card)"
            }}>
                  <div className="flex items-start gap-4 mb-6">
                    <a href={rec.linkedin} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 transition-opacity hover:opacity-80">
                      <img src={avatar} alt={rec.author} className="w-16 h-16 rounded-full object-cover border-2 border-border" />
                    </a>
                    <div>
                      <h3 className="font-semibold text-lg mb-0.5">{rec.author}</h3>
                      <p className="text-sm text-muted-foreground">{rec.role}</p>
                      {rec.description && <p className="text-xs text-muted-foreground mt-0.5">{rec.description}</p>}
                    </div>
                  </div>
                  <p className="text-base leading-relaxed text-muted-foreground italic">"{rec.quote}"</p>
                </Card>;
          })}
          </div>
        </section>

      </main>

      <ContactFooter 
        contactTitle={t.contactTitle}
        contactDescription={t.contactDescription}
        backToTop={t.backToTop}
      />
    </div>;
};
export default Index;