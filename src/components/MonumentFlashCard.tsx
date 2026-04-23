import React, { useState } from "react";
import { MapPin, Volume2, FileText, VolumeX, ChevronDown, ChevronUp, Info, Calendar, Clock, Ticket, Compass, ExternalLink, Sparkles, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { Monument } from "@/hooks/useMonuments";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";

interface Props {
  monument: Monument;
  imageUrl: string;
}

const MonumentFlashCard = ({ monument, imageUrl }: Props) => {
  const [isReading, setIsReading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  // Framer Motion 3D Hover Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

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

  // Derive enriched info from category + facts
  const cat = (monument.category || "").toLowerCase();
  const enrichedDetails = (() => {
    const isTemple = cat.includes("temple") || cat.includes("shrine");
    const isBeach = cat.includes("beach");
    const isWaterfall = cat.includes("waterfall");
    const isWildlife = cat.includes("wildlife") || cat.includes("sanctuary") || cat.includes("park");
    const isLake = cat.includes("lake") || cat.includes("wetland");
    const isHistorical = cat.includes("historical") || cat.includes("monument") || cat.includes("fort") || cat.includes("cave");

    return {
      bestTime: isBeach || isWildlife
        ? "October – February (cool & dry season)"
        : isWaterfall
        ? "July – October (post-monsoon, full flow)"
        : isTemple
        ? "Year-round; early morning or evening aarti recommended"
        : "October – March (pleasant Odisha weather)",
      visitDuration: isTemple
        ? "1 – 2 hours"
        : isBeach || isLake
        ? "2 – 4 hours"
        : isWildlife
        ? "Half day (3 – 5 hours)"
        : "1 – 3 hours",
      entryFee: isTemple
        ? "Free entry • Camera/footwear charges may apply"
        : isWildlife
        ? "₹20 – ₹100 (Indian) • Extra for vehicles & cameras"
        : isHistorical
        ? "₹15 – ₹40 (Indian) • Free for children under 15"
        : "Free or nominal entry",
      significance: isTemple
        ? "Ancient pilgrimage site representing Odisha's Kalinga temple architecture and devotional heritage."
        : isBeach
        ? "A serene coastal escape along the Bay of Bengal, known for its golden sands and breathtaking sunrises."
        : isWaterfall
        ? "A natural cascade nestled in lush forests, formed by perennial streams flowing over rocky terrain."
        : isWildlife
        ? "A protected ecosystem sheltering native flora and fauna of Odisha's biodiversity."
        : isLake
        ? "An ecological treasure supporting migratory birds, aquatic life and traditional fishing communities."
        : "A historically significant landmark reflecting Odisha's rich cultural and architectural legacy.",
      discovery: isTemple
        ? "Built between the 7th – 13th century CE during the reign of the Kalinga and Eastern Ganga dynasties."
        : isHistorical
        ? "Dates back several centuries; documented during early colonial surveys of Odisha (then Orissa)."
        : isBeach || isLake || isWaterfall || isWildlife
        ? "A natural site recognised and developed for tourism in the post-independence era."
        : "Recognised heritage site with documented history spanning centuries.",
      tips: isTemple
        ? ["Dress modestly • Remove footwear before entry", "Photography may be restricted inside sanctum", "Carry small change for offerings"]
        : isBeach
        ? ["Visit at sunrise for the best views", "Avoid swimming in unmonitored zones", "Stay hydrated and use sunscreen"]
        : isWildlife
        ? ["Hire a registered guide for safaris", "Carry binoculars & avoid bright clothing", "Maintain silence; do not feed animals"]
        : isWaterfall
        ? ["Wear non-slip footwear on wet rocks", "Best viewed after monsoon (Aug – Oct)", "Avoid venturing too close to the falls"]
        : ["Carry water and ID proof", "Respect local customs and signage", "Hire a local guide for richer context"],
    };
  })();

  const mapsQuery = encodeURIComponent(`${monument.title}, ${monument.location}, Odisha, India`);
  const googleMapsUrl = monument.latitude && monument.longitude
    ? `https://www.google.com/maps/search/?api=1&query=${monument.latitude},${monument.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`;

  return (
    <div className="perspective-[2000px] w-full">
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative rounded-3xl overflow-hidden glass-card glass-card-hover"
      >
        {/* Neon Edge Glow (Visible on Hover) */}
        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none shadow-[inset_0_0_20px_rgba(var(--primary),0.3)] z-0" />

        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5 opacity-50 z-0" />

        <div
          className="relative z-10"
          style={{ transform: "translateZ(30px)" }}
        >
          {/* Image (clickable to open detail) */}
          <button
            type="button"
            onClick={() => setDetailOpen(true)}
            aria-label={`View details about ${monument.title}`}
            className="relative h-48 sm:h-56 w-[calc(100%-1rem)] overflow-hidden mt-2 mx-2 rounded-2xl shadow-lg ring-1 ring-black/5 dark:ring-white/10 block text-left focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {!imgLoaded && !imgError && (
              <Skeleton className="absolute inset-0 rounded-2xl" />
            )}
            <img
              src={imgError ? fallbackImg : imageUrl}
              alt={monument.title}
              className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
              onError={() => {
                setImgError(true);
                setImgLoaded(true);
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />

            {/* Category badge */}
            <div className="absolute top-3 left-3 z-10" style={{ transform: "translateZ(40px)" }}>
              <Badge className="bg-white/30 hover:bg-white/40 text-white backdrop-blur-xl border border-white/40 font-medium shadow-md">
                {monument.category}
              </Badge>
            </div>

            {monument.is_featured && (
              <div className="absolute top-3 right-3 z-10" style={{ transform: "translateZ(40px)" }}>
                <Badge variant="secondary" className="bg-gradient-to-r from-amber-500/80 to-orange-500/80 hover:from-amber-500 hover:to-orange-500 text-white backdrop-blur-xl border border-amber-300/50 shadow-md font-medium">
                  Featured
                </Badge>
              </div>
            )}

            {monument.distance_from_berhampur && (
              <div className="absolute bottom-3 left-3 z-10" style={{ transform: "translateZ(20px)" }}>
                <p className="text-xs text-white/95 font-medium drop-shadow-lg bg-black/50 px-2 py-1 rounded-full backdrop-blur-md border border-white/20">
                  📍 {monument.distance_from_berhampur}
                </p>
              </div>
            )}

            {/* Tap-hint chip */}
            <div className="absolute bottom-3 right-3 z-10">
              <span className="text-[10px] sm:text-xs text-white/95 font-medium bg-primary/80 px-2 py-1 rounded-full backdrop-blur-md border border-white/20 inline-flex items-center gap-1">
                <Info className="w-3 h-3" /> Tap for details
              </span>
            </div>
          </button>

          {/* Content */}
          <div className="p-5 space-y-4">
            <div style={{ transform: "translateZ(50px)" }}>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 line-clamp-1 pb-1">
                {monument.title}
              </h3>

              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground mt-1">
                <MapPin className="w-4 h-4 shrink-0 text-primary" />
                <span className="line-clamp-1">{monument.location}</span>
              </div>
            </div>

            <p
              className="text-foreground/80 text-sm line-clamp-3 leading-relaxed"
              style={{ transform: "translateZ(20px)" }}
            >
              {monument.description}
            </p>

            {/* Buttons */}
            <div
              className="flex gap-3 pt-2"
              style={{ transform: "translateZ(40px)" }}
            >
              <button
                type="button"
                onClick={isReading ? handleStop : handleSpeak}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl h-11 text-sm font-medium transition-all duration-300 active:scale-95 shadow-lg overflow-hidden relative glass-button"
                style={{
                  backgroundColor: isReading ? "hsl(var(--destructive)/0.8)" : "",
                }}
              >
                {isReading ? (
                  <><VolumeX className="w-4 h-4" /> Stop</>
                ) : (
                  <><Volume2 className="w-4 h-4" /> Listen</>
                )}
              </button>

              <button
                type="button"
                onClick={() => setDetailOpen(true)}
                className="flex-[0.6] inline-flex items-center justify-center gap-1.5 rounded-xl h-11 text-sm font-medium glass-panel hover:bg-white/20 dark:hover:bg-white/10 text-foreground transition-all duration-300 active:scale-95 border-white/20"
              >
                <Info className="w-4 h-4" />
                More Info
              </button>
            </div>

            {/* Quick action row */}
            <div className="flex gap-3" style={{ transform: "translateZ(40px)" }}>
              <button
                type="button"
                onClick={toggleSummary}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl h-10 text-xs font-medium glass-panel hover:bg-white/20 dark:hover:bg-white/10 text-foreground transition-all duration-300 active:scale-95 border-white/20"
              >
                <FileText className="w-3.5 h-3.5" />
                {showSummary ? "Hide Facts" : "Quick Facts"}
              </button>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl h-10 text-xs font-medium bg-primary/15 hover:bg-primary/25 text-primary transition-all duration-300 active:scale-95 border border-primary/30"
              >
                <MapPin className="w-3.5 h-3.5" />
                Google Maps
              </a>
            </div>

            {/* Facts Section */}
            {showSummary && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="overflow-hidden"
              >
                {monument.facts && monument.facts.length > 0 ? (
                  <div className="p-4 rounded-xl glass-panel space-y-3 mt-3 shadow-inner">
                    <h4 className="font-semibold text-sm flex items-center gap-1.5 text-foreground">
                      <FileText className="w-4 h-4 text-primary" />
                      Historical Facts
                    </h4>
                    <ul className="list-disc list-inside space-y-1.5 text-sm text-foreground/80 marker:text-primary/50">
                      {monument.facts.map((fact, index) => (
                        <li key={index} className="leading-relaxed">{fact}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl glass-panel mt-3 shadow-inner">
                    <p className="text-sm text-foreground/70 italic text-center">
                      No additional facts available for this monument yet.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 glass-card border-white/20">
          {/* Hero image */}
          <div className="relative h-56 sm:h-72 w-full overflow-hidden rounded-t-lg">
            <img
              src={imgError ? fallbackImg : imageUrl}
              alt={monument.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            <div className="absolute bottom-4 left-5 right-5">
              <Badge className="bg-primary/90 text-primary-foreground mb-2">{monument.category}</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground drop-shadow-lg">{monument.title}</h2>
              <div className="flex items-center gap-1.5 text-sm text-foreground/80 mt-1">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{monument.location}</span>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6 space-y-5">
            <DialogHeader className="sr-only">
              <DialogTitle>{monument.title}</DialogTitle>
              <DialogDescription>Detailed information about {monument.title}</DialogDescription>
            </DialogHeader>

            {/* Overview */}
            <section>
              <h3 className="font-semibold text-base flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Overview
              </h3>
              <p className="text-sm text-foreground/80 leading-relaxed">{monument.description}</p>
            </section>

            {/* Significance */}
            <section className="p-4 rounded-xl glass-panel">
              <h3 className="font-semibold text-sm flex items-center gap-2 mb-2">
                <Compass className="w-4 h-4 text-primary" />
                Cultural & Historical Significance
              </h3>
              <p className="text-sm text-foreground/80 leading-relaxed">{enrichedDetails.significance}</p>
            </section>

            {/* Discovery / Era */}
            <section className="p-4 rounded-xl glass-panel">
              <h3 className="font-semibold text-sm flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-primary" />
                Era & Discovery
              </h3>
              <p className="text-sm text-foreground/80 leading-relaxed">{enrichedDetails.discovery}</p>
            </section>

            {/* Quick info grid */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl glass-panel">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                  <Calendar className="w-3.5 h-3.5 text-primary" /> Best Time
                </div>
                <p className="text-sm font-medium text-foreground">{enrichedDetails.bestTime}</p>
              </div>
              <div className="p-3 rounded-xl glass-panel">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                  <Clock className="w-3.5 h-3.5 text-primary" /> Visit Duration
                </div>
                <p className="text-sm font-medium text-foreground">{enrichedDetails.visitDuration}</p>
              </div>
              <div className="p-3 rounded-xl glass-panel">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                  <Ticket className="w-3.5 h-3.5 text-primary" /> Entry Fee
                </div>
                <p className="text-sm font-medium text-foreground">{enrichedDetails.entryFee}</p>
              </div>
            </section>

            {/* Historical facts */}
            {monument.facts && monument.facts.length > 0 && (
              <section className="p-4 rounded-xl glass-panel">
                <h3 className="font-semibold text-sm flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Historical Facts
                </h3>
                <ul className="list-disc list-inside space-y-1.5 text-sm text-foreground/80 marker:text-primary/60">
                  {monument.facts.map((fact, i) => (
                    <li key={i} className="leading-relaxed">{fact}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* Travel tips */}
            <section className="p-4 rounded-xl glass-panel">
              <h3 className="font-semibold text-sm flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-primary" />
                Travel Tips
              </h3>
              <ul className="space-y-1.5 text-sm text-foreground/80">
                {enrichedDetails.tips.map((tip, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Distance + coords */}
            {(monument.distance_from_berhampur || (monument.latitude && monument.longitude)) && (
              <section className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                {monument.distance_from_berhampur && (
                  <span className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-foreground">
                    📍 {monument.distance_from_berhampur}
                  </span>
                )}
                {monument.latitude && monument.longitude && (
                  <span className="px-3 py-1.5 rounded-full glass-panel">
                    🌐 {monument.latitude.toFixed(4)}, {monument.longitude.toFixed(4)}
                  </span>
                )}
              </section>
            )}

            {/* Action buttons */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl h-11 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-95 shadow-lg"
              >
                <MapPin className="w-4 h-4" />
                View on Google Maps
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl h-11 text-sm font-medium glass-panel hover:bg-white/20 dark:hover:bg-white/10 text-foreground transition-all active:scale-95 border border-white/20"
              >
                <Compass className="w-4 h-4" />
                Get Directions
              </a>
              <button
                type="button"
                onClick={isReading ? handleStop : handleSpeak}
                className="inline-flex items-center justify-center gap-2 rounded-xl h-11 text-sm font-medium glass-button transition-all active:scale-95"
              >
                {isReading ? (
                  <><VolumeX className="w-4 h-4" /> Stop Audio</>
                ) : (
                  <><Volume2 className="w-4 h-4" /> Listen</>
                )}
              </button>
            </section>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MonumentFlashCard;
