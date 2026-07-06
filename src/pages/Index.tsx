import { lazy, Suspense } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/landing/HeroSection";
import { AuroraBackground } from "@/components/ui/aurora-background";

const FeaturedDestinations = lazy(() => import("@/components/landing/FeaturedDestinations"));
const StatsMarquee = lazy(() => import("@/components/landing/StatsMarquee"));
const HowItWorks = lazy(() => import("@/components/landing/HowItWorks"));
const ExploreServices = lazy(() => import("@/components/landing/ExploreServices"));
const CTASection = lazy(() => import("@/components/landing/CTASection"));


const Index = () => {
  return (
    <div className="min-h-screen relative bg-background/50">
      <AuroraBackground />
      <Navigation />
      <HeroSection />
<<<<<<< HEAD
      <Suspense fallback={null}>
        <FeaturedDestinations />
        <StatsMarquee />
        <HowItWorks />
        <ExploreServices />
        <CTASection />
      </Suspense>
=======
      {/* Independent Suspense per section so slow chunks don't block the rest of the page. */}
      <Suspense fallback={null}><FeaturedDestinations /></Suspense>
      <Suspense fallback={null}><StatsMarquee /></Suspense>
      <Suspense fallback={null}><HowItWorks /></Suspense>
      <Suspense fallback={null}><ExploreServices /></Suspense>
      <Suspense fallback={null}><DatabaseMonuments /></Suspense>
      <Suspense fallback={null}><CTASection /></Suspense>
>>>>>>> 01b43efe12fdd4481dbab268df1d62f70f74faf3
    </div>
  );
};

export default Index;
