import { motion } from "framer-motion";
import React from "react";

interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  delay?: number;
}

export const FeatureCard = ({ icon: Icon, title, description, delay = 0 }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-[24px] p-6 hover:border-primary/30 transition-all duration-300 group"
    >
      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4 group-hover:bg-muted/80 transition-colors">
        <Icon className="w-6 h-6 text-foreground" />
      </div>
      <h4 className="font-semibold text-foreground mb-2 text-xl">{title}</h4>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
};
