import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: string[];
  className?: string;
  speed?: "slow" | "normal" | "fast";
  direction?: "left" | "right";
  pauseOnHover?: boolean;
}

export function Marquee({
  items,
  className,
  speed = "normal",
  direction = "left",
  pauseOnHover = true,
}: MarqueeProps) {
  const speedMap = {
    slow: "40s",
    normal: "25s",
    fast: "15s",
  };

  return (
    <div
      className={cn(
        "relative flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]",
        className
      )}
    >
      <div
        className={cn(
          "flex shrink-0 items-center gap-8 py-4",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
        style={{
          animation: `marquee ${speedMap[speed]} linear infinite`,
          animationDirection: direction === "right" ? "reverse" : "normal",
        }}
      >
        {items.map((item, index) => (
          <span key={index} className="flex items-center gap-8">
            <span className="text-sm md:text-base font-medium text-foreground/70 whitespace-nowrap uppercase tracking-widest">
              {item}
            </span>
            <span className="text-primary/50 text-xs">✦</span>
          </span>
        ))}
      </div>
      {/* Duplicate for seamless loop */}
      <div
        className={cn(
          "flex shrink-0 items-center gap-8 py-4",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
        style={{
          animation: `marquee ${speedMap[speed]} linear infinite`,
          animationDirection: direction === "right" ? "reverse" : "normal",
        }}
      >
        {items.map((item, index) => (
          <span key={`dup-${index}`} className="flex items-center gap-8">
            <span className="text-sm md:text-base font-medium text-foreground/70 whitespace-nowrap uppercase tracking-widest">
              {item}
            </span>
            <span className="text-primary/50 text-xs">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
