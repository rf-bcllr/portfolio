import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useTranslations } from "@/hooks/useTranslations";

import avatar from "@/assets/rafael-bacellar-avatar.jpg";
import p1 from "@/assets/proj-mural.png";
import p2 from "@/assets/proj-thumb-1.png";
import p3 from "@/assets/proj-thumb-2.png";
import p4 from "@/assets/proj-healthy.png";
import p5 from "@/assets/proj-thumb-3.png";
import p6 from "@/assets/proj-thumb-4.png";
import cert1 from "@/assets/cert-google.png";
import cert2 from "@/assets/cert-ai.jpg";
import cert3 from "@/assets/cert-leadership.jpg";

const Index = () => {
  const [spot, setSpot] = useState({ x: 0, y: 0 });
  const [language, setLanguage] = useState<"pt" | "en">("pt");
  const t = useTranslations(language);

  const onMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSpot({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const projects = [
    { src: p1, title: "Login, Onboarding and Home @Mural", href: "https://www.behance.net/rfbcllr" },
    { src: p4, title: "Healthy Food & Groceries App Prototype", href: "https://www.figma.com/proto/YpQOWHj5nJEZqHdi7hn3VR/Sa%C3%BAde-e-Ponto?kind=&node-id=978-7363&page-id=5%3A5&scaling=scale-down&show-proto-sidebar=1&starting-point-node-id=978%3A7363&mode=design&t=7depr6rbcfCS1Mkq-1" },
    { src: p2, title: "Behance Highlights 1", href: "https://www.behance.net/rfbcllr" },
    { src: p3, title: "Behance Highlights 2", href: "https://www.behance.net/rfbcllr" },
    { src: p5, title: "Behance Highlights 3", href: "https://www.behance.net/rfbcllr" },
    { src: p6, title: "Behance Highlights 4", href: "https://www.behance.net/rfbcllr" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="container mx-auto flex items-center justify-between py-4">
          <a href="#inicio" className="font-semibold text-lg">RB</a>
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
          className="relative overflow-hidden"
        >
          <div className="pointer-events-none absolute inset-0 -z-10 opacity-70" style={{
            background: "radial-gradient(600px at var(--x) var(--y), hsl(var(--primary)/0.25), transparent 60%)",
          }} />
          <div className="container mx-auto grid gap-10 px-6 py-20 md:grid-cols-[auto,1fr] md:items-center">
            <img
              src={avatar}
              alt="Retrato de Rafael Bacellar, Product Designer"
              loading="eager"
              width={184}
              height={184}
              className="mx-auto aspect-square size-40 rounded-full border-2 border-border object-cover shadow-lg md:mx-0 md:size-48 animate-enter"
            />
            <div>
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl animate-fade-in">{t.heroTitle}</h1>
              <p className="mt-4 max-w-xl text-lg text-muted-foreground animate-fade-in" style={{ animationDelay: "0.1s" }}>
                {t.heroDescription}
              </p>
              <div className="mt-8 flex flex-wrap gap-3 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <Button asChild variant="hero" size="lg">
                  <a href="https://linkedin.com/in/rfbcllr" target="_blank" rel="noreferrer" aria-label={t.talkOnLinkedIn}>
                    {t.talkOnLinkedIn}
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="#projetos">{t.viewProjects}</a>
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-2 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                {t.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Projetos */}
        <section id="projetos" className="container mx-auto px-6 py-24">
          <header className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">{t.realExperiences}</h2>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">{t.projectsSubtitle}</p>
          </header>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((proj, i) => (
              <a key={i} href={proj.href} target="_blank" rel="noreferrer" className="group">
                <Card className="overflow-hidden border-border/70 transition-all hover:shadow-xl">
                  <CardContent className="p-0">
                    <img
                      src={proj.src}
                      alt={`${proj.title} — case de produto por Rafael Bacellar`}
                      loading="lazy"
                      className="h-52 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </CardContent>
                  <div className="p-4">
                    <p className="font-medium">{proj.title}</p>
                    <p className="text-sm text-muted-foreground">UI/UX · Case study</p>
                  </div>
                </Card>
              </a>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Button asChild variant="soft">
              <a href="https://bento.me/rfbcllr" target="_blank" rel="noreferrer">Ver mais no Bento</a>
            </Button>
          </div>
        </section>

        {/* Sobre */}
        <section id="sobre" className="container mx-auto px-6 py-16">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Sobre mim</h2>
              <p className="mt-4 text-muted-foreground">
                Product Designer com experiência na criação de experiências digitais end‑to‑end: pesquisa, arquitetura de informação, fluxos, wireframes e interfaces de alta fidelidade. Trabalho próximo a times de produto e engenharia para entregar valor com qualidade.
              </p>
            </div>
            <div className="rounded-lg border p-6">
              <h3 className="font-semibold">Competências</h3>
              <ul className="mt-3 grid list-disc gap-2 pl-5 text-muted-foreground sm:grid-cols-2">
                <li>Design System</li>
                <li>Prototipagem</li>
                <li>Acessibilidade</li>
                <li>Design de Interação</li>
                <li>Pesquisa com usuários</li>
                <li>Colaboração com Dev</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Certificações */}
        <section id="certificacoes" className="container mx-auto px-6 py-16">
          <header className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight">Certificações</h2>
            <p className="text-muted-foreground">Conteúdo fiel ao Bento.</p>
          </header>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[{
              src: cert1,
              title: "Foundations of UX Design by Google",
              href: "https://www.coursera.org/account/accomplishments/certificate/AHMR4UGP2G98"
            },{
              src: cert2,
              title: "UX Design for AI Systems",
              href: "https://app.crowdclass.com/tokens/9153"
            },{
              src: cert3,
              title: "UX Design Leadership",
              href: "https://app.crowdclass.com/tokens/12141"
            }].map((c,i) => (
              <a key={i} href={c.href} target="_blank" rel="noreferrer" className="group">
                <Card className="overflow-hidden transition-all hover:shadow-xl">
                  <CardContent className="p-0">
                    <img src={c.src} alt={c.title} loading="lazy" className="h-48 w-full object-cover" />
                  </CardContent>
                  <div className="p-4">
                    <p className="font-medium">{c.title}</p>
                  </div>
                </Card>
              </a>
            ))}
          </div>
        </section>

        {/* Recomendações */}
        <section id="recomendacoes" className="container mx-auto px-6 py-16">
          <header className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight">Recomendações</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                "1 ano @isaac",
                "+3 anos @ClassApp",
                "+2 anos @Le biscuit",
                "+2 anos @Sebrae",
                "+2 anos @Sanar"
              ].map((t) => (
                <Badge key={t} variant="secondary">{t}</Badge>
              ))}
            </div>
          </header>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6">
              <p className="text-sm text-muted-foreground">“Rafael is by far the most creative designer I've ever worked with (…) he really has the eye for details and ends up spotting flaws no one else does. (…), he is patient with his colleagues and always willing to help others improve their own skills (…)”</p>
              <p className="mt-3 font-medium">Inis Leahy - Senior Product Designer @Udemy</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-muted-foreground">“Rafael is my reference of a dedicated and curious designer. Always bringing something new to the table and exploring his own abilities to the fullest, he is a professional you can count on to deliver the best solutions to your client’s needs.”</p>
              <p className="mt-3 font-medium">Esdras Lopes - Advertisement & Media Specialist</p>
            </Card>
          </div>
        </section>

        {/* Contato */}
        <section id="contato" className="relative isolate">
          <div className="absolute inset-0 -z-10 opacity-[0.12]" style={{ background: "var(--gradient-hero)" }} />
          <div className="container mx-auto px-6 py-16 text-center">
            <h2 className="text-2xl font-semibold tracking-tight">Vamos conversar?</h2>
            <p className="mt-2 text-muted-foreground">Aberto a novas conexões e oportunidades.</p>
            <div className="mt-6 flex justify-center gap-3">
              <Button asChild variant="hero">
                <a href="https://linkedin.com/in/rfbcllr" target="_blank" rel="noreferrer">Conectar no LinkedIn</a>
              </Button>
              <Button asChild variant="outline">
                <a href="#inicio">Voltar ao topo</a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Rafael Bacellar · Todos os direitos reservados
      </footer>
    </div>
  );
};

export default Index;
