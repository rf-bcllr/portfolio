import { useEffect } from "react";
import { MinimalPortfolio } from "@/components/minimal/MinimalPortfolio";
import { useLabFonts } from "@/components/canvas/shared";

/** The home page and the resume: covers, projects and the work history (see DESIGN.md, Minimal). */
export default function Home() {
  useLabFonts();
  useEffect(() => {
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
