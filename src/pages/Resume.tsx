import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Download, Globe, Lightbulb, Mail, MapPin, MessageCircle, Phone, Wrench } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { ContactFooter } from "@/components/ContactFooter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ToolsMarquee } from "@/components/ToolsMarquee";
import { useTranslations } from "@/hooks/useTranslations";
import { generateResumePDF } from "@/utils/generateResumePDF";
import figmaLogo from "@/assets/tools/figma.png";
import adobeCreativeCloudLogo from "@/assets/tools/adobe-creative-cloud.png";
import chatgptLogo from "@/assets/tools/chatgpt.png";
import claudeLogo from "@/assets/tools/claude.svg";
import claudeCodeLogo from "@/assets/tools/claude-code.png";
import githubLogo from "@/assets/tools/github.png";
import lovableLogo from "@/assets/tools/lovable.png";
import excalidrawLogo from "@/assets/tools/excalidraw.png";
import notionLogo from "@/assets/tools/notion.png";
import mazeLogo from "@/assets/tools/maze.png";
import mixpanelLogo from "@/assets/tools/mixpanel.png";

const experiences = [
  { title: "Senior Product Designer", company: "FTD Educação", period: "2026 - Present", description: "Senior Product Designer and Design representative at the AI Center of Excellence (COE) for Grupo Marista, leading GEN AI-powered product initiatives across edtech experiences.", chips: ["Edtech", "GEN AI", "B2B", "B2C"] },
  { title: "Product Designer", company: "isaac", period: "2024 - 2026", description: "End-to-end digital product design, design system and scalable interfaces.", chips: ["Fintech", "B2B", "B2C", "SaaS"] },
  { title: "Product Designer", company: "ClassApp", period: "2021 - 2024", description: "Product design leadership, user research and development collaboration.", chips: ["Edtech", "B2B", "B2C"] },
  { title: "Design Analyst", company: "Le biscuit", period: "2019 - 2021", description: "Digital interface analysis and design, user experience improvement.", chips: ["Retail", "E-commerce"] },
  { title: "Design & Marketing Analyst", company: "Sebrae Bahia", period: "2017 - 2019", description: "Graphic design, digital marketing and visual communication for entrepreneurs.", chips: ["Govt. Agency", "B2B"] },
  { title: "Brand Designer", company: "Sanar", period: "2015 - 2016", description: "Visual identity development and brand materials for medical education.", chips: ["Healthtech", "B2C"] },
];

const skills = ["User Research", "Visual Design", "Prototyping", "Design System", "Usability Testing", "Information Architecture", "Interaction Design", "Design Thinking", "Agile", "UX Writing", "Accessibility", "HTML/CSS"];
const softSkills = ["Leadership", "Communication", "Collaboration", "Critical Thinking", "Adaptability", "Creativity", "Fast Iterations"];
const tools = [
  { name: "Figma", logo: figmaLogo },
  { name: "Adobe Creative Tools", logo: adobeCreativeCloudLogo },
  { name: "ChatGPT", logo: chatgptLogo },
  { name: "Claude", logo: claudeLogo },
  { name: "Claude Code", logo: claudeCodeLogo },
  { name: "GitHub", logo: githubLogo },
  { name: "Lovable", logo: lovableLogo },
  { name: "Excalidraw", logo: excalidrawLogo },
  { name: "Notion", logo: notionLogo },
  { name: "Maze", logo: mazeLogo },
  { name: "Mixpanel", logo: mixpanelLogo },
];

export default function Resume() {
  const t = useTranslations();
  const languages = [
    { name: t.portuguese, level: t.native },
    { name: t.english, level: t.advanced },
    { name: t.german, level: t.basic },
    { name: t.spanish, level: t.basic },
  ];

  return (
    <div className="min-h-dvh text-foreground">
      <SiteNav />
      <main id="main-content" className="mx-auto max-w-6xl px-6 pb-20 pt-16 md:pt-24">
        <section className="mb-16 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p
              className="animate-text-reveal stagger-1 mb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground opacity-0"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Resume
            </p>
            <h1 className="animate-section-reveal font-display text-6xl font-bold leading-[0.82] tracking-[-0.05em] opacity-0 md:text-[112px]">
              Rafael<br />Bacellar<span className="text-primary">.</span>
            </h1>
            <p className="animate-text-reveal stagger-3 mt-6 hidden text-xl font-medium text-foreground opacity-0 sm:block">End-to-End Product Designer</p>
          </div>
          <Card className="p-6">
            <div className="mb-5 grid gap-3 text-sm text-foreground">
              <span className="flex items-center gap-2"><Mail className="size-4" /> rfbcllr@gmail.com</span>
              <span className="flex items-center gap-2"><Phone className="size-4" /> +55 71 991373998</span>
              <span className="flex items-center gap-2"><MapPin className="size-4" /> Aracaju, SE, Brasil</span>
            </div>
            <Button variant="contrast" onClick={() => generateResumePDF("en")} data-cursor-action="download">
              <Download className="size-4" /> Download Resume
            </Button>
          </Card>
        </section>

        <section className="mb-16">
          <div className="mb-8 flex items-end justify-between gap-6 border-b-2 border-foreground pb-4">
            <h2 className="animate-section-reveal font-display text-4xl font-bold leading-[0.9] tracking-[-0.035em] opacity-0 md:text-5xl">{t.workExperience}</h2>
            <span
              className="animate-text-reveal stagger-2 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground opacity-0"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Trajectory
            </span>
          </div>
          <div className="space-y-6">
            {experiences.map((exp, idx) => (
              <motion.div
                key={exp.company}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <Card className="p-0">
                  <CardContent className="p-6">
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                      <div>
                        <h3 className="font-display text-xl font-bold tracking-[-0.02em]">{exp.title}</h3>
                        <p className="font-medium text-foreground">{exp.company}</p>
                      </div>
                      <span className="flex items-center gap-2 text-sm text-muted-foreground"><Calendar className="size-4" /> {exp.period}</span>
                    </div>
                    <div className="my-4 flex flex-wrap gap-1.5">
                      {exp.chips.map((chip) => <Badge key={chip} variant="outline">{chip}</Badge>)}
                    </div>
                    <p className="text-muted-foreground">{exp.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <div className="mb-8 flex items-end justify-between gap-6 border-b-2 border-foreground pb-4">
            <h2 className="animate-section-reveal font-display text-4xl font-bold leading-[0.9] tracking-[-0.035em] opacity-0 md:text-5xl">Skills &amp; Languages</h2>
            <span
              className="animate-text-reveal stagger-2 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground opacity-0"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Craft
            </span>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: MessageCircle, title: t.softSkills, content: <div className="flex flex-wrap gap-1.5">{softSkills.map((skill) => <Badge key={skill} variant="secondary">{skill}</Badge>)}</div>, delay: 0 },
              { icon: Lightbulb, title: "Hard Skills", content: <div className="flex flex-wrap gap-1.5">{skills.map((skill) => <Badge key={skill} variant="secondary">{skill}</Badge>)}</div>, delay: 0.1 },
              { icon: Globe, title: t.languages, content: <div className="space-y-3">{languages.map((lang) => <div key={lang.name}><p className="font-semibold">{lang.name}</p><p className="text-sm text-muted-foreground">{lang.level}</p></div>)}</div>, delay: 0.2 },
            ].map(({ icon: Icon, title, content, delay }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <Card className="p-6">
                  <h3 className="mb-4 flex items-center gap-2 font-display text-xl font-bold tracking-[-0.02em]"><Icon className="size-5" /> {title}</h3>
                  {content}
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <div className="mb-8 flex items-end justify-between gap-6 border-b-2 border-foreground pb-4">
            <h2 className="animate-section-reveal flex items-center gap-3 font-display text-4xl font-bold leading-[0.9] tracking-[-0.035em] opacity-0 md:text-5xl"><Wrench className="size-7" /> My Tools</h2>
            <span
              className="animate-text-reveal stagger-2 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground opacity-0"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Stack
            </span>
          </div>
          <ToolsMarquee tools={tools} speed="slow" />
        </section>



      </main>
      <ContactFooter />
    </div>
  );
}
