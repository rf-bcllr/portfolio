import { Button } from "@/components/ui/button";

interface ContactFooterProps {
  contactTitle?: string;
  contactDescription?: string;
  backToTop?: string;
}

export const ContactFooter = ({ 
  contactTitle = "Let's talk?",
  contactDescription = "Available for freelance projects and job opportunities.",
  backToTop = "Back to top"
}: ContactFooterProps) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <section id="contato" className="relative isolate">
        <div 
          className="absolute inset-0 -z-10 opacity-[0.04]" 
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="grid gap-8 border-t border-border pt-12 md:grid-cols-[0.95fr_1.05fr] md:items-end">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-muted-foreground">Contact</p>
            <div>
          <h2 className="mb-5 max-w-3xl font-display text-5xl font-semibold leading-[0.92] md:text-7xl text-balance">
            {contactTitle}
          </h2>
          <p className="mb-8 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            {contactDescription}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 text-base"
              onClick={scrollToTop}
              data-cursor-action="scroll-up"
            >
              {backToTop}
            </Button>
            <Button asChild variant="contrast" size="lg" className="text-base px-8">
              <a 
                href="https://linkedin.com/in/rfbcllr" 
                target="_blank" 
                rel="noreferrer"
              >
                LinkedIn
              </a>
            </Button>
          </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/80 py-8 text-sm text-muted-foreground">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Rafael Bacellar</p>
          <p>Product Design · Research · Systems</p>
        </div>
      </footer>
    </>
  );
};
