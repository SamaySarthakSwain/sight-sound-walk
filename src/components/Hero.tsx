import { Button } from "@/components/ui/button";
import { MapPin, Volume2 } from "lucide-react";
import heroImage from "@/assets/hero-monument.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background/95" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Educational Tourism Experience</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Lets Explore
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Transform every journey into an educational adventure. Discover historical monuments 
            with GPS-guided narration as you explore.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg"
              className="bg-gradient-hero hover:shadow-glow transition-all duration-300 text-lg px-8"
            >
              <MapPin className="w-5 h-5 mr-2" />
              Start Exploring
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 hover:bg-accent/10 transition-smooth text-lg px-8"
            >
              <Volume2 className="w-5 h-5 mr-2" />
              How It Works
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            {[
              { title: "GPS Notifications", desc: "Get alerts as you approach monuments" },
              { title: "Audio Narration", desc: "Listen to historical facts on-the-go" },
              { title: "Written Summaries", desc: "Read detailed information anytime" },
            ].map((feature, i) => (
              <div 
                key={i}
                className="p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 shadow-soft hover:shadow-medium transition-smooth"
              >
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
