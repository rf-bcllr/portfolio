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
  url: "https://sanarsaude.com/"
}, {
  name: "Sebrae",
  logo: logoSebrae,
  url: "https://sebrae.com.br/"
}, {
  name: "CVLB Group",
  logo: logoCvlb,
  url: "https://www.grupocvlb.com.br/"
}, {
  name: "ClassApp",
  logo: logoClassapp,
  url: "https://www.classapp.com.br/"
}, {
  name: "isaac",
  logo: logoIsaac,
  url: "https://isaac.com.br/"
}, {
  name: "Arco Educação",
  logo: logoArco,
  url: "https://www.arcoeducacao.com.br/"
}, {
  name: "FTD Educação",
  logo: logoFtd,
  url: "https://ftd.com.br/",
  logoClassName: "scale-[0.7]"
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
          <ul className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:grid lg:grid-cols-7 lg:justify-items-center list-none p-0 m-0">
            {companies.map((company, index) => <li key={company.name}><a href={company.url} target="_blank" rel="noopener noreferrer" aria-label={`${company.name} (opens in a new tab)`} style={{
            animationDelay: `${index * 0.1}s`
          }} className="group relative aspect-square w-[40%] max-w-[120px] flex items-center justify-center p-6 transition-all duration-300 hover:scale-110 px-[12px] md:w-[20%] lg:w-full">
                <img src={company.logo} alt="" className={`w-full h-full object-contain brightness-0 dark:invert transition-all duration-300 ${company.logoClassName ?? ""}`} loading="lazy" />
              </a></li>)}
          </ul>
        </AnimatedSection>
      </div>
    </section>;
};