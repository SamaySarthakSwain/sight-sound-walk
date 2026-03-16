import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight, Compass, Headphones, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="py-24 md:py-32 bg-background relative overflow-hidden border-t border-border">
      {/* Ambient background glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[150px] pointer-events-none"
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container mx-auto px-6 md:px-12" ref={ref}>
        <div className="text-center max-w-3xl mx-auto">
          <motion.span
            className="text-xs font-mono tracking-[0.3em] uppercase text-primary/70 mb-6 block"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            Let's Create Together
          </motion.span>

          <motion.h2
            className="text-4xl md:text-7xl font-black tracking-tight text-foreground mb-6"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            Ready to{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient-text bg-[length:200%_200%]">
              Explore?
            </span>
          </motion.h2>

          <motion.p
            className="text-muted-foreground text-sm md:text-lg mb-12 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Start your GPS-guided journey through India's most magnificent heritage sites.
            Every monument has a story — let us tell it to you.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Link to="/explore">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="text-base md:text-lg px-8 md:px-12 h-12 md:h-14 font-medium tracking-wide shadow-lg relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <MapPin className="w-5 h-5 mr-2" />
                  Start Exploring
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </motion.div>
            </Link>
            <Link to="/assistant">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="transition-all duration-500 text-base md:text-lg px-8 md:px-12 h-12 md:h-14 hover:border-primary/50 font-medium tracking-wide"
                >
                  Talk to AI Guide
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>

        {/* Bottom feature pills */}
        <div className="flex flex-wrap justify-center gap-4 mt-16">
          {[
            { icon: Compass, label: "GPS Navigation" },
            { icon: Headphones, label: "Audio Narration" },
            { icon: Sparkles, label: "AI Powered" },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-border text-muted-foreground text-xs font-mono tracking-wider hover:border-primary/30 hover:text-foreground transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7 + i * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.05 }}
              >
                <Icon className="w-3.5 h-3.5 text-primary/60" />
                {item.label}
              </motion.div>
            );
          })}
        </div>

        {/* Footer line */}
        <motion.div
          className="mt-24 pt-8 border-t border-border text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-muted-foreground/50 text-xs font-mono tracking-[0.2em] uppercase">
            Lets Explore — Educational Tourism Experience
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
