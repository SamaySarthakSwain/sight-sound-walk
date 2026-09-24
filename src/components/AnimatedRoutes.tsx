import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "./PageTransition";
import { lazy, Suspense } from "react";
import { WebRTCProvider } from "@/contexts/WebRTCContext";
import { DetectionProvider } from "@/contexts/DetectionContext";
import { PageLoadingSkeleton } from "@/components/PageLoadingSkeleton";
import Index from "@/pages/Index";
import { RouteMeta } from "@/components/RouteMeta";

// Lazy load all non-home pages
const Explore = lazy(() => import("@/pages/Explore"));
const Food = lazy(() => import("@/pages/Food"));
const Cabs = lazy(() => import("@/pages/Cabs"));
const Hotels = lazy(() => import("@/pages/Hotels"));
const Auth = lazy(() => import("@/pages/Auth"));
const Help = lazy(() => import("@/pages/Help"));
const Profile = lazy(() => import("@/pages/Profile"));
const Assistant = lazy(() => import("@/pages/Assistant"));
const ARExperience = lazy(() => import("@/pages/ARExperience"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const CrowdDashboard = lazy(() => import("@/pages/CrowdDashboard"));
const LiveRoom = lazy(() => import("@/pages/LiveRoom"));
const Soundscape = lazy(() => import("@/pages/Soundscape"));
const SundialSimulator = lazy(() => import("@/pages/SundialSimulator"));
const ArtisanTrail = lazy(() => import("@/pages/ArtisanTrail"));
const HeritageQuests = lazy(() => import("@/pages/HeritageQuests"));
const Flash = lazy(() => import("@/pages/Flash"));
const MoreHub = lazy(() => import("@/pages/MoreHub"));
const RagGuide = lazy(() => import("@/pages/more/RagGuide"));
const AgentPlanner = lazy(() => import("@/pages/more/AgentPlanner"));
const ARRecognize = lazy(() => import("@/pages/more/ARRecognize"));
const ARTranslate = lazy(() => import("@/pages/more/ARTranslate"));
const SpatialAudio = lazy(() => import("@/pages/more/SpatialAudio"));
const VRTours = lazy(() => import("@/pages/more/VRTours"));
const Monument3D = lazy(() => import("@/pages/more/Monument3D"));
const AccessibilityPage = lazy(() => import("@/pages/more/AccessibilityPage"));
const ForYou = lazy(() => import("@/pages/more/ForYou"));
const PricingInsights = lazy(() => import("@/pages/more/PricingInsights"));
const ComingSoon = lazy(() => import("@/pages/more/ComingSoon"));

export const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <>
    <RouteMeta path={location.pathname} />
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        
        {/* Wrap lazy routes in their own Suspense inside PageTransition or outside */}
        {/* We can just put a global Suspense around the AnimatedRoutes in App.tsx, but since we need AnimatePresence to see the exit animations, Suspense should be inside PageTransition or outside AnimatePresence. If outside AnimatePresence, Suspense fallback replaces the whole route. */}
        <Route path="/explore" element={<PageTransition><Suspense fallback={<PageLoadingSkeleton />}><Explore /></Suspense></PageTransition>} />
        <Route path="/food" element={<PageTransition><Suspense fallback={<PageLoadingSkeleton />}><Food /></Suspense></PageTransition>} />
        <Route path="/cabs" element={<PageTransition><Suspense fallback={<PageLoadingSkeleton />}><Cabs /></Suspense></PageTransition>} />
        <Route path="/hotels" element={<PageTransition><Suspense fallback={<PageLoadingSkeleton />}><Hotels /></Suspense></PageTransition>} />
        <Route path="/assistant" element={<PageTransition><Suspense fallback={<PageLoadingSkeleton />}><Assistant /></Suspense></PageTransition>} />
        <Route path="/auth" element={<PageTransition><Suspense fallback={<PageLoadingSkeleton />}><Auth /></Suspense></PageTransition>} />
        <Route path="/help" element={<PageTransition><Suspense fallback={<PageLoadingSkeleton />}><Help /></Suspense></PageTransition>} />
        <Route path="/ar" element={<PageTransition><Suspense fallback={<PageLoadingSkeleton />}><ARExperience /></Suspense></PageTransition>} />
        <Route path="/profile" element={<PageTransition><Suspense fallback={<PageLoadingSkeleton />}><Profile /></Suspense></PageTransition>} />
        <Route path="/crowd" element={<PageTransition><Suspense fallback={<PageLoadingSkeleton />}><WebRTCProvider><DetectionProvider><CrowdDashboard /></DetectionProvider></WebRTCProvider></Suspense></PageTransition>} />
        <Route path="/crowd/room" element={<PageTransition><Suspense fallback={<PageLoadingSkeleton />}><LiveRoom /></Suspense></PageTransition>} />
        <Route path="/more/soundscape" element={<PageTransition><Suspense fallback={<PageLoadingSkeleton />}><Soundscape /></Suspense></PageTransition>} />
        <Route path="/more/sundial" element={<PageTransition><Suspense fallback={<PageLoadingSkeleton />}><SundialSimulator /></Suspense></PageTransition>} />
        <Route path="/more/artisan-trail" element={<PageTransition><Suspense fallback={<PageLoadingSkeleton />}><ArtisanTrail /></Suspense></PageTransition>} />
        <Route path="/more/quests" element={<PageTransition><Suspense fallback={<PageLoadingSkeleton />}><HeritageQuests /></Suspense></PageTransition>} />
        <Route path="/more" element={<PageTransition><Suspense fallback={<PageLoadingSkeleton />}><MoreHub /></Suspense></PageTransition>} />
        <Route path="/more/rag-guide" element={<PageTransition><Suspense fallback={<PageLoadingSkeleton />}><RagGuide /></Suspense></PageTransition>} />
        <Route path="/more/agent-planner" element={<PageTransition><Suspense fallback={<PageLoadingSkeleton />}><AgentPlanner /></Suspense></PageTransition>} />
        <Route path="/more/ar-recognize" element={<PageTransition><Suspense fallback={<PageLoadingSkeleton />}><ARRecognize /></Suspense></PageTransition>} />
        <Route path="/more/ar-translate" element={<PageTransition><Suspense fallback={<PageLoadingSkeleton />}><ARTranslate /></Suspense></PageTransition>} />
        <Route path="/more/spatial-audio" element={<PageTransition><Suspense fallback={<PageLoadingSkeleton />}><SpatialAudio /></Suspense></PageTransition>} />
        <Route path="/more/vr-tours" element={<PageTransition><Suspense fallback={<PageLoadingSkeleton />}><VRTours /></Suspense></PageTransition>} />
        <Route path="/more/monument-3d" element={<PageTransition><Suspense fallback={<PageLoadingSkeleton />}><Monument3D /></Suspense></PageTransition>} />
        <Route path="/more/accessibility" element={<PageTransition><Suspense fallback={<PageLoadingSkeleton />}><AccessibilityPage /></Suspense></PageTransition>} />
        <Route path="/more/for-you" element={<PageTransition><Suspense fallback={<PageLoadingSkeleton />}><ForYou /></Suspense></PageTransition>} />
        <Route path="/more/pricing-insights" element={<PageTransition><Suspense fallback={<PageLoadingSkeleton />}><PricingInsights /></Suspense></PageTransition>} />
        <Route path="/more/offline-maps" element={<PageTransition><Suspense fallback={<PageLoadingSkeleton />}><ComingSoon /></Suspense></PageTransition>} />
        <Route path="/more/webxr" element={<PageTransition><Suspense fallback={<PageLoadingSkeleton />}><ComingSoon /></Suspense></PageTransition>} />
        <Route path="/more/nft-passport" element={<PageTransition><Suspense fallback={<PageLoadingSkeleton />}><ComingSoon /></Suspense></PageTransition>} />
        <Route path="/flash" element={<PageTransition><Suspense fallback={<PageLoadingSkeleton />}><Flash /></Suspense></PageTransition>} />
        <Route path="*" element={<PageTransition><Suspense fallback={<PageLoadingSkeleton />}><NotFound /></Suspense></PageTransition>} />
      </Routes>
    </AnimatePresence>
    </>
  );
};
