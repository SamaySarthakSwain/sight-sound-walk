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

// A subtle glowing pulse to serve as a beautiful placeholder while chunks load
const SectionSkeleton = () => (
  <div className="w-full h-[50vh] flex items-center justify-center bg-background/50 animate-pulse">
    <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen relative bg-background/50">
      <AuroraBackground />
      <Navigation />
      <HeroSection />
      <Suspense fallback={<SectionSkeleton />}><FeaturedDestinations /></Suspense>
      <Suspense fallback={null}><StatsMarquee /></Suspense>
      <Suspense fallback={<SectionSkeleton />}><HowItWorks /></Suspense>
      <Suspense fallback={<SectionSkeleton />}><ExploreServices /></Suspense>
      <Suspense fallback={null}><CTASection /></Suspense>
      <Suspense fallback={null}><Footer /></Suspense>
    </div>
  );
};

export default Index;
