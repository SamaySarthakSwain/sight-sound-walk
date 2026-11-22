import React from "react";
import { Marquee } from "@/components/magicui/marquee";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { ShieldCheck, Activity, Users, Award, MapPin, Sparkles, Zap, Heart } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const STAT_ITEMS = [
  {
    icon: MapPin,
    value: 90,
    suffix: "+",
    label: "Living Heritage Sites",
    desc: "100% verified photography & coordinates",
  },
  {
    icon: Activity,
    value: 99.4,
    suffix: "%",
    decimalPlaces: 1,
    label: "Crowd Safety Accuracy",
    desc: "YOLOv8 edge neural-net vision",
  },
  {
    icon: Zap,
    value: 50,
    suffix: "ms",
    label: "Audio Geofence Trigger",
    desc: "Ultra-low latency perimeter alerts",
  },
  {
    icon: Users,
    value: 15420,
    suffix: "+",
    label: "Happy Heritage Explorers",
    desc: "Across Odisha, Konark & Puri",
  },
  {
    icon: ShieldCheck,
    value: 100,
    suffix: "%",
    label: "Real Photo Archive",
    desc: "Zero synthetic or placeholder images",
  },
  {
    icon: Heart,
    value: 4.9,
    suffix: "★",
    decimalPlaces: 1,
    label: "User Experience Rating",
    desc: "Rated by cultural heritage travelers",
  },
];

export const StatsMarquee = () => {
  return (
    <section className="py-14 md:py-20 relative overflow-hidden bg-background/60 border-y border-white/10 dark:border-white/5">
      <div className="container mx-auto px-4 mb-10 max-w-7xl">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Verified Metric Benchmarks</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                Engineering Impact in{" "}
                <span className="bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">
                  Real Numbers
                </span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md">
              Continuous telemetry monitoring, spatial sound distribution, and neural density prediction benchmarks.
            </p>
          </div>
        </ScrollReveal>
      </div>

      {/* Marquee with Fade Edges */}
      <div className="relative w-full overflow-hidden">
        {/* Left and Right Fade Mask */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-background to-transparent z-10" />

        <Marquee pauseOnHover className="[--duration:35s] py-2">
          {STAT_ITEMS.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-4 px-6 py-4 mx-3 rounded-2xl glass-card border border-white/10 dark:border-white/5 hover:border-primary/40 transition-all duration-300 shadow-md group min-w-[280px]"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-baseline gap-1 text-2xl md:text-3xl font-black text-foreground tracking-tight">
                    <NumberTicker
                      value={stat.value}
                      decimalPlaces={stat.decimalPlaces || 0}
                      className="text-primary font-black"
                    />
                    <span className="text-amber-500 font-bold">{stat.suffix}</span>
                  </div>
                  <p className="text-xs font-bold text-foreground tracking-wide mt-0.5">
                    {stat.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground line-clamp-1">
                    {stat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </Marquee>
      </div>
    </section>
  );
};

export default StatsMarquee;