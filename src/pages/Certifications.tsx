import { Award, Quote } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { ContactFooter } from "@/components/ContactFooter";
import { CertificationCard } from "@/components/CertificationCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "@/hooks/useTranslations";
import inisAvatar from "@/assets/inis-avatar.png";
import esdrasAvatar from "@/assets/esdras-avatar.png";
import cadaUmNaSua from "@/assets/cada-um-na-sua.png";

const certifications = [
  { title: "Foundations of UX Design by Google", href: "https://www.coursera.org/account/accomplishments/certificate/AHMR4UGP2G98" },
  { title: "Strategic Design by The Starter", href: "https://app.crowdclass.com/tokens/8394" },
  { title: "UX Design for AI Systems", href: "https://app.crowdclass.com/tokens/9153" },
  { title: "UX Design Leadership", href: "https://app.crowdclass.com/tokens/12141" },
  { title: "Game UX Design Foundations", href: "https://www.interaction-design.org/members/rafael-bacellar-ramos-reis/certificate/masterclass/mcc_5847201105b245858759024389ba2499" },
  { title: "UX/UI na Prática (Masterclass)", href: "https://www.sympla.com.br/download-certificado?t=wEW3bUAO3xBIV29pYRsKL4vdl1mx8jSIU2FaPKEkrrI" },
  { title: "Design for the 21st Century with Don Norman", href: "https://www.interaction-design.org/members/rafael-bacellar-ramos-reis/certificate/masterclass/mcc_e5b0cd9411fb4af9993fc87c1b4f8291" },
];

export default function Certifications() {
  const t = useTranslations();

  return (
    <div className="min-h-dvh text-foreground">
      <SiteNav />
      <main id="main-content" className="mx-auto max-w-6xl px-6 pb-20 pt-16 md:pt-24">
        <section className="mb-16 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p
              className="mb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Certifications · 01
            </p>
            <h1 className="font-display text-6xl font-bold leading-[0.82] tracking-[-0.05em] md:text-[104px]">
              Proofs, praise<br />&amp; learning<br />loops<span className="text-primary">.</span>
            </h1>
          </div>
          <Card className="p-6">
            <p className="text-lg font-medium leading-snug text-foreground">
              Certificates, recommendations and recognition collected through the same practice: learning, shipping and collaborating with people.
            </p>
          </Card>
        </section>

        <section className="mb-16">
          <div className="mb-8 flex items-end justify-between gap-6 border-b-2 border-foreground pb-4">
            <h2 className="font-display text-4xl font-bold leading-[0.9] tracking-[-0.035em] md:text-5xl">Certificates</h2>
            <span
              className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              02 · Loops
            </span>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {certifications.map((cert, index) => (
              <CertificationCard key={cert.title} title={cert.title} href={cert.href} index={index} />
            ))}
          </div>
        </section>

        <section className="mb-16">
          <div className="mb-8 flex items-end justify-between gap-6 border-b-2 border-foreground pb-4">
            <h2 className="flex items-center gap-3 font-display text-4xl font-bold leading-[0.9] tracking-[-0.035em] md:text-5xl"><Award className="size-7" /> Awards</h2>
            <span
              className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              03 · Recognition
            </span>
          </div>
          <div className="relative">
            <Card className="p-8 md:pr-56 lg:pr-64">
              <h3 className="font-display text-2xl font-bold tracking-[-0.03em]">Cada um na Sua — 2nd place, Feyh Bier label contest (2019)</h3>
              <p className="mt-3 hidden text-muted-foreground leading-relaxed md:block">
                Craft beer label designed for a Feyh Bier design contest celebrating a Catharina Sour brewed with mango and umbu — two tropical fruits from my home state. The illustration of a native couple harvesting the ingredients in the woods speaks to the brief's themes of diversity and identity. The submission finished in 2nd place.
              </p>
              <a
                href="https://www.behance.net/gallery/89968669/Cada-um-na-Sua"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 border-b-2 border-foreground pb-0.5 text-[10px] font-bold uppercase tracking-[0.22em] text-foreground transition-colors hover:border-primary hover:text-primary"
                style={{ fontFamily: "var(--font-display)" }}
              >
                View on Behance →
              </a>
            </Card>
            <a
              href="https://www.behance.net/gallery/89968669/Cada-um-na-Sua"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute -bottom-12 -right-3 block w-[120px] transition-transform duration-300 hover:-rotate-2 hover:scale-105 md:-top-12 md:-right-6 md:bottom-auto md:w-[220px] lg:w-[240px]"
              style={{ transform: "rotate(-6deg)" }}
              aria-label="Cada um na Sua on Behance"
            >
              <img
                src={cadaUmNaSua}
                alt="Cada um na Sua — craft beer label sticker"
                loading="lazy"
                decoding="async"
                className="w-full drop-shadow-[0_18px_28px_rgba(0,0,0,0.22)]"
              />
            </a>
          </div>
        </section>

        <section>
          <div className="mb-8 flex items-end justify-between gap-6 border-b-2 border-foreground pb-4">
            <h2 className="flex items-center gap-3 font-display text-4xl font-bold leading-[0.9] tracking-[-0.035em] md:text-5xl"><Quote className="size-7" /> {t.recommendationsTitle}</h2>
            <span
              className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              04 · Voices
            </span>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {t.recommendationsItems?.map((rec, idx) => {
              const avatar = idx === 0 ? inisAvatar : esdrasAvatar;
              return (
                <Card key={rec.author} className="p-7">
                  <div className="mb-6 flex items-start gap-4">
                    <a href={rec.linkedin} target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-80">
                      <img src={avatar} alt={rec.author} loading="lazy" decoding="async" className="size-16 border-2 border-foreground object-cover" />
                    </a>
                    <div>
                      <h3 className="font-display text-lg font-bold tracking-[-0.02em]">{rec.author}</h3>
                      <p className="text-sm text-muted-foreground">{rec.role}</p>
                      {rec.description && <p className="mt-0.5 text-xs text-muted-foreground">{rec.description}</p>}
                    </div>
                  </div>
                  <p className="border-l-[6px] border-primary pl-5 text-base italic leading-relaxed text-foreground">"{rec.quote}"</p>
                </Card>
              );
            })}
          </div>
        </section>

      </main>
      <ContactFooter />
    </div>
  );
}
