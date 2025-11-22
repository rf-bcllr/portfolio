import { useTheme } from "./ThemeProvider";

export const AnimatedBackground = () => {
  const { theme } = useTheme();
  
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  
  return (
    <div className="fixed inset-0 -z-20 overflow-hidden">
      {/* Base layer */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Animated gradient orbs - CSS only */}
      <div
        className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] rounded-full animate-float-slow"
        style={{
          background: isDark 
            ? "radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(147, 197, 253, 0.4) 0%, transparent 70%)",
          filter: "blur(80px)",
          opacity: 0.7,
        }}
      />
      
      <div
        className="absolute -bottom-1/2 -right-1/4 w-[800px] h-[800px] rounded-full animate-float-medium"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(196, 181, 253, 0.4) 0%, transparent 70%)",
          filter: "blur(80px)",
          opacity: 0.7,
        }}
      />
      
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full animate-pulse-slow"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(59, 130, 246, 0.35) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(191, 219, 254, 0.35) 0%, transparent 70%)",
          filter: "blur(80px)",
          opacity: 0.6,
        }}
      />
      
      {/* Subtle noise texture for depth */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};
