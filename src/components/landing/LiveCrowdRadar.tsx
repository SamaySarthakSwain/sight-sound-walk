import React, { useState, useEffect } from "react";
import { 
  Users, ShieldAlert, CheckCircle2, TrendingUp, 
  MapPin, Activity, ArrowRight, RefreshCw, AlertTriangle, Eye, Sparkles
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BorderBeam } from "@/components/magicui/border-beam";
import SpotlightCard from "@/components/ui/SpotlightCard";
import ScrollReveal from "@/components/ScrollReveal";

interface ZoneData {
  id: string;
  name: string;
  location: string;
  capacity: number; // 0-100%
  visitors: number;
  status: "optimal" | "moderate" | "congested";
  forecast: string;
  trend: "rising" | "stable" | "falling";
}

const ZONES: ZoneData[] = [
  {
    id: "konark",
    name: "Konark Sun Temple",
    location: "Puri District",
    capacity: 42,
    visitors: 320,
    status: "optimal",
    forecast: "Low surge expected for next 2 hours",
    trend: "stable",
  },
  {
    id: "puri",
    name: "Jagannath Temple Perimeter",
    location: "Puri Heritage Corridor",
    capacity: 76,
    visitors: 1450,
    status: "moderate",
    forecast: "Peak afternoon aarti surge active",
    trend: "rising",
  },
  {
    id: "lingaraj",
    name: "Lingaraj Temple",
    location: "Old Town, Bhubaneswar",
    capacity: 35,
    visitors: 240,
    status: "optimal",
    forecast: "Ideal visiting window right now",
    trend: "falling",
  },
  {
    id: "dhauli",
    name: "Dhauli Shanti Stupa",
    location: "Dhauli Hills, Daya River",
    capacity: 22,
    visitors: 95,
    status: "optimal",
    forecast: "Tranquil & uncrowded conditions",
    trend: "stable",
  },
];

export const LiveCrowdRadar = () => {
  const [zones, setZones] = useState<ZoneData[]>(ZONES);
  const [selectedZone, setSelectedZone] = useState<ZoneData>(ZONES[0]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState("Just now");

  // Minor simulated real-time fluctuation for telemetry dynamism
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setZones((prev) =>
        prev.map((z) => {
          const delta = Math.floor(Math.random() * 7) - 3;
          const newCap = Math.max(10, Math.min(95, z.capacity + delta));
          return {
            ...z,
            capacity: newCap,
            visitors: Math.max(50, z.visitors + delta * 8),
            status: newCap > 75 ? "congested" : newCap > 60 ? "moderate" : "optimal",
          };
        })
      );
      setIsRefreshing(false);
      setLastUpdate("Updated 1s ago");
    }, 600);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, 25000);
    return () => clearInterval(interval);
  }, []);

  const overallSafetyIndex = Math.round(
    100 - (zones.reduce((acc, z) => acc + z.capacity, 0) / zones.length) * 0.4
  );

  return (
    <section className="py-20 md:py-28 bg-background relative overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold tracking-wider uppercase backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span>YOLOv8 Edge Vision Sentinel</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
                Real-Time{" "}
                <span className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">
                  Crowd Density & Radar
                </span>
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed">
                Continuous computer vision surveillance safeguards tourists and ancient stone sanctums by actively mapping foot traffic, preventing overcrowding, and automating route recommendations.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                className="h-10 px-4 rounded-full glass-card border-white/10 hover:border-primary/40 gap-2 text-xs font-medium"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
                <span>Sync Radar</span>
              </Button>
              <a href="/crowd">
                <Button className="h-10 px-5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs gap-1.5 shadow-lg shadow-primary/20">
                  Full Dashboard
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </a>
            </div>
          </div>
        </ScrollReveal>

        {/* The Live Radar Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Interactive Radar Screen (7 cols) */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl glass-card border border-white/10 dark:border-white/5 p-6 md:p-8 overflow-hidden shadow-2xl h-full flex flex-col justify-between">
              <BorderBeam size={100} duration={8} colorFrom="#ef4444" colorTo="#f59e0b" />

              {/* Header HUD */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-red-500/20 text-red-500">
                    <Activity className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">Spatial Perimeter Radar</h3>
                    <p className="text-[11px] font-mono text-muted-foreground">{lastUpdate} • 4 Sentinel Nodes</p>
                  </div>
                </div>

                <Badge variant="outline" className="border-emerald-500/30 text-emerald-500 bg-emerald-500/10 font-mono text-xs px-2.5 py-1">
                  Safety Index: {overallSafetyIndex}/100
                </Badge>
              </div>

              {/* Radar Visual Display Container */}
              <div className="relative my-8 py-10 flex items-center justify-center overflow-hidden rounded-2xl bg-black/40 border border-white/5">
                {/* Radar Grid Circles */}
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-primary/20 flex items-center justify-center">
                  <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-full border border-primary/15 flex items-center justify-center" />
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border border-primary/20 flex items-center justify-center" />
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-primary/30 flex items-center justify-center" />
                  
                  {/* Crosshairs */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-full h-[1px] bg-primary/20" />
                    <div className="absolute h-full w-[1px] bg-primary/20" />
                  </div>

                  {/* Rotating Radar Sweep Beam */}
                  <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                    <div className="w-1/2 h-1/2 origin-bottom-right animate-[spin_4s_linear_infinite] bg-gradient-to-br from-red-500/30 via-amber-500/10 to-transparent" />
                  </div>

                  {/* Central Radar Station Core */}
                  <div className="relative z-10 w-4 h-4 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary))] flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                  </div>

                  {/* Zone Blips on Radar */}
                  {/* Konark (Top Right) */}
                  <button
                    onClick={() => setSelectedZone(zones[0])}
                    className={`absolute top-12 right-14 sm:top-14 sm:right-16 z-20 group flex items-center gap-1.5 transition-transform hover:scale-125 ${
                      selectedZone.id === "konark" ? "scale-125 ring-2 ring-primary rounded-full p-1" : ""
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse" />
                    <span className="text-[10px] font-mono font-bold text-white bg-black/80 px-1.5 py-0.5 rounded backdrop-blur-sm border border-white/10 opacity-80 group-hover:opacity-100">
                      Konark
                    </span>
                  </button>

                  {/* Puri (Bottom Right) */}
                  <button
                    onClick={() => setSelectedZone(zones[1])}
                    className={`absolute bottom-10 right-10 sm:bottom-12 sm:right-14 z-20 group flex items-center gap-1.5 transition-transform hover:scale-125 ${
                      selectedZone.id === "puri" ? "scale-125 ring-2 ring-amber-500 rounded-full p-1" : ""
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-amber-500 shadow-[0_0_12px_#f59e0b] animate-ping" />
                    <span className="text-[10px] font-mono font-bold text-white bg-black/80 px-1.5 py-0.5 rounded backdrop-blur-sm border border-white/10 opacity-80 group-hover:opacity-100">
                      Puri
                    </span>
                  </button>

                  {/* Lingaraj (Left Center) */}
                  <button
                    onClick={() => setSelectedZone(zones[2])}
                    className={`absolute top-1/2 left-8 sm:left-12 -translate-y-1/2 z-20 group flex items-center gap-1.5 transition-transform hover:scale-125 ${
                      selectedZone.id === "lingaraj" ? "scale-125 ring-2 ring-primary rounded-full p-1" : ""
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399] animate-pulse" />
                    <span className="text-[10px] font-mono font-bold text-white bg-black/80 px-1.5 py-0.5 rounded backdrop-blur-sm border border-white/10 opacity-80 group-hover:opacity-100">
                      Lingaraj
                    </span>
                  </button>

                  {/* Dhauli (Bottom Left) */}
                  <button
                    onClick={() => setSelectedZone(zones[3])}
                    className={`absolute bottom-12 left-14 sm:bottom-16 sm:left-18 z-20 group flex items-center gap-1.5 transition-transform hover:scale-125 ${
                      selectedZone.id === "dhauli" ? "scale-125 ring-2 ring-primary rounded-full p-1" : ""
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] animate-pulse" />
                    <span className="text-[10px] font-mono font-bold text-white bg-black/80 px-1.5 py-0.5 rounded backdrop-blur-sm border border-white/10 opacity-80 group-hover:opacity-100">
                      Dhauli
                    </span>
                  </button>
                </div>
              </div>

              {/* Bottom Radar Metrics Strip */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10 text-center">
                <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-[10px] font-mono uppercase text-muted-foreground block">Active Tracked</span>
                  <span className="text-lg font-black text-foreground">
                    {zones.reduce((acc, z) => acc + z.visitors, 0).toLocaleString()}
                  </span>
                </div>
                <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-[10px] font-mono uppercase text-muted-foreground block">Congested Hubs</span>
                  <span className="text-lg font-black text-amber-500">
                    {zones.filter((z) => z.status !== "optimal").length} of {zones.length}
                  </span>
                </div>
                <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-[10px] font-mono uppercase text-muted-foreground block">Surge Protocol</span>
                  <span className="text-lg font-black text-emerald-400">Normal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Active Zone Telemetry & Details (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <SpotlightCard
              spotlightColor="rgba(239, 68, 68, 0.15)"
              className="p-6 rounded-3xl border border-white/10 dark:border-white/5 h-full flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono tracking-widest uppercase text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    {selectedZone.location}
                  </span>
                  <Badge
                    variant="outline"
                    className={`font-mono text-xs px-2.5 py-0.5 rounded-full ${
                      selectedZone.status === "congested"
                        ? "border-red-500/40 text-red-400 bg-red-500/10"
                        : selectedZone.status === "moderate"
                        ? "border-amber-500/40 text-amber-400 bg-amber-500/10"
                        : "border-emerald-500/40 text-emerald-400 bg-emerald-500/10"
                    }`}
                  >
                    {selectedZone.status === "congested"
                      ? "High Density"
                      : selectedZone.status === "moderate"
                      ? "Moderate Surge"
                      : "Optimal Flow"}
                  </Badge>
                </div>

                <h3 className="text-2xl font-black text-foreground mb-1">{selectedZone.name}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-6">
                  {selectedZone.forecast}
                </p>

                {/* Capacity Bar */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-muted-foreground">Real-time Density Load</span>
                    <span className="font-bold text-foreground">{selectedZone.capacity}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-muted/40 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        selectedZone.capacity > 75
                          ? "bg-gradient-to-r from-orange-500 to-red-500"
                          : selectedZone.capacity > 50
                          ? "bg-gradient-to-r from-primary to-amber-500"
                          : "bg-gradient-to-r from-emerald-500 to-teal-400"
                      }`}
                      style={{ width: `${selectedZone.capacity}%` }}
                    />
                  </div>
                </div>

                {/* Micro Stats */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase block mb-1">
                      Current Explorers
                    </span>
                    <span className="text-xl font-black text-primary">
                      {selectedZone.visitors.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase block mb-1">
                      Traffic Trend
                    </span>
                    <span className="text-sm font-bold text-foreground flex items-center gap-1.5 mt-1 capitalize">
                      <TrendingUp className="w-4 h-4 text-amber-500" />
                      {selectedZone.trend}
                    </span>
                  </div>
                </div>
              </div>

              {/* Zone Selector Buttons */}
              <div>
                <p className="text-[11px] font-mono uppercase text-muted-foreground mb-2">Switch Sentinel Node:</p>
                <div className="grid grid-cols-2 gap-2">
                  {zones.map((z) => (
                    <button
                      key={z.id}
                      onClick={() => setSelectedZone(z)}
                      className={`px-3 py-2 rounded-xl text-left text-xs font-semibold transition-all border ${
                        selectedZone.id === z.id
                          ? "bg-primary text-primary-foreground border-primary shadow-md"
                          : "bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground border-white/5"
                      }`}
                    >
                      <p className="truncate">{z.name.split(" ")[0]}</p>
                      <span className="text-[10px] opacity-75 font-mono">{z.capacity}% capacity</span>
                    </button>
                  ))}
                </div>
              </div>
            </SpotlightCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveCrowdRadar;