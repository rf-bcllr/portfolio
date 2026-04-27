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
    <header className="sticky top-4 z-50 px-4">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full border border-border bg-card/90 px-3 py-2 shadow-card backdrop-blur-xl">
        <Link to="/" data-cursor-action="home" className="flex items-center gap-2 rounded-full pr-2 text-sm font-semibold">
          <img src={avatar} alt="Rafael Bacellar avatar" className="size-9 rounded-full border border-border object-cover" />
          <span className="hidden sm:inline">rfbcllr.</span>
        </Link>

        <div className="flex min-w-0 flex-1 items-center justify-center gap-1 overflow-x-auto px-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              data-cursor-action="navigate-internal"
              className={({ isActive }) =>
                `rounded-full px-3 py-2 text-xs font-semibold transition-colors sm:text-sm ${
                  isActive ? "bg-foreground text-background" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
          <a href="https://linkedin.com/in/rfbcllr" target="_blank" rel="noreferrer" data-cursor-link>
            LinkedIn <ExternalLink className="size-3.5" />
          </a>
        </Button>
      </nav>
    </header>
  );
}
