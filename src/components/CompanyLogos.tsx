import { AnimatedSection } from "./AnimatedSection";

interface Company {
  name: string;
  logo: string;
  url: string;
}

const companies: Company[] = [
  {
    name: "Sanar",
    logo: "https://sanarsaude.com/favicon.ico",
    url: "https://sanarsaude.com/"
  },
  {
    name: "Sebrae",
    logo: "https://sebrae.com.br/favicon.ico",
    url: "https://sebrae.com.br/"
  },
  {
    name: "CVLB Group",
    logo: "https://www.grupocvlb.com.br/favicon.ico",
    url: "https://www.grupocvlb.com.br/"
  },
  {
    name: "ClassApp",
    logo: "https://www.classapp.com.br/favicon.ico",
    url: "https://www.classapp.com.br/"
  },
  {
    name: "isaac",
    logo: "https://isaac.com.br/favicon.ico",
    url: "https://isaac.com.br/"
  },
  {
    name: "Arco Educação",
    logo: "https://www.arcoeducacao.com.br/favicon.ico",
    url: "https://www.arcoeducacao.com.br/"
  }
];

interface CompanyLogosProps {
  title: string;
  subtitle?: string;
}

export const CompanyLogos = ({ title, subtitle }: CompanyLogosProps) => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-6">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
            {subtitle && (
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-12 items-center justify-items-center">
            {companies.map((company, index) => (
              <a
                key={company.name}
                href={company.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-full aspect-square max-w-[120px] flex items-center justify-center p-6 rounded-xl border border-border bg-card/50 hover:bg-card transition-all duration-300 hover:scale-110 hover:shadow-lg"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <img
                  src={company.logo}
                  alt={`${company.name} logo`}
                  className="w-full h-full object-contain opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to company name if logo fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      const text = document.createElement('span');
                      text.textContent = company.name;
                      text.className = 'text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors';
                      parent.appendChild(text);
                    }
                  }}
                />
              </a>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};
