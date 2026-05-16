import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ExternalLink, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import avatar from "@/assets/rafael-bacellar-avatar.jpg";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Work", to: "/work" },
  { label: "Resume", to: "/resume" },
  { label: "Certifications", to: "/certifications" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const activeItem = navItems.find((item) => item.to === location.pathname) ?? navItems[0];

  return (
    <header className="sticky top-4 z-50 px-4">
      <nav className="relative mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full border border-border bg-card/90 px-3 py-2 shadow-card backdrop-blur-xl">
        <Link to="/" data-cursor-action="home" className="flex items-center gap-2 rounded-full pr-2 text-sm font-semibold">
          <img src={avatar} alt="Rafael Bacellar avatar" className="size-9 rounded-full border border-border object-cover" />
          <span className="hidden sm:inline">rfbcllr.</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden min-w-0 flex-1 items-center justify-center gap-1 px-1 md:flex">
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

        <Button asChild variant="outline" size="sm" className="hidden md:inline-flex">
          <a href="https://linkedin.com/in/rfbcllr" target="_blank" rel="noreferrer" data-cursor-link>
            LinkedIn <ExternalLink className="size-3.5" />
          </a>
        </Button>

        {/* Mobile: active label + toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <span className="rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-background">
            {activeItem.label}
          </span>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
        {/* Mobile collapsible panel - floats over content */}
        {open && (
          <div className="absolute inset-x-0 top-full z-50 mt-2 rounded-[24px] border border-border bg-card/95 p-2 shadow-card backdrop-blur-xl md:hidden">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
                      isActive ? "bg-foreground text-background" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <a
                href="https://linkedin.com/in/rfbcllr"
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-flex items-center justify-center gap-1.5 rounded-full border border-border px-4 py-2.5 text-sm font-semibold text-foreground"
              >
                LinkedIn <ExternalLink className="size-3.5" />
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
