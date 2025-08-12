import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useTranslations } from "@/hooks/useTranslations";

import avatar from "@/assets/rafael-bacellar-avatar.jpg";

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
    { src: "https://creatorspace.imgix.net/users/clnkcjnw802u4ou01tta5rqcm/6d1gUMMWYdGdDNPe-26ddde76011107.Y3JvcCw4MDgsNjMyLDAsMA%2520(1).png?w=750&h=750", href: "https://bento.me/rfbcllr", title: "Login, Onboarding and Home @Mural" },
    { src: "https://creatorspace.imgix.net/users/clnkcjnw802u4ou01tta5rqcm/EC90UL0Vda7i4S30-Screenshot%25202023-10-10%2520at%252022.10.09.png?w=750&h=750", href: "https://www.figma.com/proto/YpQOWHj5nJEZqHdi7hn3VR/Sa%C3%BAde-e-Ponto?kind=&node-id=978-7363&page-id=5%3A5&scaling=scale-down&show-proto-sidebar=1&starting-point-node-id=978%3A7363&mode=design&t=7depr6rbcfCS1Mkq-1", title: "Healthy Food & Groceries App Prototype" },
    { src: "https://storage.googleapis.com/creatorspace-public/users%2Fclnkcjnw802u4ou01tta5rqcm%2FUKVcVl4DB6Bzva11-ScreenRecording2024-11-19at08.19.59-ezgif.com-crop.gif", href: "https://bento.me/rfbcllr", title: "New app @isaac (GIF)" },
    { src: "https://storage.googleapis.com/creatorspace-public/users%2Fclnkcjnw802u4ou01tta5rqcm%2F6fsoLs1a9Yicj3I3-IA.gif", href: "https://bento.me/rfbcllr", title: "AI interactions (GIF)" },
    { src: "https://creatorspace.imgix.net/users/clnkcjnw802u4ou01tta5rqcm/ASUGtTS5mLxevGHd-WhatsApp%2520Image%25202024-10-30%2520at%252012.20.36%2520PM.jpeg?w=750&h=750", href: "https://bento.me/rfbcllr", title: "Real experiences" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="container mx-auto flex items-center justify-between py-4">
          {!scrolled ? (
            <a href="#inicio" className="font-semibold text-lg transition-opacity duration-300">RB</a>
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
                <Button asChild variant="contrast" size="lg">
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

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
            {projectMedia.map((item, i) => (
              <a key={i} href={item.href} target="_blank" rel="noreferrer" className="mb-4 block break-inside-avoid">
                <img
                  src={item.src}
                  alt={`${item.title ?? `Project media ${i + 1}`} — portfolio de Rafael Bacellar`}
                  loading="lazy"
                  className="w-full h-auto rounded-md border border-border bg-muted/20"
                />
              </a>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Button asChild variant="soft">
              <a href="https://bento.me/rfbcllr" target="_blank" rel="noreferrer">{t.moreOnBento}</a>
            </Button>
          </div>
        </section>

        {/* Sobre */}
        <section id="sobre" className="container mx-auto px-6 py-16">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">{t.aboutTitle}</h2>
              <p className="mt-4 text-muted-foreground">
                {t.aboutDescription}
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
            <h2 className="text-2xl font-semibold tracking-tight">{t.certificationsTitle}</h2>
            <p className="text-muted-foreground">{t.certificationsSubtitle}</p>
          </header>
          <ul className="space-y-2">
            <li>
              <a href="https://www.coursera.org/account/accomplishments/certificate/AHMR4UGP2G98" target="_blank" rel="noreferrer" className="story-link">
                Foundations of UX Design by Google
              </a>
            </li>
            <li>
              <a href="https://app.crowdclass.com/tokens/8394" target="_blank" rel="noreferrer" className="story-link">
                Strategic Design by The Starter
              </a>
            </li>
            <li>
              <a href="https://app.crowdclass.com/tokens/9153" target="_blank" rel="noreferrer" className="story-link">
                UX Design for AI Systems
              </a>
            </li>
            <li>
              <a href="https://app.crowdclass.com/tokens/12141" target="_blank" rel="noreferrer" className="story-link">
                UX Design Leadership
              </a>
            </li>
          </ul>
        </section>

        {/* Recomendações */}
        <section id="recomendacoes" className="container mx-auto px-6 py-16">
          <header className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight">{t.recommendationsTitle}</h2>
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
            <h2 className="text-2xl font-semibold tracking-tight">{t.contactTitle}</h2>
            <p className="mt-2 text-muted-foreground">{t.contactDescription}</p>
            <div className="mt-6 flex justify-center gap-3">
              <Button asChild variant="outline">
                <a href="#inicio">{t.backToTop}</a>
              </Button>
              <Button asChild variant="contrast">
                <a href="https://linkedin.com/in/rfbcllr" target="_blank" rel="noreferrer">LinkedIn</a>
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
