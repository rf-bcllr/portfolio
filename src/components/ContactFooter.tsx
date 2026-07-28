import { DottedSurface } from "@/components/DottedSurface";

interface ContactFooterProps {
  contactTitle?: string;
  contactDescription?: string;
  backToTop?: string;
}

export const ContactFooter = ({}: ContactFooterProps) => {
  return (
    <footer
      // Opt out of the site-wide figjam dotted grid so the animated dots stand out,
      // giving the impression the rest of the site's grid started moving here.
      className="footer-no-grid relative isolate overflow-hidden border-t bg-background"
    >
      {/* Animated dotted surface — sized to the footer, not the viewport */}
      <DottedSurface className="-z-10 opacity-60 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]" />
      {/* Readability overlay so text stays legible over the moving dots */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background/60 via-background/30 to-background/60"
      />
      <div className="relative py-14 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Rafael Bacellar · All rights reserved</p>
      </div>
    </footer>
  );
};
