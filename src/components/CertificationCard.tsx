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
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative bg-card/80 backdrop-blur-xl border-2 border-border/50 rounded-3xl p-8 transition-all duration-500 hover:shadow-xl hover:shadow-primary/20 hover:border-primary/50 block"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
      
      {/* Content */}
      <div className="relative flex items-center gap-5">
        <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
          {getIcon(title)}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>
        </div>
        
        <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-300 flex-shrink-0 mt-1" />
      </div>
      
      {/* Animated border */}
      <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-primary/20 transition-colors duration-500" />
    </motion.a>
  );
};