import { useState, useEffect, useCallback } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import MeteorBackground from "@/components/MeteorBackground";
import SplashScreen from "@/components/SplashScreen";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import CreateLink from "./pages/CreateLink";
import GeneratedLink from "./pages/GeneratedLink";
import PublicPay from "./pages/PublicPay";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const location = useLocation();
  const [showSplash, setShowSplash] = useState(true);
  const [splashKey, setSplashKey] = useState(0);

  useEffect(() => {
    setSplashKey((k) => k + 1);
    setShowSplash(true);
  }, [location.pathname]);

  const handleSplashComplete = useCallback(() => setShowSplash(false), []);

  return (
    <>
      {showSplash && (
        <SplashScreen key={splashKey} onComplete={handleSplashComplete} />
      )}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/create" element={<CreateLink />} />
        <Route path="/link/:token" element={<GeneratedLink />} />
        <Route path="/pay/:token" element={<PublicPay />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <MeteorBackground />
        <AppRoutes />
        <Footer />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
