import { motion } from "framer-motion";

interface SkillCardProps {
  skill: string;
  category: "skill" | "softSkill" | "tool" | "language";
  index: number;
  level?: number; // 1-5 for proficiency
}

export const SkillCard = ({ skill, category, index, level }: SkillCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      viewport={{ once: true, margin: "-30px" }}
      whileHover={{ y: -4, scale: 1.05 }}
      className="group"
    >
      <div className="relative p-4 rounded-xl border transition-all duration-300 bg-muted/50 text-foreground border-border hover:bg-muted">
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm">{skill}</span>
          
          {level && (
            <div className="flex gap-1 ml-2">
              {[1, 2, 3, 4, 5].map((dot) => (
                <motion.div
                  key={dot}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: (index * 0.05) + (dot * 0.1) }}
                  className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                    dot <= level 
                      ? "bg-foreground" 
                      : "bg-foreground/20"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Hover glow effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </motion.div>
  );
};