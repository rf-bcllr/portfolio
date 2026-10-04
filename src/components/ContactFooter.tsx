import type { ReactNode } from "react";

interface ContactFooterProps {
  contactTitle?: string;
  contactDescription?: string;
  backToTop?: string;
  character?: ReactNode;
}

export const ContactFooter = ({ character }: ContactFooterProps) => {
  return (
    <footer className={`relative border-t py-10 text-center text-sm text-muted-foreground ${character ? "mt-28" : ""}`}>
      {character && (
        <div className="absolute bottom-full left-6 md:left-[max(1.5rem,calc((100%-72rem)/2+1.5rem))]">
          {character}
        </div>
      )}
      <p>© {new Date().getFullYear()} Rafael Bacellar · All rights reserved</p>
    </footer>
  );
};
