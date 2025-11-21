import { Construction, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const UnderConstructionState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      {/* Simple Icon - No Animation */}
      <div className="w-20 h-20 rounded-none bg-primary/10 flex items-center justify-center mb-6">
        <Construction className="w-10 h-10 text-primary" />
      </div>

      {/* Text Content */}
      <h3 className="text-2xl font-bold mb-3 font-display">
        Coming Soon
      </h3>
      <p className="text-muted-foreground max-w-md mb-8">
        This case study is currently being crafted. Check back soon for the full story!
      </p>

      {/* Back Button */}
      <Button variant="ghost" size="default" asChild>
        <Link to="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Link>
      </Button>
    </div>
  );
};
