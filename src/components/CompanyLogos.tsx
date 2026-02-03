import { motion } from "framer-motion";
import logoSanar from "@/assets/logo-sanar.png";
import logoSebrae from "@/assets/logo-sebrae.png";
import logoCvlb from "@/assets/logo-cvlb.png";
import logoClassapp from "@/assets/logo-classapp.png";
import logoIsaac from "@/assets/logo-isaac.png";
import logoArco from "@/assets/logo-arco.png";

interface Company {
  name: string;
  logo: string;
  url: string;
}

const companies: Company[] = [
  { name: "Sanar", logo: logoSanar, url: "https://sanarsaude.com/" },
  { name: "Sebrae", logo: logoSebrae, url: "https://sebrae.com.br/" },
  { name: "CVLB Group", logo: logoCvlb, url: "https://www.grupocvlb.com.br/" },
  { name: "ClassApp", logo: logoClassapp, url: "https://www.classapp.com.br/" },
  { name: "isaac", logo: logoIsaac, url: "https://isaac.com.br/" },
  { name: "Arco Educação", logo: logoArco, url: "https://www.arcoeducacao.com.br/" },
];

interface CompanyLogosProps {
  title: string;
  subtitle?: string;
}

export const CompanyLogos = ({ title }: CompanyLogosProps) => {
  // Duplicate companies for seamless loop
  const duplicatedCompanies = [...companies, ...companies];

  return (
    <section className="py-16 md:py-20 overflow-hidden">
      <div className="container mx-auto px-6 mb-8">
        <motion.p
          className="text-sm md:text-base font-medium text-muted-foreground uppercase tracking-widest text-center"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {title}
        </motion.p>
      </div>

      {/* Marquee Container */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
        <div 
          className="flex items-center gap-12 md:gap-16 lg:gap-20 animate-marquee"
          style={{ width: 'max-content' }}
        >
          {duplicatedCompanies.map((company, index) => (
            <a
              key={`${company.name}-${index}`}
              href={company.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 group"
            >
              <img
                src={company.logo}
                alt={`${company.name} logo`}
                className="h-8 md:h-10 w-auto object-contain brightness-0 dark:invert opacity-50 group-hover:opacity-100 transition-opacity duration-300"
                loading="lazy"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
