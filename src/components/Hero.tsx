import { Button } from "@/components/ui/button";
import { MapPin, Volume2 } from "lucide-react";
import heroImage from "@/assets/hero-monument.jpg";
import CitySearchBox from "./CitySearchBox";

const Hero = () => {
  return (
    <section className="relative min-h-[80vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden pt-14 md:pt-16">
      {/* Background Image with Overlay - use <img> with fetchpriority for fast LCP */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt=""
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background/95" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-0 text-center">
        <div className="max-w-4xl mx-auto space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          {/* City Search Box */}
          <div className="flex justify-center">
            <CitySearchBox />
          </div>
          
          <div className="inline-flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
            <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
            <span className="text-xs md:text-sm font-medium text-foreground">Educational Tourism Experience</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Lets Explore
            </span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2">
            Transform every journey into an educational adventure. Discover historical monuments 
            with GPS-guided narration as you explore.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center pt-2 md:pt-4 px-4 sm:px-0">
            <Button 
              size="lg"
              className="bg-gradient-hero hover:shadow-glow transition-all duration-300 text-base md:text-lg px-6 md:px-8 h-11 md:h-12"
            >
              <MapPin className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Start Exploring
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 hover:bg-accent/10 transition-smooth text-base md:text-lg px-6 md:px-8 h-11 md:h-12"
            >
              <Volume2 className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              How It Works
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6 pt-8 md:pt-12 px-2 sm:px-0">
            {[
              { title: "GPS Notifications", desc: "Get alerts as you approach monuments" },
              { title: "Audio Narration", desc: "Listen to historical facts on-the-go" },
              { title: "Written Summaries", desc: "Read detailed information anytime" },
            ].map((feature, i) => (
              <div 
                key={i}
                className="p-4 md:p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 shadow-soft hover:shadow-medium transition-smooth"
              >
                <h3 className="font-semibold text-base md:text-lg mb-1 md:mb-2">{feature.title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
