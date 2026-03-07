import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import { MapPin, Headphones, Compass, Camera, Sparkles } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: MapPin,
    title: "Choose Your City",
    desc: "Select from 7+ cities across Odisha and India to start your journey",
  },
  {
    num: "02",
    icon: Compass,
    title: "GPS Detection",
    desc: "Our system detects nearby monuments and heritage sites as you move",
  },
  {
    num: "03",
    icon: Headphones,
    title: "Audio Narration",
    desc: "Immersive voice-guided stories triggered automatically at each location",
  },
  {
    num: "04",
    icon: Camera,
    title: "AR Experience",
    desc: "View 3D models and interactive overlays on historical monuments",
  },
  {
    num: "05",
    icon: Sparkles,
    title: "AI Travel Guide",
    desc: "Get personalized recommendations, plan routes and discover hidden gems",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 md:py-32 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        {/* Section Header */}
        <ScrollReveal>
          <div className="mb-16 md:mb-24">
            <span className="text-xs font-mono tracking-[0.3em] uppercase text-primary/70 mb-4 block">
              Behind the Scenes
            </span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-foreground">
              How We Create{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Magic
              </span>
            </h2>
            <p className="mt-4 text-muted-foreground text-sm md:text-base max-w-lg">
              Watch our process unfold step by step
            </p>
          </div>
        </ScrollReveal>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-border to-transparent hidden md:block" />
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-border to-transparent md:hidden" />

          {/* Start marker */}
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-12 md:justify-center">
              <div className="w-4 h-4 rounded-full bg-primary shadow-[0_0_20px_hsl(var(--primary)/0.4)] relative z-10" />
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-primary">Start</span>
            </div>
          </ScrollReveal>

          <div className="space-y-12 md:space-y-20">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <ScrollReveal key={i} delay={i * 100}>
                  <div className={`flex items-start gap-6 md:gap-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    {/* Content */}
                    <div className={`flex-1 ${i % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                      <div className={`rounded-2xl border border-border bg-card p-6 md:p-8 group hover:border-primary/30 hover:shadow-lg transition-all duration-500 ${i % 2 === 0 ? 'md:ml-auto md:mr-0' : ''} max-w-lg`}>
                        <div className={`flex items-center gap-4 mb-4 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                          <span className="text-3xl md:text-4xl font-black text-primary/20 group-hover:text-primary/40 transition-colors">
                            {step.num}
                          </span>
                          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-500">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">{step.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                      </div>
                    </div>

                    {/* Center dot (desktop) */}
                    <div className="hidden md:flex items-start justify-center pt-8">
                      <div className="w-3 h-3 rounded-full bg-primary/60 border-2 border-background shadow-[0_0_12px_hsl(var(--primary)/0.3)] relative z-10" />
                    </div>

                    {/* Spacer for alternating layout */}
                    <div className="hidden md:block flex-1" />
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          {/* End marker */}
          <ScrollReveal>
            <div className="flex items-center gap-3 mt-12 md:justify-center">
              <div className="w-4 h-4 rounded-full bg-primary shadow-[0_0_20px_hsl(var(--primary)/0.4)] relative z-10" />
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-primary">End</span>
            </div>
          </ScrollReveal>
        </div>

        {/* Bottom stats */}
        <ScrollReveal>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-16 md:mt-24">
            {[
              { value: "Real-time", label: "GPS Tracking" },
              { value: "Multi-lang", label: "Audio Support" },
              { value: "Offline", label: "Available" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <span className="text-lg md:text-xl font-bold text-primary">{stat.value}</span>
                <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default HowItWorks;
