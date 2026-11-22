import React, { useState } from "react";
import { OrbitingCircles } from "@/components/magicui/orbiting-circles";
import { 
  Cpu, Eye, Headphones, Navigation, Sun, Box, 
  MessageSquare, Sparkles, Activity, ShieldCheck, ArrowRight, Layers
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BorderBeam } from "@/components/magicui/border-beam";
import SpotlightCard from "@/components/ui/SpotlightCard";
import ScrollReveal from "@/components/ScrollReveal";

interface TechNode {
  id: string;
  name: string;
  category: string;
  icon: React.ElementType;
  color: string;
  summary: string;
  specs: { label: string; value: string }[];
  route: string;
  ctaText: string;
}

const TECH_NODES: TechNode[] = [
  {
    id: "yolo",
    name: "YOLOv8 Edge Crowd Detection",
    category: "Computer Vision",
    icon: Eye,
    color: "#ef4444",
    summary: "Ultra-compact neural network tracking crowd density, queue build-ups, and stampede risk across high-traffic sanctums in real time.",
    specs: [
      { label: "Architecture", value: "YOLOv8n TensorRT / WebGL" },
      { label: "Inference Latency", value: "< 42ms on Edge" },
      { label: "Detection mAP", value: "0.894 (COCO Person Class)" },
      { label: "Privacy Protocol", value: "100% Zero Facial Recording" },
    ],
    route: "/crowd",
    ctaText: "Launch Crowd Vision",
  },
  {
    id: "spatial_audio",
    name: "Spatial Binaural Audio Mixer",
    category: "Acoustic Computing",
    icon: Headphones,
    color: "#f59e0b",
    summary: "Context-aware binaural sound synthesis simulating temple acoustics, stone reflections, ritual bells, and ancient maritime breezes.",
    specs: [
      { label: "Audio Engine", value: "Web Audio API Spatial Panner" },
      { label: "Channels", value: "Dual Binaural Head-Related Transfer" },
      { label: "Acoustic Presets", value: "3 Epochs (Ancient, Medieval, Modern)" },
      { label: "Bandwidth", value: "Synthesized Offline (0 kB Stream)" },
    ],
    route: "/soundscape",
    ctaText: "Open Soundscape Mixer",
  },
  {
    id: "geofence",
    name: "Micro-Perimeter Geofencing",
    category: "Geolocation Intelligence",
    icon: Navigation,
    color: "#10b981",
    summary: "Sub-50ms haversine circular trigger boundaries that seamlessly cue narrations the millisecond visitors arrive at historical landmarks.",
    specs: [
      { label: "Boundary Radius", value: "15m - 50m Adaptive Precision" },
      { label: "Calculation Engine", value: "Spherical Haversine Algorithm" },
      { label: "Battery Impact", value: "< 1.5% per Tour Hour" },
      { label: "Offline Cache", value: "Pre-cached in Local IndexedDB" },
    ],
    route: "/explore",
    ctaText: "Explore Geofenced Map",
  },
  {
    id: "sundial",
    name: "Astronomical Solar Calculator",
    category: "Solar Physics Simulation",
    icon: Sun,
    color: "#eab308",
    summary: "Mathematically recreates the 13th-century Konark Sun Temple chariot wheel shadow dial using real-time astronomical solar coordinates.",
    specs: [
      { label: "Calculation", value: "Spencer Solar Declination Equation" },
      { label: "Time Resolution", value: "Exact to 1.5 Minutes of Solar Time" },
      { label: "Shadow Rendering", value: "3D Dynamic Ray Vector Projection" },
      { label: "Spoke Decoding", value: "8 Major Prahara & 8 Minor Spokes" },
    ],
    route: "/sundial",
    ctaText: "Run Solar Dial Sim",
  },
  {
    id: "webxr",
    name: "WebXR 3D Photogrammetry",
    category: "Augmented Reality",
    icon: Box,
    color: "#3b82f6",
    summary: "Full 6-DOF WebGL & WebXR 3D spatial models of Konark, Lingaraj, and Dhauli accessible directly inside the mobile browser.",
    specs: [
      { label: "Renderer", value: "Three.js / WebGL 2.0 PBR Shaders" },
      { label: "Polygon Budget", value: "Optimized LOD < 45k Triangles" },
      { label: "AR Tracking", value: "WebXR Device API Native Plane Anchor" },
      { label: "Compatibility", value: "iOS Safari & Android Chrome" },
    ],
    route: "/ar",
    ctaText: "Enter 3D WebXR View",
  },
  {
    id: "cultural_llm",
    name: "Cultural Knowledge LLM Assistant",
    category: "Conversational AI",
    icon: MessageSquare,
    color: "#a855f7",
    summary: "Contextual RAG-backed conversational guide capable of narrating temple inscriptions, dynasty timelines, and local folklore in 10+ languages.",
    specs: [
      { label: "Grounding", value: "Verified Archaeological Survey Archives" },
      { label: "Language Support", value: "Odia, Hindi, English, Bengali & More" },
      { label: "Response Latency", value: "Streaming Real-Time Tokens" },
      { label: "Offline Fallback", value: "Rule-Based Offline Encyclopedia" },
    ],
    route: "/assistant",
    ctaText: "Ask AI Guide",
  },
];

export const NeuralCoreShowcase = () => {
  const [activeNode, setActiveNode] = useState<TechNode>(TECH_NODES[0]);

  const ActiveIcon = activeNode.icon;

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-background border-t border-white/10 dark:border-white/5">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <ScrollReveal>
          <div className="text-center mb-16 space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              <Cpu className="w-3.5 h-3.5" />
              <span>Full-Stack Spatial Intelligence</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
              The Multimodal{" "}
              <span className="bg-gradient-to-r from-primary via-amber-500 to-orange-500 bg-clip-text text-transparent">
                Heritage Architecture
              </span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
              Explore how our neural network, spatial audio panner, solar physics simulator, and WebXR render engine harmonize into a unified real-time computing engine.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Orbital Visualization Engine (7 cols) */}
          <div className="lg:col-span-7 flex items-center justify-center relative min-h-[440px] sm:min-h-[500px]">
            <div className="relative flex h-[440px] sm:h-[500px] w-full max-w-[500px] flex-col items-center justify-center overflow-hidden rounded-3xl glass-card border border-white/10 p-4 shadow-2xl">
              <BorderBeam size={100} duration={8} colorFrom="#f59e0b" colorTo="#3b82f6" />

              {/* Central AI Brain Core */}
              <div className="relative z-10 flex flex-col items-center justify-center w-24 h-24 rounded-full bg-gradient-to-tr from-primary via-amber-500 to-orange-500 p-1 shadow-[0_0_40px_hsl(var(--primary)/0.5)] cursor-pointer">
                <div className="w-full h-full rounded-full bg-background flex flex-col items-center justify-center text-center p-2">
                  <Cpu className="w-7 h-7 text-primary animate-pulse" />
                  <span className="text-[9px] font-mono font-bold text-foreground mt-0.5 leading-none">
                    AI CORE
                  </span>
                </div>
              </div>

              {/* Inner Orbit (Radius 120px) */}
              <OrbitingCircles radius={120} duration={25} iconSize={44}>
                <button
                  onClick={() => setActiveNode(TECH_NODES[0])}
                  className={`p-2.5 rounded-full transition-transform hover:scale-125 ${
                    activeNode.id === "yolo" ? "ring-2 ring-red-500 bg-red-500/20" : ""
                  }`}
                  title="YOLOv8 Edge Vision"
                >
                  <Eye className="w-5 h-5 text-red-500" />
                </button>
                <button
                  onClick={() => setActiveNode(TECH_NODES[1])}
                  className={`p-2.5 rounded-full transition-transform hover:scale-125 ${
                    activeNode.id === "spatial_audio" ? "ring-2 ring-amber-500 bg-amber-500/20" : ""
                  }`}
                  title="Spatial Audio Engine"
                >
                  <Headphones className="w-5 h-5 text-amber-500" />
                </button>
                <button
                  onClick={() => setActiveNode(TECH_NODES[2])}
                  className={`p-2.5 rounded-full transition-transform hover:scale-125 ${
                    activeNode.id === "geofence" ? "ring-2 ring-emerald-500 bg-emerald-500/20" : ""
                  }`}
                  title="Micro-Perimeter Geofencing"
                >
                  <Navigation className="w-5 h-5 text-emerald-500" />
                </button>
              </OrbitingCircles>

              {/* Outer Orbit (Radius 195px) */}
              <OrbitingCircles radius={195} duration={38} reverse iconSize={44}>
                <button
                  onClick={() => setActiveNode(TECH_NODES[3])}
                  className={`p-2.5 rounded-full transition-transform hover:scale-125 ${
                    activeNode.id === "sundial" ? "ring-2 ring-yellow-500 bg-yellow-500/20" : ""
                  }`}
                  title="Astronomical Solar Calculator"
                >
                  <Sun className="w-5 h-5 text-yellow-500" />
                </button>
                <button
                  onClick={() => setActiveNode(TECH_NODES[4])}
                  className={`p-2.5 rounded-full transition-transform hover:scale-125 ${
                    activeNode.id === "webxr" ? "ring-2 ring-blue-500 bg-blue-500/20" : ""
                  }`}
                  title="WebXR 3D Photogrammetry"
                >
                  <Box className="w-5 h-5 text-blue-500" />
                </button>
                <button
                  onClick={() => setActiveNode(TECH_NODES[5])}
                  className={`p-2.5 rounded-full transition-transform hover:scale-125 ${
                    activeNode.id === "cultural_llm" ? "ring-2 ring-purple-500 bg-purple-500/20" : ""
                  }`}
                  title="Cultural Knowledge LLM"
                >
                  <MessageSquare className="w-5 h-5 text-purple-500" />
                </button>
              </OrbitingCircles>
            </div>
          </div>

          {/* Detailed Inspector Panel (5 cols) */}
          <div className="lg:col-span-5">
            <SpotlightCard
              spotlightColor="rgba(245, 158, 11, 0.15)"
              className="p-6 md:p-8 rounded-3xl border border-white/10 dark:border-white/5 shadow-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline" className="font-mono text-xs px-3 py-1 rounded-full border-primary/30 text-primary bg-primary/10">
                    {activeNode.category}
                  </Badge>
                  <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-emerald-500" /> Active Pipeline
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-inner"
                    style={{ backgroundColor: `${activeNode.color}15`, borderColor: `${activeNode.color}30` }}
                  >
                    <ActiveIcon className="w-6 h-6" style={{ color: activeNode.color }} />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-black text-foreground">
                      {activeNode.name}
                    </h3>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  {activeNode.summary}
                </p>

                {/* Technical Specifications Matrix */}
                <div className="space-y-2 mb-8">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-2">
                    Technical Specifications:
                  </p>
                  {activeNode.specs.map((spec, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs"
                    >
                      <span className="text-muted-foreground font-medium">{spec.label}</span>
                      <span className="font-mono font-bold text-foreground">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <a href={activeNode.route} className="w-full">
                <Button className="w-full h-12 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/25 gap-2">
                  <span>{activeNode.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
            </SpotlightCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NeuralCoreShowcase;