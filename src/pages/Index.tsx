import { lazy, Suspense } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/landing/HeroSection";
import { AuroraBackground } from "@/components/ui/aurora-background";
import BentoFeatures from "@/components/landing/BentoFeatures";
import LiveCrowdRadar from "@/components/landing/LiveCrowdRadar";
import NeuralCoreShowcase from "@/components/landing/NeuralCoreShowcase";

const FeaturedDestinations = lazy(() => import("@/components/landing/FeaturedDestinations"));
const StatsMarquee = lazy(() => import("@/components/landing/StatsMarquee"));
const HowItWorks = lazy(() => import("@/components/landing/HowItWorks"));
const ExploreServices = lazy(() => import("@/components/landing/ExploreServices"));
const CTASection = lazy(() => import("@/components/landing/CTASection"));
const Footer = lazy(() => import("@/components/landing/Footer"));

// Subtle glowing pulse placeholder
const SectionSkeleton = () => (
  <div className="w-full h-[40vh] flex items-center justify-center bg-background/50 animate-pulse">
    <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen relative bg-background/50 pb-28">
      <AuroraBackground />
      <Navigation />
      
      {/* 1. Hero Section with Live Telemetry and Shimmer CTAs */}
      <HeroSection />

      {/* 2. Real Numbers & Telemetry Marquee */}
      <Suspense fallback={null}>
        <StatsMarquee />
      </Suspense>

      {/* 3. Flagship Bento Matrix: Crowd Management, 3D AR & Spatial Narration */}
      <BentoFeatures />

      {/* 4. Live Computer Vision Crowd Radar & Safety Sentinel */}
      <LiveCrowdRadar />

      {/* 5. The Multimodal Neural Core Orbital Architecture */}
      <NeuralCoreShowcase />

      {/* 6. Curated Destinations with 3D Scroll Perspective */}
      <Suspense fallback={<SectionSkeleton />}>
        <FeaturedDestinations />
      </Suspense>

      {/* 7. Comprehensive Interactive Services Matrix */}
      <Suspense fallback={<SectionSkeleton />}>
        <ExploreServices />
      </Suspense>

      {/* 8. How It Works Guided Walkthrough */}
      <Suspense fallback={<SectionSkeleton />}>
        <HowItWorks />
      </Suspense>

      {/* 9. Final Call to Action */}
      <Suspense fallback={null}>
        <CTASection />
      </Suspense>

      {/* 10. Footer */}
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;