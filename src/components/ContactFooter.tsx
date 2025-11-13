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
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {/* Let's Talk Section */}
      <section id="contato" className="relative isolate">
        <div 
          className="absolute inset-0 -z-10 opacity-[0.08]" 
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="container mx-auto px-6 py-24 md:py-32 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-normal-case mb-6 text-balance text-foreground">
            {contactTitle}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            {contactDescription}
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button 
              variant="outline" 
              size="lg" 
              className="text-base px-8"
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
      </section>

      {/* Footer */}
      <footer className="border-t py-10 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Rafael Bacellar · All rights reserved</p>
      </footer>
    </>
  );
};
