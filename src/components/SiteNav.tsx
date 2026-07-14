import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import avatar from "@/assets/rafael-bacellar-avatar.jpg";

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
      rel="noreferrer"
      onClick={onClick}
      data-cursor-link
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-full bg-[#2F6BFF] px-4 py-2 text-sm font-semibold text-white shadow-[0_6px_18px_-6px_rgba(47,107,255,0.65)] transition-all duration-150 hover:bg-[#1F58EA] hover:shadow-[0_10px_24px_-6px_rgba(47,107,255,0.75)] active:scale-[0.98] ${className}`}
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
        className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full px-4 py-2 backdrop-blur-2xl backdrop-saturate-150"
        style={{
          background:
            "linear-gradient(135deg, hsl(var(--card) / 0.55), hsl(var(--card) / 0.25))",
          border: "1px solid hsl(var(--card) / 0.6)",
          boxShadow:
            "0 10px 40px -12px hsl(222 18% 12% / 0.18), inset 0 1px 0 hsl(0 0% 100% / 0.55), inset 0 -1px 0 hsl(var(--foreground) / 0.06)",
        }}
      >
        <Link
          to="/"
          data-cursor-action="home"
          className="flex shrink-0 items-center gap-2.5 rounded-full pr-2 text-lg font-semibold"
        >
          <img
            src={avatar}
            alt="Rafael Bacellar avatar"
            className="size-10 rounded-full border border-border object-cover"
          />
          <span className="hidden sm:inline">rfbcllr.</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden min-w-0 flex-1 items-center justify-center gap-2 px-2 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              data-cursor-action="navigate-internal"
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
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

        {/* Desktop CTA */}
        <ConnectButton className="hidden shrink-0 md:inline-flex" />

        {/* Mobile: CTA + toggle */}
        <div className="flex shrink-0 items-center gap-2 md:hidden">
          <ConnectButton className="px-3.5 py-1.5 text-xs" />
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

        {/* Mobile collapsible panel */}
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
                      isActive
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <ConnectButton className="mt-1 w-full" onClick={() => setOpen(false)} />
            </div>
          </div>
        )}
      </nav>
      {/* Hide unused active label reference to satisfy linters if any */}
      <span className="sr-only">{activeItem.label}</span>
    </header>
  );
}
