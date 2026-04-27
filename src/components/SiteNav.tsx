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
    <header className="sticky top-0 z-50 px-4 py-4">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full border border-border/80 bg-card/75 px-3 py-2 shadow-card backdrop-blur-xl md:px-4">
        <Link to="/" data-cursor-action="home" className="flex items-center gap-2 rounded-full pr-2 text-sm font-semibold tracking-[0.005em]">
          <img src={avatar} alt="Rafael Bacellar avatar" className="size-9 rounded-full border border-border object-cover" />
          <span className="hidden sm:inline">Rafael Bacellar</span>
        </Link>

        <div className="flex min-w-0 flex-1 items-center justify-center gap-1 overflow-x-auto px-1 md:gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              data-cursor-action="navigate-internal"
              className={({ isActive }) =>
                `rounded-full px-3 py-2 text-xs font-semibold transition-all sm:text-sm ${
                  isActive ? "bg-foreground text-background" : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <Button asChild variant="outline" size="sm" className="hidden border-border/80 bg-card/40 sm:inline-flex">
          <a href="https://linkedin.com/in/rfbcllr" target="_blank" rel="noreferrer" data-cursor-link>
            LinkedIn <ExternalLink className="size-3.5" />
          </a>
        </Button>
      </nav>
    </header>
  );
}
