import { lazy, Suspense } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/landing/HeroSection";
import { AuroraBackground } from "@/components/ui/aurora-background";

// Below-the-fold components lazy-loaded for blazing fast initial paint
const BentoFeatures = lazy(() => import("@/components/landing/BentoFeatures"));
const LiveCrowdRadar = lazy(() => import("@/components/landing/LiveCrowdRadar"));
const NeuralCoreShowcase = lazy(() => import("@/components/landing/NeuralCoreShowcase"));
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
      <Suspense fallback={<SectionSkeleton />}>
        <BentoFeatures />
      </Suspense>

      {/* 4. Live Computer Vision Crowd Radar & Safety Sentinel */}
      <Suspense fallback={<SectionSkeleton />}>
        <LiveCrowdRadar />
      </Suspense>

      {/* 5. The Multimodal Neural Core Orbital Architecture */}
      <Suspense fallback={<SectionSkeleton />}>
        <NeuralCoreShowcase />
      </Suspense>

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