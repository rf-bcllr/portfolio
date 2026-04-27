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
    <header className="sticky top-0 z-50 border-b border-primary/10 bg-primary shadow-card">
      <nav className="mx-auto flex h-[60px] max-w-7xl items-center justify-between gap-3 px-6">
        <Link to="/" data-cursor-action="home" className="flex items-center gap-2 rounded-full pr-2 text-sm font-semibold">
          <img src={avatar} alt="Rafael Bacellar avatar" className="size-9 rounded-lg border border-primary-foreground/20 object-cover" />
          <span className="hidden text-primary-foreground sm:inline">rfbcllr.</span>
        </Link>

        <div className="flex min-w-0 flex-1 items-center justify-center gap-1 overflow-x-auto px-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              data-cursor-action="navigate-internal"
              className={({ isActive }) =>
                `rounded-full px-3 py-2 text-xs font-semibold transition-colors sm:text-sm ${
                  isActive ? "bg-primary-foreground text-primary" : "text-primary-foreground/75 hover:bg-primary-foreground/12 hover:text-primary-foreground"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <Button asChild variant="outline" size="sm" className="hidden border-primary-foreground/25 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground hover:text-primary sm:inline-flex">
          <a href="https://linkedin.com/in/rfbcllr" target="_blank" rel="noreferrer" data-cursor-link>
            LinkedIn <ExternalLink className="size-3.5" />
          </a>
        </Button>
      </nav>
    </header>
  );
}
