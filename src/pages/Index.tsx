import { useState } from "react";
import { BentoGrid, BentoCard } from "@/components/bento/BentoGrid";
import { ProfileCard } from "@/components/bento/ProfileCard";
import { ProjectCard } from "@/components/bento/ProjectCard";
import { RecommendationsCard } from "@/components/bento/RecommendationsCard";
import { CertificationsCard } from "@/components/bento/CertificationsCard";
import { SocialCard } from "@/components/bento/SocialCard";
import { TogglesCard } from "@/components/bento/TogglesCard";
import { useTranslations } from "@/hooks/useTranslations";

const Index = () => {
  const [language, setLanguage] = useState<"pt" | "en">("pt");
  const t = useTranslations(language);

  // Projects pulled from Bento profile
  const projects = [
    { src: "https://storage.googleapis.com/creatorspace-public/users%2Fclnkcjnw802u4ou01tta5rqcm%2FUKVcVl4DB6Bzva11-ScreenRecording2024-11-19at08.19.59-ezgif.com-crop.gif", title: "New app @isaac (GIF)", href: "https://bento.me/rfbcllr" },
    { src: "https://storage.googleapis.com/creatorspace-public/users%2Fclnkcjnw802u4ou01tta5rqcm%2F6fsoLs1a9Yicj3I3-IA.gif", title: "AI interactions (GIF)", href: "https://bento.me/rfbcllr" },
    { src: "https://creatorspace.imgix.net/users/clnkcjnw802u4ou01tta5rqcm/6d1gUMMWYdGdDNPe-26ddde76011107.Y3JvcCw4MDgsNjMyLDAsMA%2520(1).png?w=1500", title: "Login, Onboarding and Home @Mural", href: "https://bento.me/rfbcllr" },
    { src: "https://creatorspace.imgix.net/users/clnkcjnw802u4ou01tta5rqcm/EC90UL0Vda7i4S30-Screenshot%25202023-10-10%2520at%252022.10.09.png?w=1500", title: "Healthy Food & Groceries App Prototype", href: "https://www.figma.com/proto/YpQOWHj5nJEZqHdi7hn3VR/Sa%C3%BAde-e-Ponto?kind=&node-id=978-7363&page-id=5%3A5&scaling=scale-down&show-proto-sidebar=1&starting-point-node-id=978%3A7363&mode=design&t=7depr6rbcfCS1Mkq-1" }
  ];

  const certifications = [
    { name: "Foundations of UX Design by Google — Coursera", href: "https://www.coursera.org/account/accomplishments/certificate/AHMR4UGP2G98" },
    { name: "UX Design for AI Systems — Crowdclass", href: "https://app.crowdclass.com/tokens/9153" },
    { name: "UX Design Leadership — Crowdclass", href: "https://app.crowdclass.com/tokens/12141" },
    { name: "Strategic Design by The Starter — Crowdclass", href: "https://app.crowdclass.com/tokens/8394" }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main>
        <BentoGrid className="py-12">
          {/* Profile - center piece */}
          <BentoCard className="col-span-6 lg:col-span-4 row-span-2">
            <ProfileCard language={language} />
          </BentoCard>

          {/* Projects - big visuals, full images, non-cropped */}
          {projects.map((p, i) => (
            <BentoCard key={i} className={`col-span-6 sm:col-span-3 ${i < 2 ? "row-span-2" : "row-span-1"} border-0 bg-transparent shadow-none`}>
              <ProjectCard title={p.title} src={p.src} href={p.href} />
            </BentoCard>
          ))}

          {/* Recommendations */}
          <BentoCard className="col-span-6 sm:col-span-3">
            <RecommendationsCard />
          </BentoCard>

          {/* Certifications */}
          <BentoCard className="col-span-6 sm:col-span-3">
            <CertificationsCard items={certifications} />
          </BentoCard>

          {/* Social small boxes */}
          <BentoCard className="col-span-6 sm:col-span-3">
            <SocialCard />
          </BentoCard>

          {/* Toggles */}
          <BentoCard className="col-span-6 sm:col-span-3">
            <TogglesCard language={language} onLanguageChange={setLanguage} />
          </BentoCard>
        </BentoGrid>
      </main>

      <footer className="border-t py-8 text-center">
        <div className="container mx-auto px-6">
          <div className="mb-4">
            <a
              href="https://linkedin.com/in/rfbcllr"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="inline-flex items-center justify-center rounded-md border bg-primary text-primary-foreground px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-primary/90"
            >
              LinkedIn
            </a>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Rafael Bacellar
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
