import React from "react";
import { 
  Users, Volume2, Box, Sun, Palette, Car, Sparkles, 
  ShieldAlert, Activity, ArrowRight, Eye, Navigation, Cpu
} from "lucide-react";
import { BentoGrid, BentoCard } from "@/components/magicui/bento-grid";
import { BorderBeam } from "@/components/magicui/border-beam";
import { Meteors } from "@/components/magicui/meteors";
import { Badge } from "@/components/ui/badge";
import ScrollReveal from "@/components/ScrollReveal";

export const BentoFeatures = () => {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-background">
      {/* Subtle background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <ScrollReveal>
          <div className="text-center mb-16 space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              <Cpu className="w-3.5 h-3.5" />
              <span>Next-Gen Architecture & Edge AI</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
              An Intelligent{" "}
              <span className="bg-gradient-to-r from-primary via-amber-500 to-orange-500 bg-clip-text text-transparent">
                Heritage Ecosystem
              </span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Moving beyond static tourism websites. Let's Explore pairs deep neural network crowd intelligence, spatial audio, and computer vision to safeguard heritage and empower explorers.
            </p>
          </div>
        </ScrollReveal>

        {/* The Flagship Bento Grid */}
        <BentoGrid className="grid-cols-1 md:grid-cols-3 auto-rows-[22rem] gap-6">
          {/* Card 1: Crowd Intelligence (Large Span 2) */}
          <div className="relative group col-span-1 md:col-span-2 rounded-3xl overflow-hidden glass-card border border-primary/30 p-8 flex flex-col justify-between shadow-2xl">
            <BorderBeam size={120} duration={8} colorFrom="#f59e0b" colorTo="#ef4444" />
            <Meteors number={15} />

            <div className="flex items-start justify-between z-10">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shadow-inner">
                <Users className="w-6 h-6" />
              </div>
              <Badge variant="outline" className="border-red-500/40 text-red-500 bg-red-500/10 px-3 py-1 font-mono text-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                Live AI Density Monitoring
              </Badge>
            </div>

            <div className="z-10 space-y-3 my-auto">
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Neural Crowd Management System
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed">
                Powered by lightweight edge YOLOv8 computer vision. Analyzes live visitor density across 90+ zones, calculating real-time safety indices and predictive surge alerts to eliminate stampede hazards and preserve ancient temple sanctums.
              </p>
            </div>

            <div className="z-10 flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                <span className="flex items-center gap-1 text-emerald-500 font-semibold">
                  <Activity className="w-4 h-4" /> 99.4% Model Precision
                </span>
                <span>•</span>
                <span>Sub-50ms Inference</span>
              </div>
              <a
                href="/crowd"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-amber-400 transition-colors"
              >
                Open Dashboard <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          {/* Card 2: 3D AR & WebXR */}
          <div className="relative group col-span-1 rounded-3xl overflow-hidden glass-card border border-white/10 p-8 flex flex-col justify-between shadow-xl">
            <BorderBeam size={80} duration={7} colorFrom="#3b82f6" colorTo="#8b5cf6" />
            
            <div className="flex items-start justify-between z-10">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                <Box className="w-6 h-6" />
              </div>
              <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10 text-xs">
                WebXR Ready
              </Badge>
            </div>

            <div className="z-10 space-y-2">
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                Interactive 3D AR Projections
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Step inside high-polygon 3D reconstructions of ancient Kalinga stone architecture right in mobile Chrome without external apps.
              </p>
            </div>

            <div className="z-10 pt-4 border-t border-white/10">
              <a
                href="/ar"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                Launch AR Camera <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          {/* Card 3: Konark Solar Sundial */}
          <div className="relative group col-span-1 rounded-3xl overflow-hidden glass-card border border-white/10 p-8 flex flex-col justify-between shadow-xl">
            <div className="flex items-start justify-between z-10">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                <Sun className="w-6 h-6" />
              </div>
              <Badge variant="outline" className="border-amber-500/30 text-amber-500 bg-amber-500/10 text-xs">
                Astronomy Sim
              </Badge>
            </div>

            <div className="z-10 space-y-2">
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                Konark Sundial Simulator
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Experience the 13th-century astronomical marvel. Real-time solar azimuth and shadow physics decode exact time to the minute from the Sun Temple's spoke wheels.
              </p>
            </div>

            <div className="z-10 pt-4 border-t border-white/10">
              <a
                href="/sundial"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                Calculate Solar Time <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          {/* Card 4: Sight-Sound Geofenced Narration (Large Span 2) */}
          <div className="relative group col-span-1 md:col-span-2 rounded-3xl overflow-hidden glass-card border border-white/10 p-8 flex flex-col justify-between shadow-2xl">
            <BorderBeam size={100} duration={9} colorFrom="#10b981" colorTo="#06b6d4" />

            <div className="flex items-start justify-between z-10">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                <Volume2 className="w-6 h-6" />
              </div>
              <Badge variant="outline" className="border-emerald-500/40 text-emerald-500 bg-emerald-500/10 text-xs">
                Spatial Audio & Geofencing
              </Badge>
            </div>

            <div className="z-10 space-y-3 my-auto">
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Context-Aware Audio Walk
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed">
                As your GPS crosses the threshold of ancient sites, hands-free spatial audio narrations automatically trigger with historical accounts, architectural breakdown, and ambient medieval soundscapes.
              </p>
            </div>

            <div className="z-10 flex items-center justify-between pt-4 border-t border-white/10">
              <span className="text-xs font-mono text-muted-foreground">
                Offline-First PWA • Low Battery Consumption
              </span>
              <a
                href="/flash"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-amber-400 transition-colors"
              >
                Explore Flashcards <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </BentoGrid>
      </div>
    </section>
  );
};

export default BentoFeatures;