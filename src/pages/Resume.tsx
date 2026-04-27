import { Link } from "react-router-dom";
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
import figjamLogo from "@/assets/tools/figjam.png";
import adobeCreativeCloudLogo from "@/assets/tools/adobe-creative-cloud.png";
import chatgptLogo from "@/assets/tools/chatgpt.png";
import lovableLogo from "@/assets/tools/lovable.png";
import excalidrawLogo from "@/assets/tools/excalidraw.png";
import notionLogo from "@/assets/tools/notion.png";
import mazeLogo from "@/assets/tools/maze.png";
import mixpanelLogo from "@/assets/tools/mixpanel.png";

const experiences = [
  { title: "Product Designer", company: "isaac", period: "2024 - Present", description: "End-to-end digital product design, design system and scalable interfaces.", chips: ["Fintech", "B2B", "B2C", "SaaS"] },
  { title: "Product Designer", company: "ClassApp", period: "2021 - 2024", description: "Product design leadership, user research and development collaboration.", chips: ["Edtech", "B2B", "B2C"] },
  { title: "Design Analyst", company: "Le biscuit", period: "2019 - 2021", description: "Digital interface analysis and design, user experience improvement.", chips: ["Retail", "E-commerce"] },
  { title: "Design & Marketing Analyst", company: "Sebrae Bahia", period: "2017 - 2019", description: "Graphic design, digital marketing and visual communication for entrepreneurs.", chips: ["Govt. Agency", "B2B"] },
  { title: "Brand Designer", company: "Sanar", period: "2015 - 2016", description: "Visual identity development and brand materials for medical education.", chips: ["Healthtech", "B2C"] },
];

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
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main className="mx-auto max-w-6xl px-6 pb-20 pt-16 md:pt-24">
        <section className="mb-14 grid gap-8 lg:grid-cols-[1fr_0.85fr] lg:items-end">
          <div>
            <Badge variant="outline" className="mb-5 bg-card px-4 py-2 text-sm shadow-card">Resume</Badge>
            <h1 className="font-display text-5xl font-semibold leading-[0.95] md:text-7xl">Rafael Bacellar Ramos Reis</h1>
            <p className="mt-5 text-xl text-muted-foreground">End-to-End Product Designer</p>
          </div>
          <Card className="p-6 lg:rotate-1">
            <div className="mb-5 grid gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><Mail className="size-4" /> rfbcllr@gmail.com</span>
              <span className="flex items-center gap-2"><Phone className="size-4" /> +55 71 991373998</span>
              <span className="flex items-center gap-2"><MapPin className="size-4" /> Aracaju, SE, Brasil</span>
            </div>
            <Button variant="contrast" onClick={() => generateResumePDF("en")} data-cursor-action="download">
              <Download className="size-4" /> Download Resume
            </Button>
          </Card>
        </section>

        <section className="mb-14">
          <h2 className="mb-6 font-display text-3xl font-semibold">{t.workExperience}</h2>
          <div className="space-y-5">
            {experiences.map((exp, index) => (
              <Card key={exp.company} className="p-0" style={{ transform: `rotate(${index % 2 === 0 ? "-0.2deg" : "0.2deg"})` }}>
                <CardContent className="p-6">
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                    <div>
                      <h3 className="text-xl font-semibold">{exp.title}</h3>
                      <p className="font-medium text-foreground">{exp.company}</p>
                    </div>
                    <span className="flex items-center gap-2 text-sm text-muted-foreground"><Calendar className="size-4" /> {exp.period}</span>
                  </div>
                  <div className="my-4 flex flex-wrap gap-2">
                    {exp.chips.map((chip) => <Badge key={chip} variant="outline">{chip}</Badge>)}
                  </div>
                  <p className="text-muted-foreground">{exp.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-14 grid gap-5 md:grid-cols-3">
          <Card className="p-6"><h2 className="mb-4 flex items-center gap-2 font-display text-xl font-semibold"><MessageCircle className="size-5" /> {t.softSkills}</h2><div className="flex flex-wrap gap-2">{softSkills.map((skill) => <Badge key={skill} variant="secondary">{skill}</Badge>)}</div></Card>
          <Card className="p-6"><h2 className="mb-4 flex items-center gap-2 font-display text-xl font-semibold"><Lightbulb className="size-5" /> Hard Skills</h2><div className="flex flex-wrap gap-2">{skills.map((skill) => <Badge key={skill} variant="secondary">{skill}</Badge>)}</div></Card>
          <Card className="p-6"><h2 className="mb-4 flex items-center gap-2 font-display text-xl font-semibold"><Globe className="size-5" /> {t.languages}</h2><div className="space-y-3">{languages.map((lang) => <div key={lang.name}><p className="font-semibold">{lang.name}</p><p className="text-sm text-muted-foreground">{lang.level}</p></div>)}</div></Card>
        </section>

        <section className="mb-14">
          <Card className="p-6">
            <h2 className="mb-8 flex items-center justify-center gap-2 font-display text-2xl font-semibold"><Wrench className="size-5" /> My Tools</h2>
            <ToolsMarquee tools={tools} speed="slow" />
          </Card>
        </section>

        <div className="text-center">
          <Button asChild variant="outline"><Link to="/certifications">Certifications & recommendations</Link></Button>
        </div>
      </main>
      <ContactFooter />
    </div>
  );
}
