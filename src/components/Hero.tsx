import { Button } from "@/components/ui/button";
import { MapPin, Volume2, ChevronDown } from "lucide-react";
import heroImage from "@/assets/hero-monument.jpg";
import CitySearchBox from "./CitySearchBox";
import ScrollReveal from "./ScrollReveal";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative min-h-[80vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden pt-14 md:pt-16 starfield">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt=""
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover dark:opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background/95 dark:from-background/60 dark:via-background/90 dark:to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-0 text-center">
        <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
          {/* City Search Box */}
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <CitySearchBox />
          </motion.div>
          
          <motion.div 
            className="inline-flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
            <span className="text-xs md:text-sm font-medium text-foreground font-mono tracking-wider uppercase">Educational Tourism Experience</span>
          </motion.div>
          
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="bg-gradient-hero bg-clip-text text-transparent animate-gradient-text bg-[length:200%_200%]">
              Lets Explore
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-base sm:text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            Transform every journey into an educational adventure. Discover historical monuments 
            with GPS-guided narration as you explore.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center pt-2 md:pt-4 px-4 sm:px-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
          >
            <Button 
              size="lg"
              className="bg-gradient-hero hover:shadow-glow transition-all duration-500 text-base md:text-lg px-6 md:px-8 h-11 md:h-12 hover:scale-105 active:scale-95"
            >
              <MapPin className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Start Exploring
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-primary/30 hover:border-primary/60 hover:bg-primary/5 transition-all duration-500 text-base md:text-lg px-6 md:px-8 h-11 md:h-12 hover:scale-105 active:scale-95"
            >
              <Volume2 className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              How It Works
            </Button>
          </motion.div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6 pt-8 md:pt-12 px-2 sm:px-0">
            {[
              { title: "GPS Notifications", desc: "Get alerts as you approach monuments" },
              { title: "Audio Narration", desc: "Listen to historical facts on-the-go" },
              { title: "Written Summaries", desc: "Read detailed information anytime" },
            ].map((feature, i) => (
              <ScrollReveal key={i} delay={i * 150}>
                <div className="glow-card p-4 md:p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 shadow-soft hover:shadow-glow transition-all duration-500 hover:-translate-y-1">
                  <h3 className="font-semibold text-base md:text-lg mb-1 md:mb-2">{feature.title}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="mt-12 flex flex-col items-center gap-2 text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <span className="text-xs font-mono tracking-[0.3em] uppercase">Scroll</span>
          <ChevronDown className="w-4 h-4 animate-[scroll-bounce_2s_ease-in-out_infinite]" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
