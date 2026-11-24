import { useEffect } from "react";
import { SECTIONS } from "@/components/canvas/canvasFrames";
import { useLabFonts } from "@/components/canvas/shared";

/** Hidden rehearsal page: every stageshow piece alone, for filming (not linked anywhere). */
export default function PiecesLab() {
  useLabFonts();
  useEffect(() => { document.title = "Pieces lab"; }, []);
  const only = new URLSearchParams(window.location.search).get("p");
  return (
    <main className="relative z-10 flex min-h-dvh flex-col items-start gap-16 bg-white p-10">
      {SECTIONS.flatMap((s) => s.pieces)
        .filter((p) => !only || p.id === only)
        .map((p) => (
          <section key={p.id} id={`p-${p.id}`} style={{ width: p.w ?? 560 }}>
            <p className="mb-3 text-sm text-neutral-500">{p.id}</p>
            <p.C />
          </section>
        ))}
    </main>
  );
}
