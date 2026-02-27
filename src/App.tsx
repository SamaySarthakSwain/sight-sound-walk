import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { useOfflineData } from "@/hooks/useOfflineData";
import OfflineBanner from "@/components/OfflineBanner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CityProvider } from "@/contexts/CityContext";
import Index from "./pages/Index";

// Lazy load all non-home pages
const Explore = lazy(() => import("./pages/Explore"));
const Food = lazy(() => import("./pages/Food"));
const Cabs = lazy(() => import("./pages/Cabs"));
const Hotels = lazy(() => import("./pages/Hotels"));
const Auth = lazy(() => import("./pages/Auth"));
const Help = lazy(() => import("./pages/Help"));
const Profile = lazy(() => import("./pages/Profile"));
const Assistant = lazy(() => import("./pages/Assistant"));
const ARExperience = lazy(() => import("./pages/ARExperience"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => {
  useOfflineData();
  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CityProvider>
        <OfflineBanner />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/food" element={<Food />} />
              <Route path="/cabs" element={<Cabs />} />
              <Route path="/hotels" element={<Hotels />} />
              <Route path="/assistant" element={<Assistant />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/help" element={<Help />} />
              <Route path="/ar" element={<ARExperience />} />
              <Route path="/profile" element={<Profile />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CityProvider>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
