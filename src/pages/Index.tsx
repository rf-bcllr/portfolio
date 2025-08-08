import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import avatar from "@/assets/rafael-bacellar-avatar.jpg";
import p1 from "@/assets/project-1.jpg";
import p2 from "@/assets/project-2.jpg";
import p3 from "@/assets/project-3.jpg";
import p4 from "@/assets/project-4.jpg";

const Index = () => {
  const [spot, setSpot] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSpot({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="container mx-auto flex items-center justify-between py-4">
          <a href="#inicio" className="font-semibold">RB</a>
          <div className="flex items-center gap-2">
            <a href="#projetos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Projetos</a>
            <a href="#sobre" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sobre</a>
            <a href="#contato" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contato</a>
            <Button asChild variant="soft" className="ml-2">
              <a href="https://linkedin.com/in/rfbcllr" target="_blank" rel="noreferrer">LinkedIn</a>
            </Button>
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
              className="mx-auto aspect-square size-40 rounded-full border-2 border-border object-cover shadow-lg md:mx-0 md:size-48"
            />
            <div>
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Rafael Bacellar — Product Designer</h1>
              <p className="mt-4 max-w-xl text-muted-foreground">
                Portfólio com experiências reais em produtos digitais. Foco em UX/UI, design system e interfaces escaláveis.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild variant="hero">
                  <a href="https://linkedin.com/in/rfbcllr" target="_blank" rel="noreferrer" aria-label="Falar com Rafael no LinkedIn">
                    Falar no LinkedIn
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a href="#projetos">Ver projetos</a>
                </Button>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <Badge variant="secondary">UX</Badge>
                <Badge variant="secondary">UI</Badge>
                <Badge variant="secondary">Design System</Badge>
                <Badge variant="secondary">Prototipagem</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Projetos */}
        <section id="projetos" className="container mx-auto px-6 py-16">
          <header className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight">Experiências reais</h2>
            <p className="text-muted-foreground">Alguns destaques visuais dos meus estudos de caso.</p>
          </header>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[{src: p1, title: "Mobile app — onboarding e UI"}, {src: p2, title: "Fintech dashboard — dados e gráficos"}, {src: p3, title: "Educação — fluxo e progresso"}, {src: p4, title: "E-commerce — checkout e catálogo"}].map((proj, i) => (
              <Card key={i} className="group overflow-hidden border-border/70 transition-all hover:shadow-xl">
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
