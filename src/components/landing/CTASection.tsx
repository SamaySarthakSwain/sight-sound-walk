import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight, Compass, Headphones, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";

const CTASection = () => {
  return (
    <section className="py-24 md:py-32 bg-background relative overflow-hidden border-t border-border">
      <div className="container mx-auto px-6 md:px-12">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-mono tracking-[0.3em] uppercase text-primary/70 mb-6 block">
              Let's Create Together
            </span>

            <h2 className="text-4xl md:text-7xl font-black tracking-tight text-foreground mb-6">
              Ready to{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient-text bg-[length:200%_200%]">
                Explore?
              </span>
            </h2>

            <p className="text-muted-foreground text-sm md:text-lg mb-12 max-w-xl mx-auto">
              Start your GPS-guided journey through India's most magnificent heritage sites.
              Every monument has a story — let us tell it to you.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/explore">
                <Button
                  size="lg"
                  className="text-base md:text-lg px-8 md:px-12 h-12 md:h-14 hover:scale-105 active:scale-95 font-medium tracking-wide shadow-lg"
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  Start Exploring
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/assistant">
                <Button
                  size="lg"
                  variant="outline"
                  className="transition-all duration-500 text-base md:text-lg px-8 md:px-12 h-12 md:h-14 hover:scale-105 active:scale-95 hover:border-primary/50 font-medium tracking-wide"
                >
                  Talk to AI Guide
                </Button>
              </Link>
            </div>
          </div>
        </ScrollReveal>

        {/* Bottom feature pills */}
        <ScrollReveal>
          <div className="flex flex-wrap justify-center gap-4 mt-16">
            {[
              { icon: Compass, label: "GPS Navigation" },
              { icon: Headphones, label: "Audio Narration" },
              { icon: Sparkles, label: "AI Powered" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-border text-muted-foreground text-xs font-mono tracking-wider"
                >
                  <Icon className="w-3.5 h-3.5 text-primary/60" />
                  {item.label}
                </div>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Footer line */}
        <div className="mt-24 pt-8 border-t border-border text-center">
          <p className="text-muted-foreground/50 text-xs font-mono tracking-[0.2em] uppercase">
            Lets Explore — Educational Tourism Experience
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
