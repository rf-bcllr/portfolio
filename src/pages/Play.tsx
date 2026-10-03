import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function Play() {
  const ref = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Rafael Bacellar — Quest for the Next Product";
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content") ?? null;
    meta?.setAttribute(
      "content",
      "Rafael Bacellar's portfolio as a playable RPG: 10+ years of product design, one street at a time."
    );
    return () => {
      document.title = prevTitle;
      if (meta && prevDesc !== null) meta.setAttribute("content", prevDesc);
    };
  }, []);

  return (
    <>
      <iframe
        ref={ref}
        src="/game/index.html"
        title="Quest for the Next Product — a playable portfolio"
        allow="autoplay; fullscreen"
        onLoad={() => ref.current?.focus()}
        className="fixed inset-0 z-[60] h-dvh w-screen border-0 bg-background"
      />
      <Link
        to="/"
        className="fixed left-4 top-4 z-[70] hidden rounded-full border border-foreground bg-background/80 px-3 py-1.5 text-xs font-semibold text-foreground backdrop-blur min-[901px]:inline-flex hover:bg-primary hover:text-primary-foreground"
      >
        ← Back to portfolio
      </Link>
    </>
  );
}
