import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import avatar from "@/assets/rafael-bacellar-avatar.jpg";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DJWidget } from "@/components/DJWidget";


const navItems = [
  { label: "Home", to: "/" },
  { label: "Work", to: "/work" },
  { label: "Resume", to: "/resume" },
  { label: "Certifications", to: "/certifications" },
];

const CONNECT_URL = "https://linkedin.com/in/rfbcllr";

function ConnectButton({
  className = "",
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  return (
    <a
      href={CONNECT_URL}
      target="_blank"
      rel="noreferrer noopener"
      onClick={onClick}
      data-cursor-link
      aria-label="Let's connect on LinkedIn (opens in a new tab)"
      className={`inline-flex h-9 items-center justify-center whitespace-nowrap rounded-full border border-border bg-transparent px-4 text-sm font-semibold leading-none text-foreground transition-colors duration-150 hover:border-primary hover:bg-primary hover:text-primary-foreground ${className}`}
    >
      Let&apos;s connect
    </a>
  );
}

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const activeItem = navItems.find((item) => item.to === location.pathname) ?? navItems[0];

  return (
    <header className="sticky top-4 z-50 px-4">
      <nav
        className="relative mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 rounded-full border-2 border-foreground px-3 shadow-[4px_4px_0_0_hsl(var(--foreground))] backdrop-blur-2xl backdrop-saturate-150"
        style={{
          background:
            "linear-gradient(135deg, hsl(var(--card) / 0.55), hsl(var(--card) / 0.25))",
        }}
      >
        <Link
          to="/"
          data-cursor-action="home"
          className="flex shrink-0 items-center gap-2.5 rounded-full pr-2 text-lg font-semibold leading-none"
        >
          <img
            src={avatar}
            alt="Rafael Bacellar avatar"
            className="size-9 rounded-full border border-border object-cover"
          />
          <span className="hidden sm:inline">rfbcllr.</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden min-w-0 flex-1 items-center justify-center gap-2 px-2 md:flex" role="navigation" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              data-cursor-action="navigate-internal"
              className={({ isActive }) =>
                `inline-flex h-9 items-center justify-center rounded-full px-4 text-sm font-semibold leading-none transition-colors ${
                  isActive
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`
              }
              aria-current={location.pathname === item.to ? "page" : undefined}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Desktop CTA cluster */}
        <div className="hidden shrink-0 items-center gap-2 md:flex">
          <ThemeToggle />
          <ConnectButton />
        </div>

        {/* DJ widget — single instance shared across breakpoints so Spotify only mounts once */}
        <div className="shrink-0">
          <DJWidget />
        </div>

        {/* Mobile: CTA + toggle */}
        <div className="flex shrink-0 items-center gap-2 md:hidden">
          <ThemeToggle />
          <ConnectButton className="h-11 px-3 text-xs" />

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav-panel"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border bg-card text-foreground"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>


        {/* Mobile collapsible panel */}
        {open && (
          <div
            id="mobile-nav-panel"
            role="navigation"
            aria-label="Mobile"
            className="absolute inset-x-0 top-full z-50 mt-2 rounded-[24px] border border-border bg-card/95 p-2 shadow-card backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  aria-current={location.pathname === item.to ? "page" : undefined}
                  className={({ isActive }) =>
                    `inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold leading-none transition-colors ${
                      isActive
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </nav>
      {/* Hide unused active label reference to satisfy linters if any */}
      <span className="sr-only">{activeItem.label}</span>
    </header>
  );
}
