import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ContactFooterProps {
  contactTitle?: string;
  contactDescription?: string;
  backToTop?: string;
}

export const ContactFooter = ({ 
  contactTitle = "Let's talk?",
  contactDescription = "Available for freelance projects and job opportunities.",
}: ContactFooterProps) => {
  return (
    <>
      {/* Let's Talk Section - Massive Impact */}
      <section id="contato" className="relative isolate">
        <div 
          className="absolute inset-0 -z-10 opacity-[0.06]" 
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="container mx-auto px-6 py-32 md:py-40 lg:py-48 text-center">
          <motion.h2 
            className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight font-display mb-8 uppercase"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: true }}
          >
            {contactTitle?.replace("?", "") || "Let's talk"}
          </motion.h2>
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: true }}
          >
            {contactDescription}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: true }}
          >
            <Button 
              asChild 
              variant="contrast" 
              size="lg" 
              className="text-base md:text-lg px-10 md:px-14 py-6 md:py-7"
            >
              <a 
                href="https://linkedin.com/in/rfbcllr" 
                target="_blank" 
                rel="noreferrer"
              >
                Connect on LinkedIn
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Rafael Bacellar · All rights reserved</p>
      </footer>
    </>
  );
};
