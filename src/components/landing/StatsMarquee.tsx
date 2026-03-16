import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  { value: "50+", label: "Heritage Sites" },
  { value: "GPS", label: "Guided Tours" },
  { value: "7+", label: "Cities Covered" },
  { value: "24/7", label: "AI Assistant" },
  { value: "AR", label: "3D Experience" },
  { value: "∞", label: "Stories to Tell" },
];

const StatsMarquee = () => {
  const marqueeItems = [...stats, ...stats, ...stats];
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-40px" });

  return (
    <section className="py-16 md:py-24 bg-muted/30 dark:bg-background relative overflow-hidden border-y border-border">
      {/* Section label */}
      <motion.div
        ref={headerRef}
        className="container mx-auto px-6 md:px-12 mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={headerInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="text-xs font-mono tracking-[0.3em] uppercase text-primary/70 mb-4 block">
          Platform at a Glance
        </span>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
          Numbers That <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Speak</span>
        </h2>
      </motion.div>

      {/* Scrolling marquee */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-muted/30 dark:from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-muted/30 dark:from-background to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex gap-8 md:gap-16"
          animate={{ x: [0, -50 * stats.length * 4] }}
          transition={{
            x: { repeat: Infinity, duration: 30, ease: "linear" },
          }}
          style={{ width: "fit-content" }}
        >
          {marqueeItems.map((stat, i) => (
            <motion.div
              key={i}
              className="flex-shrink-0 flex items-center gap-4 px-6 py-4 group"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-4xl md:text-6xl font-black text-primary tracking-tighter group-hover:drop-shadow-[0_0_20px_hsl(var(--primary)/0.4)] transition-all duration-300">
                {stat.value}
              </span>
              <span className="text-xs font-mono tracking-[0.2em] uppercase text-muted-foreground whitespace-nowrap">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StatsMarquee;
