import { Button } from "@/components/ui/button";
import { Linkedin } from "lucide-react";

export function BehanceIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 512 512" aria-hidden="true" {...props}>
      <path fill="currentColor" d="M285.6 183.1h83.2v21.8h-83.2v-21.8zM219.9 260.9c15.3-6.9 24.6-20.9 24.6-38.4 0-33.5-23.8-48.9-58.6-48.9H96v162.8h92.7c37.9 0 62.7-18.6 62.7-52.4 0-22.9-10.7-38-31.5-43.1zM136.3 199.1h44.8c15.8 0 26.4 7.1 26.4 22.3 0 16.3-12.1 23.5-28.1 23.5h-43.1v-45.8zm49.5 108.1h-49.5v-50.8h49.5c19.7 0 31.7 8.7 31.7 25.5 0 16.6-12 25.3-31.7 25.3zM428.7 252.7c-9.4-12-24.3-19.2-44.3-19.2-40.3 0-67.8 28.5-67.8 69.3 0 41.6 27.6 69.2 67.8 69.2 23.2 0 40.3-7.7 53.2-24.2l-22.7-14.9c-6.4 8.2-17.4 13.6-30.5 13.6-18.5 0-32.1-9.9-35.9-28.6h93.2c.6-3.8.9-7.9.9-12.2 0-17.3-4.5-33.6-14.1-43zm-80.4 31.3c2.9-17.9 16.4-28.2 35.1-28.2 19.9 0 32.6 10.8 34.7 28.2h-69.8z"/>
    </svg>
  );
}

export function SocialCard() {
  return (
    <div className="flex h-full items-center justify-center gap-3 p-4">
      <Button asChild variant="secondary">
        <a href="https://linkedin.com/in/rfbcllr" target="_blank" rel="noreferrer" aria-label="LinkedIn">
          <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
        </a>
      </Button>
      <Button asChild variant="secondary">
        <a href="https://www.behance.net/rfbcllr" target="_blank" rel="noreferrer" aria-label="Behance">
          <BehanceIcon className="mr-2 h-4 w-4" /> Behance
        </a>
      </Button>
    </div>
  );
}
