import { lazy, Suspense } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/landing/HeroSection";
import { AuroraBackground } from "@/components/ui/aurora-background";

const FeaturedDestinations = lazy(() => import("@/components/landing/FeaturedDestinations"));
const StatsMarquee = lazy(() => import("@/components/landing/StatsMarquee"));
const HowItWorks = lazy(() => import("@/components/landing/HowItWorks"));
const ExploreServices = lazy(() => import("@/components/landing/ExploreServices"));
const CTASection = lazy(() => import("@/components/landing/CTASection"));
const Footer = lazy(() => import("@/components/landing/Footer"));

const Index = () => {
  return (
    <div className="min-h-screen relative bg-background/50">
      <AuroraBackground />
      <Navigation />
      <HeroSection />
      {/* Independent Suspense per section so slow chunks don't block the rest of the page. */}
      <Suspense fallback={null}><FeaturedDestinations /></Suspense>
      <Suspense fallback={null}><StatsMarquee /></Suspense>
      <Suspense fallback={null}><HowItWorks /></Suspense>
      <Suspense fallback={null}><ExploreServices /></Suspense>
      <Suspense fallback={null}><CTASection /></Suspense>
      <Suspense fallback={null}><Footer /></Suspense>
    </div>
  );
};

export default Index;
