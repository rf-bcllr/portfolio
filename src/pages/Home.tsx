import { useEffect } from "react";
import { PortfolioCanvas } from "@/components/canvas/PortfolioCanvas";
import { useLabFonts } from "@/components/canvas/shared";

/** The portfolio as a design file: every case is a section on one canvas (see DESIGN.md, C · Canvas). */
export default function Home() {
  useLabFonts();
  useEffect(() => {
    document.title = "Rafael Bacellar — Product Designer | Portfólio";
  }, []);
  return (
    <main id="main-content" className="relative z-10 min-h-dvh">
      <PortfolioCanvas />
    </main>
  );
}
