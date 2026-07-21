import { motion } from "framer-motion";
import { ExternalLink, Award, BookOpen, Code, Users } from "lucide-react";

interface CertificationCardProps {
  title: string;
  href: string;
  index: number;
}

const getIcon = (title: string) => {
  if (title.includes("Google")) return <Code className="w-6 h-6" />;
  if (title.includes("Leadership") || title.includes("Liderança")) return <Users className="w-6 h-6" />;
  if (title.includes("AI") || title.includes("Inteligência")) return <BookOpen className="w-6 h-6" />;
  return <Award className="w-6 h-6" />;
};

export const CertificationCard = ({ title, href, index }: CertificationCardProps) => {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -3, x: -3 }}
      className="group relative block rounded-none border-2 border-foreground bg-card p-7 shadow-[6px_6px_0_0_hsl(var(--foreground))] transition-shadow duration-200 hover:shadow-[9px_9px_0_0_hsl(var(--foreground))]"
    >
      <div className="relative flex items-center gap-5">
        <div className="flex size-12 shrink-0 items-center justify-center border-2 border-foreground bg-secondary text-foreground transition-colors duration-200 group-hover:bg-foreground group-hover:text-background">
          {getIcon(title)}
        </div>

        <div className="min-w-0 flex-1">
          <h3
            className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Certificate
          </h3>
          <p className="mt-1 font-display text-lg font-bold leading-tight tracking-[-0.02em] text-foreground">
            {title}
          </p>
        </div>

        <ExternalLink className="mt-1 size-5 shrink-0 text-muted-foreground transition-colors duration-200 group-hover:text-primary" />
      </div>
    </motion.a>
  );
};