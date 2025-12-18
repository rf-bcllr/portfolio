import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from '@/hooks/useTranslations';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Mail, Phone, MapPin, Calendar, Lightbulb, MessageCircle, Wrench, Globe } from 'lucide-react';
import { generateResumePDF } from '@/utils/generateResumePDF';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AnimatedSection } from '@/components/AnimatedSection';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import avatar from "@/assets/rafael-bacellar-avatar.jpg";
import { ContactFooter } from '@/components/ContactFooter';

// Tool logo imports
import figmaLogo from "@/assets/tools/figma.png";
import figjamLogo from "@/assets/tools/figjam.png";
import adobeCreativeCloudLogo from "@/assets/tools/adobe-creative-cloud.png";
import chatgptLogo from "@/assets/tools/chatgpt.png";
import lovableLogo from "@/assets/tools/lovable.png";
import excalidrawLogo from "@/assets/tools/excalidraw.png";
import notionLogo from "@/assets/tools/notion.png";
import mazeLogo from "@/assets/tools/maze.png";
import mixpanelLogo from "@/assets/tools/mixpanel.png";

const Experience = () => {
  const t = useTranslations();
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
    period: "2024 - Present",
    description: "End-to-end digital product design, design system and scalable interfaces.",
    current: false,
    secondaryChips: ["Fintech", "B2B", "B2C", "SaaS"]
  }, {
    title: "Product Designer",
    company: "ClassApp",
    period: "2021 - 2024",
    description: "Product design leadership, user research and development collaboration.",
    current: false,
    secondaryChips: ["Edtech", "B2B", "B2C"]
  }, {
    title: "Design Analyst",
    company: "Le biscuit",
    period: "2019 - 2021",
    description: "Digital interface analysis and design, user experience improvement.",
    current: false,
    secondaryChips: ["Retail", "B2B", "B2C", "E-commerce"]
  }, {
    title: "Design & Marketing Analyst",
    company: "Sebrae Bahia",
    period: "2017 - 2019",
    description: "Graphic design, digital marketing and visual communication for entrepreneurs.",
    current: false,
    secondaryChips: ["Govt. Agency", "B2B"]
  }, {
    title: "Brand Designer",
    company: "Sanar",
    period: "2015 - 2016",
    description: "Visual identity development and brand materials for medical education.",
    current: false,
    secondaryChips: ["Healthtech", "B2C", "SaaS", "E-commerce"]
  }];
  const skills = ["User Research", "Visual Design", "Prototyping", "Design System", "Usability Testing", "Information Architecture", "Interaction Design", "Design Thinking", "Agile", "UX Writing", "Accessibility", "HTML/CSS"];
  const softSkills = ["Leadership", "Communication", "Collaboration", "Critical Thinking", "Adaptability", "Creativity", "Fast Iterations"];
  const tools = [
    { name: "Figma", logo: figmaLogo },
    { name: "FigJam", logo: figjamLogo },
    { name: "Adobe Creative Tools", logo: adobeCreativeCloudLogo },
    { name: "ChatGPT", logo: chatgptLogo },
    { name: "Lovable", logo: lovableLogo },
    { name: "Excalidraw", logo: excalidrawLogo },
  { name: "Notion", logo: notionLogo },
  { name: "Maze", logo: mazeLogo },
  { name: "Mixpanel", logo: mixpanelLogo }
  ];
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
          {!scrolled ? <Link to="/" data-cursor-action="home" className="font-semibold text-lg transition-opacity duration-300">rfbcllr.</Link> : <Link to="/" data-cursor-action="home" className="flex items-center">
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
            <Button variant="ghost" size="sm" className="gap-2" data-cursor-action="back">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2" 
            onClick={() => generateResumePDF("en")}
            data-cursor-action="download"
          >
            <Download className="w-4 h-4" />
            Download Resume
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
              <motion.div animate={{
              scale: [1, 1.2, 1]
            }} transition={{
              duration: 2,
              repeat: Infinity
            }} className="w-3 h-3 bg-white rounded-full" />
              <span className="hidden md:inline">OPEN FOR REMOTE AND ON-SITE OPPORTUNITIES</span>
              <span className="md:hidden">OPEN FOR NEW OPPORTUNITIES</span>
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
                      <p className="font-medium text-foreground">{exp.company}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {exp.period}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
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
                    Bachelor in Design
                  </h3>
                  <p className="font-medium text-foreground">
                    Bahia State University
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
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Soft Skills */}
          <AnimatedSection>
            <Card className="rounded-2xl p-6 h-full">
              <h2 className="font-display text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
                <MessageCircle className="w-5 h-5" aria-hidden="true" />
                {t.softSkills}
              </h2>
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

          {/* Hard Skills */}
          <AnimatedSection delay={0.1}>
            <Card className="rounded-2xl p-6 h-full">
              <h2 className="font-display text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
                <Lightbulb className="w-5 h-5" aria-hidden="true" />
                Hard Skills
              </h2>
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

          {/* Languages */}
          <AnimatedSection delay={0.2}>
            <Card className="rounded-2xl p-6 h-full">
              <h2 className="font-display text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
                <Globe className="w-5 h-5" aria-hidden="true" />
                {t.languages}
              </h2>
              <ul className="space-y-3">
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
              }} className="flex items-center gap-2">
                    <div className="flex flex-col">
                      <span className="text-base font-semibold text-foreground">{lang.name}</span>
                      <span className="text-sm text-muted-foreground">{lang.level}</span>
                    </div>
                  </motion.li>)}
              </ul>
            </Card>
          </AnimatedSection>
        </div>

        {/* Tools Section - Logo Display with Tooltips */}
        <AnimatedSection delay={0.3}>
          <div className="py-8">
            <h2 className="font-display text-xl font-semibold mb-8 text-foreground flex items-center gap-2 justify-center">
              <Wrench className="w-5 h-5" aria-hidden="true" />
              My Tools
            </h2>
            <TooltipProvider delayDuration={200}>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                {tools.map((tool, index) => (
                  <Tooltip key={tool.name}>
                    <TooltipTrigger asChild>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        viewport={{ once: true }}
                        className="cursor-pointer"
                      >
                        <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-xl bg-background hover:bg-muted transition-all duration-300 hover:scale-110 p-3">
                          <img 
                            src={tool.logo} 
                            alt={`${tool.name} logo`}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{tool.name}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </TooltipProvider>
          </div>
        </AnimatedSection>
      </motion.div>

      <ContactFooter />
    </div>;
};
export default Experience;