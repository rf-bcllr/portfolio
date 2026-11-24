import { useEffect, useState } from "react";
import { DirectionJornal } from "@/components/lab/directions/DirectionJornal";
import { DirectionOverworld } from "@/components/lab/directions/DirectionOverworld";
import { DirectionStampCanvas } from "@/components/lab/directions/DirectionStampCanvas";
import { useLabFonts } from "@/components/lab/directions/shared";

/**
 * Hidden comparison page for three redesign directions (not linked anywhere).
 * Each direction renders the real portfolio content; pick one with the switcher.
 * (The cordel direction was dropped: it leaned on regional folk stereotypes.)
 * See DESIGN.md for the research behind them.
 */
const DIRECTIONS = [
  { id: "s", name: "C · Canvas (stamps)", ref: "rauno.me + your stamp posters", Component: DirectionStampCanvas },
  { id: "b", name: "1 · O Bacellar", ref: "vanschneider.com", Component: DirectionJornal },
  { id: "c", name: "2 · Overworld", ref: "rauno.me + your Quest sprites", Component: DirectionOverworld },
] as const;

type Id = (typeof DIRECTIONS)[number]["id"];

const readId = (): Id => {
  const v = new URLSearchParams(window.location.search).get("d");
  return v === "c" || v === "b" ? v : "s";
};

export default function DirectionsLab() {
  useLabFonts();
  const [id, setId] = useState<Id>(readId);
  const active = DIRECTIONS.find((d) => d.id === id)!;

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("d", id);
    window.history.replaceState(null, "", url);
    window.scrollTo({ top: 0 });
  }, [id]);

  useEffect(() => {
    document.title = `Directions lab · ${active.name}`;
  }, [active.name]);

  return (
    <div className="lab-directions relative z-10 min-h-dvh bg-white">
      {/* The live site sets Clash Display on h1/h2; each mockup brings its own faces. */}
      <style>{`.lab-directions :is(h1,h2,h3,h4,h5,h6){font-family:inherit}`}</style>
      <div
        className="sticky top-0 z-40 flex h-11 items-center gap-3 overflow-x-auto bg-[#141412] px-3 text-[12px] text-white"
        style={{ fontFamily: '"Geist Mono", ui-monospace, monospace' }}
      >
        <span className="hidden shrink-0 text-white/50 sm:inline">Directions lab</span>
        <div role="tablist" aria-label="Design directions" className="flex shrink-0 gap-1">
          {DIRECTIONS.map((d) => (
            <button
              key={d.id}
              type="button"
              role="tab"
              aria-selected={d.id === id}
              onClick={() => setId(d.id)}
              className={`h-8 shrink-0 rounded-md px-3 transition-colors ${d.id === id ? "bg-white text-[#141412]" : "text-white/75 hover:bg-white/10"}`}
            >
              {d.name}
            </button>
          ))}
        </div>
        <span className="ml-auto hidden shrink-0 text-white/50 md:inline">Reference: {active.ref}</span>
      </div>
      <active.Component key={active.id} />
    </div>
  );
}
