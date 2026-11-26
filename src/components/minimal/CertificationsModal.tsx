/** Certificates, as a dialog over the Resume page: the same list the old page held, in the new layout. */
import { useEffect, useRef } from "react";
import { ArrowUpRight, X } from "lucide-react";

export const certifications = [
  { title: "Foundations of UX Design", by: "Google", href: "https://www.coursera.org/account/accomplishments/certificate/AHMR4UGP2G98" },
  { title: "Strategic Design", by: "The Starter", href: "https://app.crowdclass.com/tokens/8394" },
  { title: "UX Design for AI Systems", by: "CrowdClass", href: "https://app.crowdclass.com/tokens/9153" },
  { title: "UX Design Leadership", by: "CrowdClass", href: "https://app.crowdclass.com/tokens/12141" },
  { title: "Game UX Design Foundations", by: "Interaction Design Foundation", href: "https://www.interaction-design.org/members/rafael-bacellar-ramos-reis/certificate/masterclass/mcc_5847201105b245858759024389ba2499" },
  { title: "UX/UI na Prática (Masterclass)", by: "Sympla", href: "https://www.sympla.com.br/download-certificado?t=wEW3bUAO3xBIV29pYRsKL4vdl1mx8jSIU2FaPKEkrrI" },
  { title: "Design for the 21st Century with Don Norman", by: "Interaction Design Foundation", href: "https://www.interaction-design.org/members/rafael-bacellar-ramos-reis/certificate/masterclass/mcc_e5b0cd9411fb4af9993fc87c1b4f8291" },
];

export function CertificationsModal({ onClose }: { onClose: () => void }) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    box.current?.querySelector<HTMLElement>("button, a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.stopPropagation(); onClose(); }
      if (e.key !== "Tab" || !box.current) return;
      const f = [...box.current.querySelectorAll<HTMLElement>("a, button")];
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey, true);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey, true); document.body.style.overflow = overflow; prev?.focus(); };
  }, [onClose]);
  return (
    <div className="mn-modal" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div ref={box} role="dialog" aria-modal="true" aria-labelledby="mn-cert-t" className="mn-modal-box">
        <header><h2 id="mn-cert-t">Certifications</h2><button type="button" aria-label="Close" onClick={onClose}><X size={18} /></button></header>
        <ul>
          {certifications.map((c) => (
            <li key={c.title}><a href={c.href} target="_blank" rel="noreferrer"><span><b>{c.title}</b><em>{c.by}</em></span><ArrowUpRight size={18} aria-hidden="true" /></a></li>
          ))}
        </ul>
      </div>
    </div>
  );
}
