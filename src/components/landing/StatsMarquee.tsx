import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";

const stats = [
  { value: "50+", label: "Heritage Sites" },
  { value: "GPS", label: "Guided Tours" },
  { value: "7+", label: "Cities Covered" },
  { value: "24/7", label: "AI Assistant" },
  { value: "AR", label: "3D Experience" },
  { value: "∞", label: "Stories to Tell" },
];

const StatsMarquee = () => {
  const marqueeItems = [...stats, ...stats]; // Double for seamless loop

  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden border-y border-foreground/5">
      {/* Section label */}
      <ScrollReveal>
        <div className="container mx-auto px-6 md:px-12 mb-12">
          <span className="text-xs font-mono tracking-[0.3em] uppercase text-primary/70 mb-4 block">
            Platform at a Glance
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
            Numbers That <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Speak</span>
          </h2>
        </div>
      </ScrollReveal>

      {/* Scrolling marquee */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex gap-8 md:gap-16"
          animate={{ x: [0, -50 * stats.length * 4] }}
          transition={{
            x: { repeat: Infinity, duration: 30, ease: "linear" },
          }}
          style={{ width: "fit-content" }}
        >
          {marqueeItems.map((stat, i) => (
            <div
              key={i}
              className="flex-shrink-0 flex items-center gap-4 px-6 py-4"
            >
              <span className="text-4xl md:text-6xl font-black text-primary tracking-tighter">
                {stat.value}
              </span>
              <span className="text-xs font-mono tracking-[0.2em] uppercase text-foreground/40 whitespace-nowrap">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StatsMarquee;
