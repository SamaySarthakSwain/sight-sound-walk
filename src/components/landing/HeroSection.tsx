import { motion } from "framer-motion";
import { ChevronDown, Volume2 } from "lucide-react";
import heroCinematic from "@/assets/hero-cinematic.jpg";
import CitySearchBox from "@/components/CitySearchBox";

const HeroSection = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroCinematic}
          alt="Ancient monument at golden hour"
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="w-full h-full object-cover"
        />
        {/* Light mode overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent dark:from-[#0A0A0C] dark:via-[#0A0A0C]/60 dark:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-transparent dark:from-[#0A0A0C]/80 dark:via-transparent dark:to-transparent" />
        {/* Film grain effect */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }}
        />
      </div>

      {/* Sound toggle hint */}
      <motion.div
        className="absolute top-24 right-8 z-20 flex items-center gap-2 text-white/50 dark:text-foreground/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <span className="text-xs font-mono tracking-widest uppercase hidden md:inline">Sound On</span>
        <Volume2 className="w-4 h-4" />
      </motion.div>

      {/* Main Content - Bottom Left aligned */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end pb-16 md:pb-24">
        <div className="container mx-auto px-6 md:px-12">
          {/* City selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-6"
          >
            <CitySearchBox />
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] max-w-5xl"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-foreground drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]">EXPLORE</span>
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient-text bg-[length:200%_200%] drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
              WITHOUT
            </span>
            <br />
            <span className="text-foreground drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]">LIMITS</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="mt-6 text-base md:text-lg text-foreground/70 dark:text-foreground/50 max-w-xl font-light tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.2)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            GPS-guided narration through India's most magnificent monuments.
            Every step reveals a story waiting to be heard.
          </motion.p>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-foreground/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <span className="text-[10px] font-mono tracking-[0.4em] uppercase">Scroll</span>
        <ChevronDown className="w-4 h-4 animate-[scroll-bounce_2s_ease-in-out_infinite]" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
