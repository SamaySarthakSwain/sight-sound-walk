import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { MapPin, Headphones, Compass, Camera, Sparkles } from "lucide-react";

const steps = [
  { num: "01", icon: MapPin, title: "Choose Your City", desc: "Select from 7+ cities across Odisha and India to start your journey" },
  { num: "02", icon: Compass, title: "GPS Detection", desc: "Our system detects nearby monuments and heritage sites as you move" },
  { num: "03", icon: Headphones, title: "Audio Narration", desc: "Immersive voice-guided stories triggered automatically at each location" },
  { num: "04", icon: Camera, title: "AR Experience", desc: "View 3D models and interactive overlays on historical monuments" },
  { num: "05", icon: Sparkles, title: "AI Travel Guide", desc: "Get personalized recommendations, plan routes and discover hidden gems" },
];

const StepCard = ({ step, index }: { step: typeof steps[0]; index: number }) => {
  const Icon = step.icon;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1.5 1"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [30, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div
      ref={ref}
      className={`flex items-start gap-6 md:gap-0 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
      style={{ scale, rotateX, opacity, perspective: 1200, transformStyle: "preserve-3d" }}
    >
      {/* Content */}
      <div className={`flex-1 ${index % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
        <motion.div
          className={`rounded-2xl border border-border bg-card p-6 md:p-8 group hover:border-primary/30 transition-all duration-500 ${index % 2 === 0 ? 'md:ml-auto md:mr-0' : ''} max-w-lg relative overflow-hidden`}
          whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -12px hsl(var(--primary) / 0.15)" }}
          transition={{ duration: 0.4 }}
        >
          {/* Subtle gradient bg on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <div className={`flex items-center gap-4 mb-4 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} relative z-10`}>
            <motion.span
              className="text-3xl md:text-4xl font-black text-primary/20 group-hover:text-primary/40 transition-colors"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
            >
              {step.num}
            </motion.span>
            <motion.div
              className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-500"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Icon className="w-5 h-5 text-primary" />
            </motion.div>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2 relative z-10">{step.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed relative z-10">{step.desc}</p>
        </motion.div>
      </div>

      {/* Center dot (desktop) */}
      <div className="hidden md:flex items-start justify-center pt-8">
        <motion.div
          className="w-3 h-3 rounded-full bg-primary/60 border-2 border-background shadow-[0_0_12px_hsl(var(--primary)/0.3)] relative z-10"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
        />
      </div>

      {/* Spacer */}
      <div className="hidden md:block flex-1" />
    </motion.div>
  );
};

const HowItWorks = () => {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-40px" });

  return (
    <section className="py-24 md:py-32 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        {/* Section Header */}
        <motion.div
          ref={headerRef}
          className="mb-16 md:mb-24"
          initial={{ opacity: 0, y: 40 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="text-xs font-mono tracking-[0.3em] uppercase text-primary/70 mb-4 block">
            Behind the Scenes
          </span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight text-foreground">
            How We Create{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Magic</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-sm md:text-base max-w-lg">
            Watch our process unfold step by step
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-border to-transparent hidden md:block" />
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-border to-transparent md:hidden" />

          {/* Start marker */}
          <motion.div
            className="flex items-center gap-3 mb-12 md:justify-center"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <motion.div
              className="w-4 h-4 rounded-full bg-primary shadow-[0_0_20px_hsl(var(--primary)/0.4)] relative z-10"
              animate={{ boxShadow: ["0 0 20px hsl(var(--primary) / 0.2)", "0 0 30px hsl(var(--primary) / 0.5)", "0 0 20px hsl(var(--primary) / 0.2)"] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-primary">Start</span>
          </motion.div>

          <div className="space-y-12 md:space-y-20">
            {steps.map((step, i) => (
              <StepCard key={i} step={step} index={i} />
            ))}
          </div>

          {/* End marker */}
          <motion.div
            className="flex items-center gap-3 mt-12 md:justify-center"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <motion.div
              className="w-4 h-4 rounded-full bg-primary shadow-[0_0_20px_hsl(var(--primary)/0.4)] relative z-10"
              animate={{ boxShadow: ["0 0 20px hsl(var(--primary) / 0.2)", "0 0 30px hsl(var(--primary) / 0.5)", "0 0 20px hsl(var(--primary) / 0.2)"] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-primary">End</span>
          </motion.div>
        </div>

        {/* Bottom stats */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-16 md:mt-24">
          {[
            { value: "Real-time", label: "GPS Tracking" },
            { value: "Multi-lang", label: "Audio Support" },
            { value: "Offline", label: "Available" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
            >
              <span className="text-lg md:text-xl font-bold text-primary">{stat.value}</span>
              <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
