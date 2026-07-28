import { DottedSurface } from "@/components/DottedSurface";

interface ContactFooterProps {
  contactTitle?: string;
  contactDescription?: string;
  backToTop?: string;
}

export const ContactFooter = ({}: ContactFooterProps) => {
  return (
    <footer className="relative isolate overflow-hidden border-t">
      <DottedSurface className="-z-10 opacity-70" />
      <div className="relative py-14 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Rafael Bacellar · All rights reserved</p>
      </div>
    </footer>
  );
};
