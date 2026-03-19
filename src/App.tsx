import { lazy, Suspense, useEffect, Component, ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CityProvider } from "@/contexts/CityContext";
import { GoogleMapsProvider } from "@/contexts/GoogleMapsContext";
import { WebRTCProvider } from "@/contexts/WebRTCContext";
import { DetectionProvider } from "@/contexts/DetectionContext";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import { toast } from "sonner";

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
const CrowdDashboard = lazy(() => import("./pages/CrowdDashboard"));
const LiveRoom = lazy(() => import("./pages/LiveRoom"));

// Lazy load heavy non-critical components
const FloatingParticles = lazy(() => import("@/components/FloatingParticles"));
const ProactiveNudgeTrigger = lazy(() => import("@/components/ProactiveNudgeTrigger"));
const OfflineBanner = lazy(() => import("@/components/OfflineBanner"));

// Optimized QueryClient — cache aggressively, reduce refetches
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});

// Error Boundary to prevent full-page crashes
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("App Error Boundary:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-8">
          <div className="text-center space-y-4 max-w-md">
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <p className="text-muted-foreground">The app encountered an error. Please refresh to try again.</p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.href = "/";
              }}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg"
            >
              Refresh App
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => {
  // Global unhandled promise rejection handler
  useEffect(() => {
    const handler = (event: PromiseRejectionEvent) => {
      console.error("Unhandled rejection:", event.reason);
      event.preventDefault(); // Prevent crash
    };
    window.addEventListener("unhandledrejection", handler);
    return () => window.removeEventListener("unhandledrejection", handler);
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <CityProvider>
              <BrowserRouter>
                <GoogleMapsProvider>
                  <Suspense fallback={null}>
                    <FloatingParticles />
                    <ProactiveNudgeTrigger />
                    <OfflineBanner />
                  </Suspense>
                  <Toaster />
                  <Sonner />
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
                    <Route path="/crowd" element={<WebRTCProvider><DetectionProvider><CrowdDashboard /></DetectionProvider></WebRTCProvider>} />
                    <Route path="/crowd/room" element={<LiveRoom />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
                </GoogleMapsProvider>
              </BrowserRouter>
            </CityProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
