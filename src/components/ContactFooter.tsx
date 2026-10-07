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
        <div className="absolute bottom-[calc(100%-4px)] left-6 xl:left-[calc((100%_-_72rem)/2_+_1.5rem)]">
          {character}
        </div>
      )}
      <p>© {new Date().getFullYear()}&nbsp;Made with :coffee: by Rafael Bacellar · All rights reserved</p>
    </footer>
  );
};
