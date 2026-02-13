import { useState, useRef, useCallback } from "react";
import { MapPin, Volume2, FileText, VolumeX, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useClickSound } from "@/hooks/useClickSound";
import type { Monument } from "@/hooks/useMonuments";

interface Props {
  monument: Monument;
  imageUrl: string;
}

const MonumentFlashCard = ({ monument, imageUrl }: Props) => {
  const [isReading, setIsReading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { playClick } = useClickSound();

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({
      x: (y - 0.5) * -15,
      y: (x - 0.5) * 15,
    });
  }, []);

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleSpeak = () => {
    playClick();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const text = `${monument.title}. ${monument.description}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.onstart = () => setIsReading(true);
      utterance.onend = () => setIsReading(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStop = () => {
    playClick();
    window.speechSynthesis.cancel();
    setIsReading(false);
  };

  const toggleSummary = () => {
    playClick();
    setShowSummary((prev) => !prev);
  };

  return (
    <div
      ref={cardRef}
      className="monument-flash-card group relative"
      style={{
        perspective: "800px",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="relative rounded-2xl overflow-hidden bg-card border border-border/50 shadow-soft transition-shadow duration-500 hover:shadow-glow"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.02 : 1})`,
          transition: "transform 0.15s ease-out, box-shadow 0.5s ease",
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        {/* Scan line */}
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden rounded-2xl">
          <div
            className="absolute inset-x-0 h-20 opacity-0 group-hover:opacity-100"
            style={{
              background: "linear-gradient(to bottom, transparent, hsl(var(--primary) / 0.08), transparent)",
              animation: isHovered ? "scanMove 2.5s linear infinite" : "none",
            }}
          />
        </div>

        {/* Corner accents */}
        <div className="absolute inset-0 z-10 pointer-events-none rounded-2xl">
          <span className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-primary/0 group-hover:border-primary/60 transition-all duration-500 rounded-tl-md" />
          <span className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-primary/0 group-hover:border-primary/60 transition-all duration-500 rounded-tr-md" />
          <span className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-primary/0 group-hover:border-primary/60 transition-all duration-500 rounded-bl-md" />
          <span className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-primary/0 group-hover:border-primary/60 transition-all duration-500 rounded-br-md" />
        </div>

        {/* Glare effect */}
        <div
          className="absolute inset-0 z-10 pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `linear-gradient(${105 + tilt.y * 2}deg, transparent 40%, hsl(var(--primary) / 0.06) 50%, transparent 60%)`,
          }}
        />

        {/* Image */}
        <div className="relative h-44 sm:h-52 overflow-hidden">
          <img
            src={imageUrl}
            alt={monument.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />

          {/* Category badge */}
          <div className="absolute top-3 left-3 z-20">
            <Badge className="bg-primary/90 text-primary-foreground text-xs backdrop-blur-sm">
              {monument.category}
            </Badge>
          </div>

          {monument.is_featured && (
            <div className="absolute top-3 right-3 z-20">
              <Badge variant="secondary" className="bg-secondary/90 text-xs backdrop-blur-sm">
                Featured
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-2.5">
          <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-1">
            {monument.title}
          </h3>

          <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="line-clamp-1">{monument.location}</span>
          </div>

          <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2 sm:line-clamp-3">
            {monument.description}
          </p>

          {/* Animated Buttons */}
          <div className="flex gap-2 pt-1.5">
            <button
              onClick={isReading ? handleStop : handleSpeak}
              className="fancy-btn flex-1 group/btn relative overflow-hidden rounded-full h-9 sm:h-10 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5"
            >
              <span className="fancy-btn-bg absolute inset-0 rounded-full" style={{
                backgroundColor: isReading ? "hsl(var(--destructive))" : "hsl(var(--secondary))",
              }} />
              <span className="fancy-btn-layers absolute left-1/2 -translate-x-1/2 -top-[60%] aspect-square w-[200%]">
                <span className="fancy-btn-layer fancy-btn-layer-1 absolute inset-0 rounded-full" style={{ backgroundColor: "hsl(var(--primary))" }} />
                <span className="fancy-btn-layer fancy-btn-layer-2 absolute inset-0 rounded-full" style={{ backgroundColor: "hsl(var(--accent))" }} />
                <span className="fancy-btn-layer fancy-btn-layer-3 absolute inset-0 rounded-full" style={{ backgroundColor: isReading ? "hsl(var(--destructive))" : "hsl(var(--secondary))" }} />
              </span>
              <span className="relative z-10 flex items-center gap-1 text-primary-foreground">
                {isReading ? (
                  <><VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Stop</>
                ) : (
                  <><Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Listen</>
                )}
              </span>
            </button>

            <button
              onClick={toggleSummary}
              className="fancy-btn flex-1 group/btn relative overflow-hidden rounded-full h-9 sm:h-10 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1"
            >
              <span className="fancy-btn-bg absolute inset-0 rounded-full border border-border bg-card" />
              <span className="fancy-btn-layers absolute left-1/2 -translate-x-1/2 -top-[60%] aspect-square w-[200%]">
                <span className="fancy-btn-layer fancy-btn-layer-1 absolute inset-0 rounded-full" style={{ backgroundColor: "hsl(var(--primary))" }} />
                <span className="fancy-btn-layer fancy-btn-layer-2 absolute inset-0 rounded-full" style={{ backgroundColor: "hsl(var(--accent))" }} />
                <span className="fancy-btn-layer fancy-btn-layer-3 absolute inset-0 rounded-full" style={{ backgroundColor: "hsl(var(--secondary))" }} />
              </span>
              <span className="relative z-10 flex items-center gap-1 text-foreground group-hover/btn:text-primary-foreground transition-colors duration-300">
                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {showSummary ? "Hide" : "Facts"}
                {showSummary ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </span>
            </button>
          </div>

          {/* Facts Section */}
          {showSummary && monument.facts && monument.facts.length > 0 && (
            <div className="p-3 rounded-lg bg-muted/50 space-y-2 animate-in fade-in slide-in-from-top-2">
              <h4 className="font-semibold text-sm flex items-center gap-1">
                <FileText className="w-4 h-4 text-primary" />
                Historical Facts
              </h4>
              <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
                {monument.facts.map((fact, index) => (
                  <li key={index}>{fact}</li>
                ))}
              </ul>
            </div>
          )}

          {showSummary && (!monument.facts || monument.facts.length === 0) && (
            <div className="p-3 rounded-lg bg-muted/50 animate-in fade-in slide-in-from-top-2">
              <p className="text-xs text-muted-foreground italic">
                No additional facts available for this monument yet.
              </p>
            </div>
          )}

          {monument.distance_from_berhampur && (
            <p className="text-xs text-primary font-medium pt-1">
              📍 {monument.distance_from_berhampur}
            </p>
          )}
        </div>

        {/* Floating particles (hover only, desktop) */}
        <div className="absolute inset-0 pointer-events-none z-10 hidden group-hover:block">
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className="absolute w-1 h-1 rounded-full bg-primary/60"
              style={{
                top: `${20 + i * 20}%`,
                left: `${15 + i * 22}%`,
                animation: `particleFloat 2s ease-in-out infinite ${i * 0.4}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonumentFlashCard;
