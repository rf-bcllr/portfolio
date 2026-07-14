import { motion } from "framer-motion";
import React from "react";

interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  delay?: number;
}

const palettes = ["vivid-lilac", "vivid-sage", "vivid-yellow", "vivid-sky", "vivid-coral", "vivid-orange"];

export const FeatureCard = ({ icon: Icon, title, description, delay = 0 }: FeatureCardProps) => {
  const paletteIndex = Math.abs(title.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0)) % palettes.length;
  const palette = palettes[paletteIndex];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className={`vivid-card ${palette} border rounded-[24px] p-6 hover:-translate-y-1 transition-all duration-300 group`}
    >
      <div className="w-12 h-12 rounded-xl bg-card/60 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:bg-card/80 transition-colors">
        <Icon className="w-6 h-6 text-foreground" />
      </div>
      <h4 className="font-semibold mb-2 text-xl">{title}</h4>
      <p className="text-sm leading-relaxed opacity-85">{description}</p>
    </motion.div>
  );
};
