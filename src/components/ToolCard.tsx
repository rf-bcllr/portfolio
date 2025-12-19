import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface ToolCardProps {
  name: string;
  category?: string;
  index: number;
}

export const ToolCard = ({ name, category, index }: ToolCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      viewport={{ once: true }}
    >
      <Card className="rounded-[24px] p-6 hover-lift aspect-square flex flex-col items-center justify-center text-center group transition-all duration-300">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg text-foreground transition-colors duration-300">
            {name}
          </h3>
          {category && (
            <p className="text-xs text-muted-foreground">
              {category}
            </p>
          )}
        </div>
      </Card>
    </motion.div>
  );
};
