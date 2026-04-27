import { Link, NavLink } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import avatar from "@/assets/rafael-bacellar-avatar.jpg";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Work", to: "/work" },
  { label: "Resume", to: "/resume" },
  { label: "Certifications", to: "/certifications" },
];

export function SiteNav() {
  return (
    <header className="sticky top-5 z-50 px-4">
      <nav className="mx-auto flex max-w-3xl items-center justify-between gap-1 rounded-full border-[1.5px] border-border bg-card px-1.5 py-1.5 shadow-card backdrop-blur-xl">
        <Link to="/" data-cursor-action="home" className="flex items-center gap-2 rounded-full pr-2 text-sm font-semibold">
          <img src={avatar} alt="Rafael Bacellar avatar" className="size-8 rounded-full border border-border object-cover" />
          <span className="hidden text-foreground sm:inline">rfbcllr.</span>
        </Link>

        <div className="h-5 w-px bg-border" aria-hidden />

        <div className="flex min-w-0 flex-1 items-center justify-center gap-0.5 overflow-x-auto px-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              data-cursor-action="navigate-internal"
              className={({ isActive }) =>
                `rounded-full px-3.5 py-2 text-xs font-semibold transition-colors sm:text-[13px] ${
                  isActive ? "bg-foreground text-background" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden h-5 w-px bg-border sm:block" aria-hidden />

        <Button asChild variant="default" size="sm" className="hidden bg-primary text-primary-foreground hover:bg-primary/90 sm:inline-flex">
          <a href="https://linkedin.com/in/rfbcllr" target="_blank" rel="noreferrer" data-cursor-link>
            LinkedIn <ExternalLink className="size-3.5" />
          </a>
        </Button>
      </nav>
    </header>
  );
}
