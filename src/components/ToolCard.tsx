import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface ToolCardProps {
  name: string;
  category?: string;
  index: number;
}

export const ToolCard = ({ name, category, index }: ToolCardProps) => {
  // Map tool names to brand colors for visual distinction
  const getToolColor = (tool: string) => {
    const colorMap: Record<string, string> = {
      "Figma": "#F24E1E",
      "Adobe XD": "#FF61F6",
      "Photoshop": "#31A8FF",
      "Illustrator": "#FF9A00",
      "Sketch": "#F7B500",
      "Framer": "#0055FF",
      "Miro": "#FFD02F",
      "FigJam": "#7B61FF",
      "Figma Make": "#0ACF83",
      "Lovable": "#8B5CF6",
      "v0": "#000000"
    };
    return colorMap[tool] || "hsl(var(--primary))";
  };

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
      <Card className="rounded-2xl p-6 hover-lift aspect-square flex flex-col items-center justify-center text-center group transition-all duration-300">
        <div className="space-y-2">
          <h3 
            className="font-semibold text-lg transition-colors duration-300"
            style={{ color: getToolColor(name) }}
          >
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
