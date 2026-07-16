import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Volume2 } from "lucide-react";
import heroCinematic from "@/assets/hero-cinematic.jpg";
import CitySearchBox from "@/components/CitySearchBox";
import { useRef } from "react";

const letterVariants = {
  hidden: { opacity: 0, y: 80, rotateX: -90 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      delay: 0.1 + i * 0.03,
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

const AnimatedWord = ({ text, className, startIndex = 0 }: { text: string; className: string; startIndex?: number }) => (
  <span className={`inline-flex overflow-hidden ${className}`} style={{ perspective: "600px" }}>
    {text.split("").map((char, i) => (
      <motion.span
        key={i}
        custom={startIndex + i}
        variants={letterVariants}
        initial="hidden"
        animate="visible"
        className="inline-block"
        style={{ transformOrigin: "bottom" }}
      >
        {char}
      </motion.span>
    ))}
  </span>
);

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, -60]);

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div className="absolute inset-0 z-0" style={{ y: imageY }}>
        <img
          src={heroCinematic}
          alt="Ancient monument at golden hour"
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="w-full h-[120%] object-cover"
        />
        {/* Light mode overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent dark:from-[#0A0A0C] dark:via-[#0A0A0C]/60 dark:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-transparent dark:from-[#0A0A0C]/80 dark:via-transparent dark:to-transparent" />
        {/* Film grain effect */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }}
        />
      </motion.div>

      {/* Ambient glow orbs */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none z-[1]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/3 w-64 h-64 rounded-full bg-accent/5 blur-[100px] pointer-events-none z-[1]"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Sound toggle hint */}
      <motion.div
        className="absolute top-24 right-8 z-20 flex items-center gap-2 text-white/50 dark:text-foreground/50"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.0, duration: 0.8 }}
      >
        <span className="text-xs font-mono tracking-widest uppercase hidden md:inline">Sound On</span>
        <Volume2 className="w-4 h-4" />
      </motion.div>

      {/* Main Content - Bottom Left aligned */}
      <motion.div
        className="absolute inset-0 z-10 flex flex-col justify-end pb-16 md:pb-24"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <div className="container mx-auto px-6 md:px-12">
          {/* City selector */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-6"
          >
            <CitySearchBox />
          </motion.div>

          {/* Main Heading with letter-by-letter animation */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] max-w-5xl">
            <AnimatedWord text="EXPLORE" className="text-foreground drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]" startIndex={0} />
            <br />
            <AnimatedWord
              text="WITHOUT"
              className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient-text bg-[length:200%_200%] drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]"
              startIndex={7}
            />
            <br />
            <AnimatedWord text="LIMITS" className="text-foreground drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]" startIndex={14} />
          </h1>

          {/* Subtitle */}
          <motion.p
            className="mt-6 text-base md:text-lg text-foreground/70 dark:text-foreground/50 max-w-xl font-light tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.2)]"
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            GPS-guided narration through India's most magnificent monuments.
            Every step reveals a story waiting to be heard.
          </motion.p>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-foreground/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <motion.span
          className="text-[10px] font-mono tracking-[0.4em] uppercase"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Scroll
        </motion.span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
