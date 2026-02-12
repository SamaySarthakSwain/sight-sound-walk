import { useRef, useCallback, useState } from "react";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Volume2, VolumeX, FileText, ChevronDown, ChevronUp } from "lucide-react";

interface AnimatedMonumentCardProps {
  monument: {
    id: string;
    title: string;
    description: string;
    location: string;
    category: string;
    image_url: string | null;
    is_featured: boolean | null;
    facts: string[] | null;
    distance_from_berhampur: string | null;
  };
  fallbackImage: string;
  isReading: boolean;
  showSummary: boolean;
  onSpeak: (id: string, description: string, title: string) => void;
  onStopSpeaking: (id: string) => void;
  onToggleSummary: (id: string) => void;
}

const AnimatedMonumentCard = ({
  monument,
  fallbackImage,
  isReading,
  showSummary,
  onSpeak,
  onStopSpeaking,
  onToggleSummary,
}: AnimatedMonumentCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    setTilt({ rotateX, rotateY });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ rotateX: 0, rotateY: 0 });
  }, []);

  const imageUrl = monument.image_url || fallbackImage;

  return (
    <div className="monument-card-3d flex-shrink-0 w-[280px] sm:w-[320px] lg:w-[350px]">
      <div
        ref={cardRef}
        className="monument-card-inner relative overflow-hidden rounded-2xl bg-card border border-border/50 shadow-soft hover:shadow-medium hover:scale-[1.03] transition-all duration-500 cursor-pointer"
        style={{
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Scan line */}
        <div className="monument-scan-line" />
        {/* Glare */}
        <div className="monument-glare" />
        {/* Corner accents */}
        <span className="monument-corner tl" />
        <span className="monument-corner tr" />
        <span className="monument-corner bl" />
        <span className="monument-corner br" />
        {/* Particles */}
        <span className="monument-particle" style={{ top: "30%", left: "15%", ["--x" as string]: 1, ["--y" as string]: -1 }} />
        <span className="monument-particle" style={{ top: "60%", right: "15%", ["--x" as string]: -1, ["--y" as string]: -1 }} />
        <span className="monument-particle" style={{ top: "20%", left: "50%", ["--x" as string]: 0.5, ["--y" as string]: 1 }} />
        <span className="monument-particle" style={{ top: "75%", right: "35%", ["--x" as string]: -0.5, ["--y" as string]: 0.5 }} />

        {/* Image */}
        <div className="relative h-40 sm:h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={monument.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/20 to-transparent" />
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
            <Badge className="bg-primary/90 text-primary-foreground text-xs backdrop-blur-sm">
              {monument.category}
            </Badge>
          </div>
          {monument.is_featured && (
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
              <Badge variant="secondary" className="bg-secondary/90 text-xs backdrop-blur-sm">
                Featured
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-4 sm:p-5 space-y-2 sm:space-y-3">
          <h3 className="text-lg sm:text-xl font-bold text-foreground line-clamp-1">
            {monument.title}
          </h3>
          <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="line-clamp-1">{monument.location}</span>
          </div>
          <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2 sm:line-clamp-3">
            {monument.description}
          </p>

          {/* Audio and Summary Controls */}
          <div className="flex gap-2 pt-1 sm:pt-2">
            <Button
              variant={isReading ? "destructive" : "secondary"}
              size="sm"
              className="flex-1 h-8 sm:h-9 text-xs sm:text-sm"
              onClick={() =>
                isReading
                  ? onStopSpeaking(monument.id)
                  : onSpeak(monument.id, monument.description, monument.title)
              }
            >
              {isReading ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                  Stop
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                  Listen
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-8 sm:h-9 text-xs sm:text-sm"
              onClick={() => onToggleSummary(monument.id)}
            >
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
              {showSummary ? "Hide" : "Facts"}
              {showSummary ? (
                <ChevronUp className="w-3 h-3 ml-0.5 sm:ml-1" />
              ) : (
                <ChevronDown className="w-3 h-3 ml-0.5 sm:ml-1" />
              )}
            </Button>
          </div>

          {/* Summary/Facts Section */}
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
        </CardContent>
      </div>
    </div>
  );
};

export default AnimatedMonumentCard;
