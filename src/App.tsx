import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { LiveCursorsRoom } from "@/components/multiplayer/LiveCursorsRoom";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { ScrollToTop } from "@/components/ScrollToTop";
import { AskPortfolio } from "@/components/AskPortfolio";
import Home from "./pages/Home";
import Resume from "./pages/Resume";
import Certifications from "./pages/Certifications";
import NotFound from "./pages/NotFound";
import Play from "./pages/Play";
import StageLab from "./pages/StageLab";
import DirectionsLab from "./pages/DirectionsLab";
import PiecesLab from "./pages/PiecesLab";
import MinimalLab from "./pages/MinimalLab";

const queryClient = new QueryClient();

// Case-study pages are gone; their content lives in each section of the home canvas.
const CaseRedirect = () => {
  const { slug } = useParams();
  return <Navigate to={slug ? `/#${slug}` : "/"} replace />;
};

const App = () => {
  useSmoothScroll();
  
  return (
    <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="rfbcllr-theme-v2">
      <TooltipProvider>
        <AnimatedBackground />
        <Toaster />
        <Sonner />
        <a href="#main-content" className="skip-to-content">Skip to content</a>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <ScrollToTop />
          <AskPortfolio />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/work" element={<Navigate to="/" replace />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/certifications" element={<Certifications />} />
            <Route path="/play" element={<Play />} />
            <Route path="/lab/stageshow" element={<StageLab />} />
            <Route path="/lab/directions" element={<DirectionsLab />} />
            <Route path="/lab/pieces" element={<PiecesLab />} />
            <Route path="/lab/minimal" element={<MinimalLab />} />
            <Route path="/project/:slug" element={<CaseRedirect />} />
            <Route path="/projetos/:slug" element={<CaseRedirect />} />
            <Route path="/experience" element={<Navigate to="/resume" replace />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <LiveCursorsRoom />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
  );
};

export default App;
