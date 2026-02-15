import { useState } from "react";
import { MapPin, Volume2, FileText, VolumeX, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Monument } from "@/hooks/useMonuments";

interface Props {
  monument: Monument;
  imageUrl: string;
}

const MonumentFlashCard = ({ monument, imageUrl }: Props) => {
  const [isReading, setIsReading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleSpeak = () => {
    try {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const text = `${monument.title}. ${monument.description}`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.onstart = () => setIsReading(true);
        utterance.onend = () => setIsReading(false);
        utterance.onerror = () => setIsReading(false);
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.error("Speech error:", err);
      setIsReading(false);
    }
  };

  const handleStop = () => {
    try {
      window.speechSynthesis.cancel();
    } catch (err) {
      console.error("Stop error:", err);
    }
    setIsReading(false);
  };

  const toggleSummary = () => {
    setShowSummary((prev) => !prev);
  };

  const fallbackImg = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&q=70";

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-card border border-border/50 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-glow)] transition-all duration-500 hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-48 sm:h-56 overflow-hidden bg-muted">
        {!imgLoaded && !imgError && (
          <Skeleton className="absolute inset-0 rounded-none" />
        )}
        <img
          src={imgError ? fallbackImg : imageUrl}
          alt={monument.title}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          onError={() => {
            setImgError(true);
            setImgLoaded(true);
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

        {/* Category badge */}
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-primary/90 text-primary-foreground text-xs backdrop-blur-sm border-0">
            {monument.category}
          </Badge>
        </div>

        {monument.is_featured && (
          <div className="absolute top-3 right-3 z-10">
            <Badge variant="secondary" className="bg-secondary/90 text-secondary-foreground text-xs backdrop-blur-sm border-0">
              Featured
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 space-y-3">
        <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-1">
          {monument.title}
        </h3>

        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 shrink-0 text-primary/70" />
          <span className="line-clamp-1">{monument.location}</span>
        </div>

        <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2 leading-relaxed">
          {monument.description}
        </p>

        {/* Buttons */}
        <div className="flex gap-2.5 pt-1">
          <button
            type="button"
            onClick={isReading ? handleStop : handleSpeak}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full h-9 sm:h-10 text-xs sm:text-sm font-semibold transition-all duration-300 active:scale-95"
            style={{
              backgroundColor: isReading ? "hsl(var(--destructive))" : "hsl(var(--primary))",
              color: "hsl(var(--primary-foreground))",
            }}
          >
            {isReading ? (
              <><VolumeX className="w-3.5 h-3.5" /> Stop</>
            ) : (
              <><Volume2 className="w-3.5 h-3.5" /> Listen</>
            )}
          </button>

          <button
            type="button"
            onClick={toggleSummary}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full h-9 sm:h-10 text-xs sm:text-sm font-semibold border border-border bg-card text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 active:scale-95"
          >
            <FileText className="w-3.5 h-3.5" />
            {showSummary ? "Hide" : "Facts"}
            {showSummary ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* Facts Section */}
        {showSummary && monument.facts && monument.facts.length > 0 && (
          <div className="p-3 rounded-lg bg-muted/50 space-y-2 animate-fade-in">
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
          <div className="p-3 rounded-lg bg-muted/50 animate-fade-in">
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
    </div>
  );
};

export default MonumentFlashCard;
