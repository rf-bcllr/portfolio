import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from '@/hooks/useTranslations';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Mail, Phone, MapPin, Calendar, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AnimatedSection } from '@/components/AnimatedSection';
import avatar from "@/assets/rafael-bacellar-avatar.jpg";
interface ExperiencePageProps {
  language: "pt" | "en";
  onLanguageChange?: (lang: "pt" | "en") => void;
}
const Experience = ({
  language = "pt",
  onLanguageChange
}: ExperiencePageProps) => {
  const t = useTranslations(language);
  const [isVisible, setIsVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    // Reset scroll position to top
    window.scrollTo(0, 0);
    setIsVisible(true);
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const experiences = [{
    title: "Product Designer",
    company: "isaac",
    period: language === "pt" ? "2024 - Presente" : "2024 - Present",
    description: language === "pt" ? "Design de produtos digitais end-to-end, design system e interfaces escaláveis." : "End-to-end digital product design, design system and scalable interfaces.",
    current: true,
    secondaryChips: ["Fintech", "B2B"]
  }, {
    title: "Product Designer",
    company: "ClassApp",
    period: "2021 - 2024",
    description: language === "pt" ? "Liderança em design de produto, pesquisa com usuários e colaboração com desenvolvimento." : "Product design leadership, user research and development collaboration.",
    current: false,
    secondaryChips: ["Edtech", "B2B", "B2C"]
  }, {
    title: "Design Analyst",
    company: "Le biscuit",
    period: "2019 - 2021",
    description: language === "pt" ? "Análise e design de interfaces digitais, melhoria de experiência do usuário." : "Digital interface analysis and design, user experience improvement.",
    current: false,
    secondaryChips: ["Retail", "B2B", "B2C"]
  }, {
    title: "Design & Marketing Analyst",
    company: "Sebrae Bahia",
    period: "2017 - 2019",
    description: language === "pt" ? "Design gráfico, marketing digital e comunicação visual para empreendedores." : "Graphic design, digital marketing and visual communication for entrepreneurs.",
    current: false,
    secondaryChips: ["Govt. Agency", "B2B"]
  }, {
    title: "Brand Designer",
    company: "Sanar",
    period: "2015 - 2016",
    description: language === "pt" ? "Desenvolvimento de identidade visual e materiais de marca para educação médica." : "Visual identity development and brand materials for medical education.",
    current: false,
    secondaryChips: ["Healthtech", "B2C"]
  }];
  const skills = ["User Research", "Visual Design", "Prototyping", "Design System", "Usability Testing", "Information Architecture", "Interaction Design", "Design Thinking", "Agile", "Figma", "Adobe Creative Suite", "HTML/CSS"];
  const softSkills = language === "pt" ? ["Liderança", "Comunicação", "Colaboração", "Pensamento Crítico", "Adaptabilidade", "Criatividade", "Iterações Rápidas"] : ["Leadership", "Communication", "Collaboration", "Critical Thinking", "Adaptability", "Creativity", "Fast Iterations"];
  const tools = ["Figma", "Adobe XD", "Photoshop", "Illustrator", "Sketch", "Framer", "Miro", "FigJam", "Figma Make", "Lovable", "v0"];
  const languages = [{
    name: t.portuguese,
    level: t.native
  }, {
    name: t.english,
    level: t.advanced
  }, {
    name: t.german,
    level: t.basic
  }, {
    name: t.spanish,
    level: t.basic
  }];
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };
  return <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="container mx-auto flex items-center justify-between py-4">
          {!scrolled ? <Link to="/" className="font-semibold text-lg transition-opacity duration-300">rfbcllr.</Link> : <Link to="/" className="flex items-center">
              <img src={avatar} alt="Rafael Bacellar avatar" className="h-8 w-8 rounded-full border border-border object-cover transition-transform duration-300" />
            </Link>}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="contrast" size="sm">
              <a href="https://linkedin.com/in/rfbcllr" target="_blank" rel="noreferrer">LinkedIn</a>
            </Button>
          </div>
        </nav>
      </header>

      <motion.div className="container mx-auto px-4 py-8 max-w-4xl" variants={containerVariants} initial="hidden" animate={isVisible ? "visible" : "hidden"}>
        {/* Page Header */}
        <motion.div className="flex items-center justify-between mb-8" variants={itemVariants}>
          <Link to="/#sobre">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              {language === "pt" ? "Voltar" : "Back"}
            </Button>
          </Link>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => {
          const link = document.createElement('a');
          link.href = 'https://drive.google.com/uc?export=download&id=1DlC5dQW9jbqnZPxc3TKTmaXnU0sIsHHo';
          link.download = 'CV_Rafael_Bacellar.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }}>
            <Download className="w-4 h-4" />
            {t.downloadCV}
          </Button>
        </motion.div>

        {/* Profile Header */}
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <h1 className="font-display text-4xl font-bold mb-4">Rafael Bacellar Ramos Reis</h1>
          <p className="text-xl text-muted-foreground mb-6">End-to-End Product Designer</p>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              rfbcllr@gmail.com
            </div>
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              +55 71 991373998
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              Aracaju, SE, Brasil
            </div>
          </div>
          
          <div className="flex justify-center">
            <motion.div initial={{
            opacity: 0,
            scale: 0.9
          }} animate={{
            opacity: 1,
            scale: 1
          }} transition={{
            duration: 0.5,
            delay: 0.3
          }} className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm" style={{
            backgroundColor: '#10b981',
            color: 'white'
          }}>
              <motion.div className="w-2.5 h-2.5 bg-white rounded-full" animate={{
              scale: [1, 1.2, 1]
            }} transition={{
              duration: 2,
              repeat: Infinity
            }} />
              {language === "pt" ? "DISPONÍVEL PARA TRABALHO • INÍCIO IMEDIATO" : "OPEN TO WORK • IMMEDIATE JOINER"}
            </motion.div>
          </div>
        </motion.div>

        {/* Work Experience */}
        <motion.section className="mb-12" variants={itemVariants}>
          <h2 className="font-display text-2xl font-semibold mb-6">{t.workExperience}</h2>
          <div className="space-y-6">
            {experiences.map((exp, index) => <Card key={index} className="rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{exp.title}</h3>
                      <p style={{
                    color: '#25aef4'
                  }} className="font-medium text-indigo-400">{exp.company}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {exp.period}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {exp.current && <Badge variant="default" className="bg-primary">
                        {t.currentJob}
                      </Badge>}
                    {exp.secondaryChips?.map((chip, idx) => <Badge key={idx} variant="outline" className="text-xs">
                        {chip}
                      </Badge>)}
                  </div>
                  <p className="text-muted-foreground">{exp.description}</p>
                </CardContent>
              </Card>)}
          </div>
        </motion.section>

        {/* Education */}
        <motion.section className="mb-12" variants={itemVariants}>
          <h2 className="font-display text-2xl font-semibold mb-6">{t.education}</h2>
          <Card className="rounded-2xl">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">
                    {language === "pt" ? "Bacharelado em Design" : "Bachelor in Design"}
                  </h3>
                  <p className="font-medium" style={{
                  color: '#25aef4'
                }}>
                    {language === "pt" ? "Universidade do Estado da Bahia" : "Bahia State University"}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  2016 - 2021
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Capabilities Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Technical Skills */}
          <AnimatedSection>
            <Card className="rounded-2xl p-6 h-full">
              <h2 className="font-display text-xl font-semibold mb-4 text-primary">{t.competenciesTitle}</h2>
              <ul className="space-y-2">
                {skills.map((skill, index) => <motion.li key={skill} initial={{
                opacity: 0,
                x: -10
              }} whileInView={{
                opacity: 1,
                x: 0
              }} transition={{
                delay: index * 0.05
              }} viewport={{
                once: true
              }} className="text-muted-foreground flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    {skill}
                  </motion.li>)}
              </ul>
            </Card>
          </AnimatedSection>

          {/* Soft Skills */}
          <AnimatedSection delay={0.1}>
            <Card className="rounded-2xl p-6 h-full">
              <h2 className="font-display text-xl font-semibold mb-4 text-primary">{t.softSkills}</h2>
              <ul className="space-y-2">
                {softSkills.map((skill, index) => <motion.li key={skill} initial={{
                opacity: 0,
                x: -10
              }} whileInView={{
                opacity: 1,
                x: 0
              }} transition={{
                delay: index * 0.05
              }} viewport={{
                once: true
              }} className="text-muted-foreground flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    {skill}
                  </motion.li>)}
              </ul>
            </Card>
          </AnimatedSection>

          {/* Tools */}
          <AnimatedSection delay={0.2}>
            <Card className="rounded-2xl p-6 h-full">
              <h2 className="font-display text-xl font-semibold mb-4 text-primary">{t.tools}</h2>
              <ul className="space-y-2">
                {tools.map((tool, index) => <motion.li key={tool} initial={{
                opacity: 0,
                x: -10
              }} whileInView={{
                opacity: 1,
                x: 0
              }} transition={{
                delay: index * 0.05
              }} viewport={{
                once: true
              }} className="text-muted-foreground flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    {tool}
                  </motion.li>)}
              </ul>
            </Card>
          </AnimatedSection>

          {/* Languages */}
          <AnimatedSection delay={0.3}>
            <Card className="rounded-2xl p-6 h-full">
              <h2 className="font-display text-xl font-semibold mb-4 text-primary">{t.languages}</h2>
              <ul className="space-y-2">
                {languages.map((lang, index) => <motion.li key={lang.name} initial={{
                opacity: 0,
                x: -10
              }} whileInView={{
                opacity: 1,
                x: 0
              }} transition={{
                delay: index * 0.05
              }} viewport={{
                once: true
              }} className="text-muted-foreground flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    {lang.name} - {lang.level}
                  </motion.li>)}
              </ul>
            </Card>
          </AnimatedSection>
        </div>
      </motion.div>
    </div>;
};
export default Experience;