import { useEffect } from "react";
import { MinimalPortfolio } from "@/components/minimal/MinimalPortfolio";
import { useLabFonts } from "@/components/canvas/shared";

/** Unlinked preview of the minimal direction (see DESIGN.md, Minimal). */
export default function MinimalLab() {
  useLabFonts();
  useEffect(() => {
    document.title = "Rafael Bacellar, product designer";
    const id = "mn-font";
    if (document.getElementById(id)) return;
    const l = document.createElement("link");
    l.id = id;
    l.rel = "stylesheet";
    l.href = "https://api.fontshare.com/v2/css?f[]=switzer@400,500&display=swap";
    document.head.appendChild(l);
  }, []);
  return <MinimalPortfolio />;
}
