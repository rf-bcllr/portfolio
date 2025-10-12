import { Construction, Clock, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export const UnderConstructionState = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      {/* Animated Icon */}
      <motion.div
        animate={{ 
          rotate: [0, -10, 10, -10, 0],
          scale: [1, 1.05, 1, 1.05, 1]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatDelay: 1
        }}
        className="mb-6 relative"
      >
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
          <Construction className="w-12 h-12 text-primary" />
        </div>
        
        {/* Sparkles decoration */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
          }}
          className="absolute -top-2 -right-2"
        >
          <Sparkles className="w-6 h-6 text-yellow-500" />
        </motion.div>
      </motion.div>

      {/* Text Content */}
      <h3 className="text-2xl font-bold mb-2 font-display">
        Coming Soon
      </h3>
      <p className="text-muted-foreground max-w-md mb-4">
        This case study is currently being crafted with care. Check back soon for the full story!
      </p>
      
      {/* Optional: Timeline indicator */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="w-4 h-4" />
        <span>Expected completion: Q1 2025</span>
      </div>
    </motion.div>
  );
};
