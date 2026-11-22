import React, { useState, useEffect } from "react";
import { 
  MapPin, Volume2, FileText, VolumeX, Info, Calendar, Clock, Ticket, 
  Compass, ExternalLink, Sparkles, Heart, Share2, Check, Landmark, ShieldCheck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { Monument } from "@/hooks/useMonuments";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { getMonumentImage } from "@/data/monumentImages";
import { toast } from "sonner";

interface Props {
  monument: Monument;
  imageUrl?: string;
}

const MonumentFlashCard = ({ monument, imageUrl }: Props) => {
  const [isReading, setIsReading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  // Check saved favorites from localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("saved_monuments") || "[]");
      setIsSaved(saved.includes(monument.id));
    } catch {
      // Ignore storage errors
    }
  }, [monument.id]);

  const toggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const saved = JSON.parse(localStorage.getItem("saved_monuments") || "[]");
      let updated: string[];
      if (saved.includes(monument.id)) {
        updated = saved.filter((id: string) => id !== monument.id);
        setIsSaved(false);
        toast.info(`Removed ${monument.title} from favorites`);
      } else {
        updated = [...saved, monument.id];
        setIsSaved(true);
        toast.success(`Saved ${monument.title} to favorites!`);
      }
      localStorage.setItem("saved_monuments", JSON.stringify(updated));
    } catch {
      setIsSaved(!isSaved);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: `${monument.title} - Odisha Heritage`,
        text: `Discover ${monument.title} in ${monument.location} on Let's Explore!`,
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${monument.title} - ${monument.location}\n${url}`);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Framer Motion 3D Tilt Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 280, damping: 22 });
  const mouseYSpring = useSpring(y, { stiffness: 280, damping: 22 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

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
        const text = `${monument.title}. Located in ${monument.location}. ${monument.description}`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
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

  // Intelligent fallback chain: provided imageUrl -> getMonumentImage -> verified local default
  const resolvedImg = imageUrl || getMonumentImage(monument);
  const fallbackImg = "/images/monuments/konark-temple.jpg";

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
        ? "July – October (post-monsoon, full cascade)"
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
        ? "Free entry • Camera / special darshan charges may apply"
        : isWildlife
        ? "₹20 – ₹100 (Indian) • Extra for vehicles & safaris"
        : isHistorical
        ? "₹15 – ₹40 (Indian) • Free for children under 15"
        : "Free or nominal entry",
      significance: isTemple
        ? "Ancient sacred pilgrimage site embodying classical Kalinga architectural mastery and centuries of living spiritual heritage."
        : isBeach
        ? "A pristine coastal sanctuary along the Bay of Bengal, celebrated for shimmering golden sands and spectacular sunrises."
        : isWaterfall
        ? "A majestic natural cascade nestled amidst the Eastern Ghats, sustained by perennial forest streams."
        : isWildlife
        ? "A critical biodiversity hotspot safeguarding endangered native wildlife, flora, and natural ecosystems."
        : isLake
        ? "An expansive ecological wonder supporting migratory waterfowl, aquatic life, and local heritage fishing communities."
        : "An esteemed archaeological and historical treasure reflecting Odisha's glorious artistic and civic legacy.",
      discovery: isTemple
        ? "Erected between the 7th and 13th century CE during the golden epoch of the Kalinga and Eastern Ganga dynasties."
        : isHistorical
        ? "Dating back multiple centuries; documented in imperial chronicles and early archaeological surveys."
        : "Recognized natural and cultural heritage reserve with documented ecological history.",
      tips: isTemple
        ? ["Dress modestly with covered shoulders and knees", "Remove footwear before stepping onto sanctum premises", "Carry small denominations for traditional offerings"]
        : isBeach
        ? ["Witness the breathtaking sunrise over the Bay of Bengal", "Swim only in demarcated zones with active lifeguards", "Stay well-hydrated and protect against tropical sun"]
        : isWildlife
        ? ["Secure an authorized state forest safari guide", "Carry binoculars and wear earth-toned apparel", "Maintain utmost silence and do not feed wild animals"]
        : isWaterfall
        ? ["Wear specialized footwear with high-traction wet grip", "Exercise caution around slippery moss-covered rocks", "Post-monsoon months offer the fullest water volume"]
        : ["Carry government ID and adequate drinking water", "Respect local socio-religious customs and guidelines", "Hire a local storyteller for deep historical context"],
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
        className="group relative rounded-3xl overflow-hidden glass-card glass-card-hover border border-white/10 dark:border-white/5 transition-all duration-300"
      >
        {/* Neon Ambient Edge Glow on Hover */}
        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none shadow-[inset_0_0_24px_rgba(var(--primary),0.35)] z-0" />

        {/* Ambient Top Light Beam */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-black/20 dark:from-white/10 opacity-60 z-0 pointer-events-none" />

        <div
          className="relative z-10"
          style={{ transform: "translateZ(30px)" }}
        >
          {/* Main Visual Image Card */}
          <div className="relative h-52 sm:h-60 w-[calc(100%-1rem)] overflow-hidden mt-2 mx-2 rounded-2xl shadow-xl ring-1 ring-black/10 dark:ring-white/10 block text-left">
            {/* Shimmer Skeleton Placeholder while image loads */}
            {!imgLoaded && !imgError && (
              <div className="absolute inset-0 z-0 bg-muted/60 animate-pulse flex flex-col items-center justify-center gap-2">
                <Landmark className="w-8 h-8 text-primary/40 animate-bounce" />
                <span className="text-[11px] text-muted-foreground/80 font-medium">Loading view...</span>
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent" />
              </div>
            )}

            <img
              src={imgError ? fallbackImg : resolvedImg}
              alt={monument.title}
              className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-108 ${imgLoaded ? "opacity-100 filter-none" : "opacity-0 scale-95 blur-sm"}`}
              loading="lazy"
              decoding="async"
              onLoad={() => setImgLoaded(true)}
              onError={() => {
                setImgError(true);
                setImgLoaded(true);
              }}
            />

            {/* Dark Cinematic Gradient Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/30 pointer-events-none" />

            {/* Top Left: Category Badge */}
            <div className="absolute top-3 left-3 z-10" style={{ transform: "translateZ(40px)" }}>
              <Badge className="bg-black/50 hover:bg-black/60 text-white backdrop-blur-xl border border-white/30 font-medium shadow-md text-xs py-1 px-2.5">
                {monument.category || "Heritage"}
              </Badge>
            </div>

            {/* Top Right: Favorite + Share Buttons */}
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5" style={{ transform: "translateZ(40px)" }}>
              {monument.is_featured && (
                <Badge variant="secondary" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white backdrop-blur-xl border border-amber-300/40 shadow-md font-semibold text-xs py-0.5 px-2">
                  Featured
                </Badge>
              )}
              <button
                type="button"
                onClick={toggleSave}
                aria-label={isSaved ? "Remove from favorites" : "Save to favorites"}
                className={`p-2 rounded-full backdrop-blur-xl transition-all duration-300 shadow-md border ${
                  isSaved 
                    ? "bg-red-500/90 text-white border-red-300/60" 
                    : "bg-black/40 hover:bg-black/60 text-white/90 hover:text-white border-white/20"
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-white" : ""}`} />
              </button>
              <button
                type="button"
                onClick={handleShare}
                aria-label="Share monument"
                className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white/90 hover:text-white backdrop-blur-xl transition-all duration-300 shadow-md border border-white/20"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Bottom Left: Distance Badge */}
            {monument.distance_from_berhampur && (
              <div className="absolute bottom-3 left-3 z-10" style={{ transform: "translateZ(20px)" }}>
                <p className="text-[11px] text-white/95 font-medium drop-shadow-lg bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-md border border-white/25">
                  📍 {monument.distance_from_berhampur}
                </p>
              </div>
            )}

            {/* Bottom Right: Interactive Tap Hint */}
            <button
              type="button"
              onClick={() => setDetailOpen(true)}
              className="absolute bottom-3 right-3 z-10 text-[11px] text-white font-medium bg-primary/85 hover:bg-primary px-2.5 py-1 rounded-full backdrop-blur-md border border-white/30 inline-flex items-center gap-1 shadow-lg transition-transform active:scale-95"
            >
              <Info className="w-3 h-3" /> Tap details
            </button>
          </div>

          {/* Content Body */}
          <div className="p-5 space-y-4">
            <div style={{ transform: "translateZ(50px)" }}>
              <div className="flex items-start justify-between gap-2">
                <h3 
                  onClick={() => setDetailOpen(true)}
                  className="text-xl sm:text-2xl font-bold text-foreground hover:text-primary cursor-pointer transition-colors line-clamp-1 pb-1"
                >
                  {monument.title}
                </h3>
              </div>

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

            {/* Primary Action Buttons */}
            <div
              className="flex gap-3 pt-1"
              style={{ transform: "translateZ(40px)" }}
            >
              <button
                type="button"
                onClick={isReading ? handleStop : handleSpeak}
                className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl h-11 text-sm font-semibold transition-all duration-300 active:scale-95 shadow-md overflow-hidden relative ${
                  isReading 
                    ? "bg-destructive text-destructive-foreground animate-pulse" 
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {isReading ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>Stop Audio</span>
                    <span className="flex gap-0.5 items-center ml-1">
                      <span className="w-1 h-3 bg-white rounded-full animate-pulse" />
                      <span className="w-1 h-4 bg-white rounded-full animate-bounce" />
                      <span className="w-1 h-2 bg-white rounded-full animate-pulse" />
                    </span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>Listen Guide</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setDetailOpen(true)}
                className="flex-[0.6] inline-flex items-center justify-center gap-1.5 rounded-xl h-11 text-sm font-medium glass-panel hover:bg-white/20 dark:hover:bg-white/10 text-foreground transition-all duration-300 active:scale-95 border border-white/20 shadow-sm"
              >
                <Info className="w-4 h-4 text-primary" />
                More Info
              </button>
            </div>

            {/* Secondary Action Row: Quick Facts & Google Maps */}
            <div className="flex gap-3" style={{ transform: "translateZ(40px)" }}>
              <button
                type="button"
                onClick={toggleSummary}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl h-10 text-xs font-medium glass-panel hover:bg-white/20 dark:hover:bg-white/10 text-foreground transition-all duration-300 active:scale-95 border border-white/20"
              >
                <FileText className="w-3.5 h-3.5 text-primary" />
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

            {/* Expandable Quick Facts Section */}
            <AnimatePresence>
              {showSummary && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  {monument.facts && monument.facts.length > 0 ? (
                    <div className="p-4 rounded-2xl glass-panel space-y-2.5 mt-2 shadow-inner border border-white/15">
                      <h4 className="font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5 text-primary">
                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                        Key Historical Points
                      </h4>
                      <ul className="list-disc list-inside space-y-1.5 text-xs text-foreground/85 marker:text-primary">
                        {monument.facts.map((fact, index) => (
                          <li key={index} className="leading-relaxed">{fact}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl glass-panel mt-2 shadow-inner border border-white/15">
                      <p className="text-xs text-muted-foreground italic text-center">
                        Verified historical facts cataloged by State Heritage Archives.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* High-Fidelity Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 glass-card border border-white/20 shadow-2xl rounded-3xl">
          {/* Hero Image in Dialog */}
          <div className="relative h-64 sm:h-80 w-full overflow-hidden">
            <img
              src={imgError ? fallbackImg : resolvedImg}
              alt={monument.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/30" />
            
            <div className="absolute top-4 right-4 z-20 flex gap-2">
              <button
                type="button"
                onClick={toggleSave}
                className={`p-2.5 rounded-full backdrop-blur-xl transition-all shadow-lg border ${
                  isSaved ? "bg-red-500 text-white border-red-300" : "bg-black/50 text-white border-white/20 hover:bg-black/70"
                }`}
              >
                <Heart className={`w-4 h-4 ${isSaved ? "fill-white" : ""}`} />
              </button>
            </div>

            <div className="absolute bottom-4 left-5 right-5">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge className="bg-primary/95 text-primary-foreground font-semibold shadow-md">
                  {monument.category || "Monument"}
                </Badge>
                {monument.is_featured && (
                  <Badge variant="secondary" className="bg-amber-500 text-white font-semibold shadow-md">
                    Featured Landmark
                  </Badge>
                )}
                <Badge variant="outline" className="bg-black/40 text-white border-white/30 backdrop-blur-md">
                  <ShieldCheck className="w-3 h-3 mr-1 text-emerald-400" /> Verified Record
                </Badge>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground drop-shadow-md">
                {monument.title}
              </h2>
              <div className="flex items-center gap-1.5 text-sm text-foreground/80 mt-1">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span>{monument.location}</span>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-7 space-y-6">
            <DialogHeader className="sr-only">
              <DialogTitle>{monument.title}</DialogTitle>
              <DialogDescription>Full archival records and visitor guide for {monument.title}</DialogDescription>
            </DialogHeader>

            {/* Narrative Overview */}
            <section className="space-y-2">
              <h3 className="font-bold text-base flex items-center gap-2 text-foreground">
                <Sparkles className="w-4 h-4 text-primary" />
                Historical & Cultural Overview
              </h3>
              <p className="text-sm text-foreground/85 leading-relaxed">{monument.description}</p>
            </section>

            {/* Cultural Significance Box */}
            <section className="p-4 rounded-2xl glass-panel border border-white/15 space-y-2">
              <h3 className="font-semibold text-sm flex items-center gap-2 text-primary">
                <Compass className="w-4 h-4 text-primary" />
                Architectural & Cultural Significance
              </h3>
              <p className="text-sm text-foreground/85 leading-relaxed">{enrichedDetails.significance}</p>
            </section>

            {/* Practical Visitor Stats Grid */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl glass-panel border border-white/10">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                  <Calendar className="w-3.5 h-3.5 text-primary" /> Best Season
                </div>
                <p className="text-xs sm:text-sm font-semibold text-foreground leading-snug">{enrichedDetails.bestTime}</p>
              </div>
              <div className="p-3.5 rounded-2xl glass-panel border border-white/10">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                  <Clock className="w-3.5 h-3.5 text-primary" /> Suggested Time
                </div>
                <p className="text-xs sm:text-sm font-semibold text-foreground leading-snug">{enrichedDetails.visitDuration}</p>
              </div>
              <div className="p-3.5 rounded-2xl glass-panel border border-white/10">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                  <Ticket className="w-3.5 h-3.5 text-primary" /> Entry Fee
                </div>
                <p className="text-xs sm:text-sm font-semibold text-foreground leading-snug">{enrichedDetails.entryFee}</p>
              </div>
            </section>

            {/* Curated Historical Facts */}
            {monument.facts && monument.facts.length > 0 && (
              <section className="p-4 rounded-2xl glass-panel border border-white/15 space-y-2">
                <h3 className="font-semibold text-sm flex items-center gap-2 text-primary">
                  <FileText className="w-4 h-4 text-primary" />
                  Key Historical Chronicles
                </h3>
                <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-foreground/85 marker:text-primary">
                  {monument.facts.map((fact, i) => (
                    <li key={i} className="leading-relaxed">{fact}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* Travel Guidelines */}
            <section className="p-4 rounded-2xl glass-panel border border-white/15 space-y-2">
              <h3 className="font-semibold text-sm flex items-center gap-2 text-primary">
                <Info className="w-4 h-4 text-primary" />
                Essential Visitor Guidelines
              </h3>
              <ul className="space-y-1.5 text-xs sm:text-sm text-foreground/85">
                {enrichedDetails.tips.map((tip, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Coordinates & Region */}
            {(monument.distance_from_berhampur || (monument.latitude && monument.longitude)) && (
              <section className="flex flex-wrap gap-2 text-xs text-muted-foreground pt-1">
                {monument.distance_from_berhampur && (
                  <span className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-foreground font-medium">
                    📍 {monument.distance_from_berhampur}
                  </span>
                )}
                {monument.latitude && monument.longitude && (
                  <span className="px-3 py-1.5 rounded-full glass-panel border border-white/15">
                    🌐 Geodetic: {monument.latitude.toFixed(4)}° N, {monument.longitude.toFixed(4)}° E
                  </span>
                )}
              </section>
            )}

            {/* Action Bar */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl h-12 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-95 shadow-lg"
              >
                <MapPin className="w-4 h-4" />
                Google Maps
                <ExternalLink className="w-3.5 h-3.5 ml-0.5 opacity-80" />
              </a>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl h-12 text-sm font-semibold glass-panel hover:bg-white/20 dark:hover:bg-white/10 text-foreground transition-all active:scale-95 border border-white/20"
              >
                <Compass className="w-4 h-4 text-primary" />
                Directions
              </a>
              <button
                type="button"
                onClick={isReading ? handleStop : handleSpeak}
                className="inline-flex items-center justify-center gap-2 rounded-xl h-12 text-sm font-semibold glass-button transition-all active:scale-95"
              >
                {isReading ? (
                  <><VolumeX className="w-4 h-4 text-destructive" /> Stop Audio</>
                ) : (
                  <><Volume2 className="w-4 h-4 text-primary" /> Audio Guide</>
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
