import { lazy, Suspense } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/landing/HeroSection";
import { AuroraBackground } from "@/components/ui/aurora-background";

const FeaturedDestinations = lazy(() => import("@/components/landing/FeaturedDestinations"));
const StatsMarquee = lazy(() => import("@/components/landing/StatsMarquee"));
const HowItWorks = lazy(() => import("@/components/landing/HowItWorks"));
const ExploreServices = lazy(() => import("@/components/landing/ExploreServices"));
const CTASection = lazy(() => import("@/components/landing/CTASection"));
const DatabaseMonuments = lazy(() => import("@/components/DatabaseMonuments"));

const Index = () => {
  return (
    <div className="min-h-screen relative bg-background/50">
      <AuroraBackground />
      <Navigation />
      <HeroSection />
      <Suspense fallback={null}>
        <FeaturedDestinations />
        <StatsMarquee />
        <HowItWorks />
        <ExploreServices />
        <DatabaseMonuments />
        <CTASection />
      </Suspense>
    </div>
  );
};

export default Index;
