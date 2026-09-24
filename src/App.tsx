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
import { AnimatedRoutes } from "@/components/AnimatedRoutes";
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = "218816203507-1q868u09qmugc5rh3cmad18fckqu03gt.apps.googleusercontent.com";

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
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
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
                    <AnimatedRoutes />
                  </GoogleMapsProvider>
                </BrowserRouter>
              </CityProvider>
            </TooltipProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </GoogleOAuthProvider>
    </ErrorBoundary>
  );
};

export default App;
