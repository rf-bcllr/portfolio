import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, Play, X } from "lucide-react";
import avatar from "@/assets/rafael-bacellar-avatar.jpg";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";



const navItems = [
  { label: "Home", to: "/" },
  { label: "Work", to: "/work" },
  { label: "Resume", to: "/resume" },
  { label: "Certifications", to: "/certifications" },
];

export function PlayLink({
  className = "",
  onClick,
  label = "Play",
  variant = "cursor",
}: {
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  label?: string;
  variant?: "cursor" | "blue";
}) {
  const Icon = Play;
  return (
    <Link
      to="/play"
      onClick={onClick}
      data-cursor-action="navigate-internal"
      aria-label="Play my portfolio"
      className={`${variant === "blue" ? "nav-play-blue" : "nav-play-pulse"} inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-4 text-sm font-semibold leading-none transition-opacity duration-150 hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}
    >
      <Icon aria-hidden="true" className="size-3.5 shrink-0" strokeWidth={2} /> {label}
    </Link>
  );
}

const CONNECT_URL = "https://www.linkedin.com/in/rfbcllr/";

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
      className={cn("inline-flex h-9 items-center justify-center whitespace-nowrap rounded-full border border-border bg-transparent px-4 text-sm font-semibold leading-none text-foreground transition-colors duration-150 hover:border-primary hover:bg-primary hover:text-primary-foreground", className)}
    >
      Let&apos;s connect
    </a>
  );
}

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();


  const navTransition = (_to: string, after?: () => void) => () => after?.();

  return (
    <header className="sticky top-4 z-50 px-4">
      <nav
        aria-label="Primary"
        className="relative mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 rounded-full border-2 border-foreground px-2 shadow-[4px_4px_0_0_hsl(var(--foreground))] backdrop-blur-2xl backdrop-saturate-150 sm:gap-4 sm:px-3 lg:gap-6"

        style={{
          background:
            "linear-gradient(135deg, hsl(var(--card) / 0.55), hsl(var(--card) / 0.25))",
        }}
      >
        <Link
          to="/"
          onClick={navTransition("/")}
          data-cursor-action="home"
          className="flex shrink-0 items-center gap-2.5 rounded-full pr-2 text-lg font-semibold leading-none"
        >
          <img
            src={avatar}
            alt="Rafael Bacellar avatar"
            className="size-9 rounded-full border border-border object-cover"
          />
          <span className="hidden sm:inline font-sans font-bold tracking-tight">rfbcllr.</span>
        </Link>

        {/* Desktop nav */}
        <div className="relative hidden min-w-0 flex-1 items-center justify-center gap-2 px-2 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={navTransition(item.to)}
              data-cursor-action="navigate-internal"
              className={({ isActive }) =>
                `relative inline-flex h-9 items-center justify-center rounded-full px-4 text-sm font-semibold leading-none transition-colors ${
                  isActive
                    ? "text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`
              }
              aria-current={location.pathname === item.to ? "page" : undefined}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full bg-foreground"
                      transition={{ type: "spring", stiffness: 260, damping: 28 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
          <PlayLink className="h-9" onClick={navTransition("/play")} />
        </div>

        {/* Desktop CTA cluster */}
        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <ThemeToggle />
          <ConnectButton />
        </div>

        {/* Mobile: CTA + toggle */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-1.5 lg:hidden">
          <ThemeToggle />
          <ConnectButton className="h-11 px-2 text-[10px] sm:px-2.5 sm:text-[11px]" />


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
            className="absolute inset-x-0 top-full z-50 mt-2 rounded-[24px] border border-border bg-card/95 p-2 shadow-card backdrop-blur-xl lg:hidden"
          >

            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={navTransition(item.to, () => setOpen(false))}
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
              <PlayLink className="min-h-11 justify-start" onClick={navTransition("/play", () => setOpen(false))} />
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

