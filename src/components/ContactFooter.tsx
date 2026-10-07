import type { ReactNode } from "react";

interface ContactFooterProps {
  contactTitle?: string;
  contactDescription?: string;
  backToTop?: string;
  character?: ReactNode;
}

export const ContactFooter = ({ character }: ContactFooterProps) => {
  return (
    <footer className={`relative border-t px-4 py-10 text-center text-sm max-[380px]:text-[10px] text-muted-foreground ${character ? "mt-28" : ""}`}>
      {character && (
        <div className="absolute bottom-[calc(100%-4px)] left-6 xl:left-[calc((100%_-_72rem)/2_+_1.5rem)]">
          {character}
        </div>
      )}
      <p><span className="max-[400px]:hidden">© {new Date().getFullYear()}&nbsp;Made with ☕ by Rafael Bacellar · All rights reserved</span><span className="hidden max-[400px]:inline">© {new Date().getFullYear()} · All rights reserved</span></p>
    </footer>
  );
};
