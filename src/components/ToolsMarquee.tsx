import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Tool {
  name: string;
  logo: string;
}

interface ToolsMarqueeProps {
  tools: Tool[];
  className?: string;
  speed?: "slow" | "normal" | "fast";
}

export function ToolsMarquee({
  tools,
  className,
  speed = "slow",
}: ToolsMarqueeProps) {
  const speedMap = {
    slow: "40s",
    normal: "25s",
    fast: "15s",
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div
        className={cn(
          "relative flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]",
          className
        )}
      >
        <div
          className="flex shrink-0 items-center gap-12 py-4 hover:[animation-play-state:paused]"
          style={{
            animation: `marquee ${speedMap[speed]} linear infinite`,
          }}
        >
          {tools.map((tool, index) => (
            <Tooltip key={`${tool.name}-${index}`}>
              <TooltipTrigger asChild>
                <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-xl bg-background hover:bg-muted transition-all duration-300 hover:scale-110 p-3 cursor-pointer">
                  <img 
                    src={tool.logo} 
                    alt={`${tool.name} logo`}
                    className="w-full h-full object-contain"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tool.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        {/* Duplicate for seamless loop */}
        <div
          className="flex shrink-0 items-center gap-12 py-4 hover:[animation-play-state:paused]"
          style={{
            animation: `marquee ${speedMap[speed]} linear infinite`,
          }}
        >
          {tools.map((tool, index) => (
            <Tooltip key={`dup-${tool.name}-${index}`}>
              <TooltipTrigger asChild>
                <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-xl bg-background hover:bg-muted transition-all duration-300 hover:scale-110 p-3 cursor-pointer">
                  <img 
                    src={tool.logo} 
                    alt={`${tool.name} logo`}
                    className="w-full h-full object-contain"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tool.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
