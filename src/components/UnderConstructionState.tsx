import { Construction } from "lucide-react";

export const UnderConstructionState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      {/* Simple Icon - No Animation */}
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Construction className="w-10 h-10 text-primary" />
      </div>

      {/* Text Content */}
      <h3 className="text-2xl font-bold mb-3 font-display">
        Coming Soon
      </h3>
      <p className="text-muted-foreground max-w-md">
        This case study is currently being crafted. Check back soon for the full story!
      </p>
    </div>
  );
};
