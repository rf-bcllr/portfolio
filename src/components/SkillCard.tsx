import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface SkillCardProps {
  skill: string;
  category: "skill" | "softSkill" | "tool" | "language";
  index: number;
  level?: number; // 1-5 for proficiency
}

export const SkillCard = ({ skill, category, index, level }: SkillCardProps) => {
  const getCategoryColor = () => {
    switch (category) {
      case "skill":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20";
      case "softSkill":
        return "bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20";
      case "tool":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20 hover:bg-purple-500/20";
      case "language":
        return "bg-orange-500/10 text-orange-600 border-orange-500/20 hover:bg-orange-500/20";
      default:
        return "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20";
    }
  };

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
      <div className={`relative p-4 rounded-none border transition-all duration-300 ${getCategoryColor()}`}>
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
                  className={`w-1.5 h-1.5 rounded-none transition-colors duration-300 ${
                    dot <= level 
                      ? "bg-current" 
                      : "bg-current/20"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Hover glow effect */}
        <div className="absolute inset-0 rounded-none bg-gradient-to-r from-current/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </motion.div>
  );
};