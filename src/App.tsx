import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import Experience from "./pages/Experience";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ExperienceWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [language, setLanguage] = useState<"pt" | "en">(
    location.pathname === "/experiencia" ? "pt" : "en"
  );

  useEffect(() => {
    setLanguage(location.pathname === "/experiencia" ? "pt" : "en");
  }, [location.pathname]);

  const handleLanguageChange = (newLang: "pt" | "en") => {
    setLanguage(newLang);
    navigate(newLang === "pt" ? "/experiencia" : "/experience", { replace: true });
  };

  return <Experience language={language} onLanguageChange={handleLanguageChange} />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/experiencia" element={<ExperienceWrapper />} />
            <Route path="/experience" element={<ExperienceWrapper />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
