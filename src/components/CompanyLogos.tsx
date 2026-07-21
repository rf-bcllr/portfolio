import { AnimatedSection } from "./AnimatedSection";
import logoSanar from "@/assets/logo-sanar.png";
import logoSebrae from "@/assets/logo-sebrae.png";
import logoCvlb from "@/assets/logo-cvlb.png";
import logoClassapp from "@/assets/logo-classapp.png";
import logoIsaac from "@/assets/logo-isaac.png";
import logoArco from "@/assets/logo-arco.png";
import logoFtd from "@/assets/logo-ftd.png";
interface Company {
  name: string;
  logo: string;
  url: string;
  logoClassName?: string;
}
const companies: Company[] = [{
  name: "Sanar",
  logo: logoSanar,
  url: "https://sanarsaude.com/",
  logoClassName: "max-h-7 max-w-[108px] sm:max-h-8 sm:max-w-[122px]"
}, {
  name: "Sebrae",
  logo: logoSebrae,
  url: "https://sebrae.com.br/",
  logoClassName: "max-h-11 max-w-[92px] sm:max-h-12 sm:max-w-[104px]"
}, {
  name: "CVLB Group",
  logo: logoCvlb,
  url: "https://www.grupocvlb.com.br/",
  logoClassName: "max-h-9 max-w-[108px] sm:max-h-10 sm:max-w-[118px]"
}, {
  name: "ClassApp",
  logo: logoClassapp,
  url: "https://www.classapp.com.br/",
  logoClassName: "max-h-7 max-w-[116px] sm:max-h-8 sm:max-w-[128px]"
}, {
  name: "isaac",
  logo: logoIsaac,
  url: "https://isaac.com.br/",
  logoClassName: "max-h-8 max-w-[96px] sm:max-h-9 sm:max-w-[108px]"
}, {
  name: "Arco Educação",
  logo: logoArco,
  url: "https://www.arcoeducacao.com.br/",
  logoClassName: "max-h-12 max-w-[78px] sm:max-h-14 sm:max-w-[88px]"
}, {
  name: "FTD Educação",
  logo: logoFtd,
  url: "https://ftd.com.br/",
  logoClassName: "max-h-9 max-w-[96px] sm:max-h-10 sm:max-w-[108px]"
}];
interface CompanyLogosProps {
  title: string;
  subtitle?: string;
}
export const CompanyLogos = ({
  title,
  subtitle
}: CompanyLogosProps) => {
  return <section className="py-16 md:py-24">
      <div className="container mx-auto px-6">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
            {subtitle && <p className="text-muted-foreground max-w-2xl mx-auto">
                {subtitle}
              </p>}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-7 md:gap-x-8 md:gap-y-9 list-none p-0 m-0">
            {companies.map((company) => (
              <li key={company.name} className="flex h-16 w-32 items-center justify-center sm:h-20 sm:w-36 lg:h-24 lg:w-36">
                <a
                  href={company.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${company.name} (opens in a new tab)`}
                  className="group flex size-full items-center justify-center transition-transform duration-300 hover:scale-105"
                >
                  <img
                    src={company.logo}
                    alt=""
                    className={`h-auto w-auto object-contain brightness-0 dark:invert transition-all duration-300 ${company.logoClassName ?? "max-h-10 max-w-[112px]"}`}
                    loading="lazy"
                  />
                </a>
              </li>
            ))}
          </ul>
        </AnimatedSection>
      </div>
    </section>;
};