import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CustomCursor } from "@/components/CustomCursor";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { DrawingCanvas } from "@/components/DrawingCanvas";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { ScrollToTop } from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Work from "./pages/Work";
import Resume from "./pages/Resume";
import Certifications from "./pages/Certifications";
import NotFound from "./pages/NotFound";
import ProjectDetail from "./pages/ProjectDetail";

const queryClient = new QueryClient();

const App = () => {
  useSmoothScroll();
  
  return (
    <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="rfbcllr-theme-v2">
      <TooltipProvider>
        <AnimatedBackground />
        <DrawingCanvas />
        <CustomCursor />
        <Toaster />
        <Sonner />
        <a href="#main-content" className="skip-to-content">Skip to content</a>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/work" element={<Work />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/certifications" element={<Certifications />} />
            <Route path="/project/:slug" element={<ProjectDetail />} />
            <Route path="/projetos/:slug" element={<ProjectDetail />} />
            <Route path="/experience" element={<Resume />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
  );
};

export default App;
