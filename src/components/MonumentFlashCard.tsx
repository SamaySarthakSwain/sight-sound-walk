import React, { useState, useEffect } from "react";
import { MapPin, Volume2, FileText, VolumeX, X, Sparkles, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
  const [expanded, setExpanded] = useState(false);

  // Framer Motion 3D Hover Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (expanded) return;
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

  const handleSpeak = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const factsText = monument.facts && monument.facts.length > 0
          ? ` Here are some interesting facts: ${monument.facts.join(". ")}`
          : "";
        const text = `${monument.title}. ${monument.description}.${factsText}`;
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

  const handleStop = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      window.speechSynthesis.cancel();
    } catch (err) {
      console.error("Stop error:", err);
    }
    setIsReading(false);
  };

  const toggleSummary = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setShowSummary((prev) => !prev);
  };

  const openExpanded = () => {
    setExpanded(true);
    x.set(0);
    y.set(0);
  };

  const closeExpanded = () => {
    setExpanded(false);
    handleStop();
  };

  // Lock body scroll & ESC to close while expanded
  useEffect(() => {
    if (!expanded) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeExpanded();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]);

  const fallbackImg = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&q=70";
  const layoutId = `monument-card-${monument.id}`;

  return (
    <>
      <div className="perspective-[2000px] w-full">
        <motion.div
          layoutId={layoutId}
          style={{
            rotateX: expanded ? 0 : rotateX,
            rotateY: expanded ? 0 : rotateY,
            transformStyle: "preserve-3d",
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={openExpanded}
          className="group relative rounded-3xl overflow-hidden glass-card glass-card-hover cursor-pointer"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openExpanded();
            }
          }}
        >
          {/* Neon Edge Glow (Visible on Hover) */}
          <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none shadow-[inset_0_0_20px_rgba(var(--primary),0.3)] z-0" />

          {/* Subtle Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5 opacity-50 z-0" />

          <div
            className="relative z-10"
            style={{ transform: "translateZ(30px)" }}
          >
            {/* Image */}
            <div className="relative h-48 sm:h-56 overflow-hidden mt-2 mx-2 rounded-2xl shadow-lg ring-1 ring-black/5 dark:ring-white/10">
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
            </div>

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

              {/* Tap hint */}
              <div
                className="flex items-center justify-center gap-1.5 pt-1 text-xs text-primary/80 font-medium"
                style={{ transform: "translateZ(40px)" }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Tap to explore</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Expanded centered hero modal */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-background/80 backdrop-blur-xl"
            onClick={closeExpanded}
          >
            <motion.div
              layoutId={layoutId}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl glass-card shadow-2xl"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Close button */}
              <button
                type="button"
                onClick={closeExpanded}
                aria-label="Close"
                className="absolute top-4 right-4 z-20 inline-flex items-center justify-center w-10 h-10 rounded-full bg-background/70 hover:bg-background/90 text-foreground backdrop-blur-md border border-white/20 shadow-lg transition-all active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Hero image */}
              <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden mt-2 mx-2 rounded-2xl shadow-lg ring-1 ring-black/5 dark:ring-white/10">
                <img
                  src={imgError ? fallbackImg : imageUrl}
                  alt={monument.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-2">
                  <Badge className="bg-white/30 hover:bg-white/40 text-white backdrop-blur-xl border border-white/40 font-medium shadow-md">
                    <Tag className="w-3 h-3 mr-1" />
                    {monument.category}
                  </Badge>
                  {monument.is_featured && (
                    <Badge variant="secondary" className="bg-gradient-to-r from-amber-500/80 to-orange-500/80 text-white backdrop-blur-xl border border-amber-300/50 shadow-md font-medium">
                      Featured
                    </Badge>
                  )}
                </div>

                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <h2 className="text-2xl sm:text-4xl font-bold text-white drop-shadow-lg leading-tight">
                    {monument.title}
                  </h2>
                  <div className="flex items-center gap-1.5 text-sm text-white/90 mt-2 drop-shadow-md">
                    <MapPin className="w-4 h-4 shrink-0 text-primary" />
                    <span>{monument.location}</span>
                    {monument.distance_from_berhampur && (
                      <span className="ml-2 px-2 py-0.5 rounded-full bg-black/50 text-xs backdrop-blur-md border border-white/20">
                        📍 {monument.distance_from_berhampur}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 sm:p-7 space-y-5">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                  className="text-foreground/90 text-base leading-relaxed"
                >
                  {monument.description}
                </motion.p>

                {/* Facts */}
                {monument.facts && monument.facts.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.4 }}
                    className="p-4 sm:p-5 rounded-2xl glass-panel space-y-3 shadow-inner"
                  >
                    <h4 className="font-semibold text-base flex items-center gap-2 text-foreground">
                      <FileText className="w-4 h-4 text-primary" />
                      Historical Facts
                    </h4>
                    <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-foreground/85 marker:text-primary/60">
                      {monument.facts.map((fact, index) => (
                        <li key={index} className="leading-relaxed">{fact}</li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {/* Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.4 }}
                  className="flex flex-col sm:flex-row gap-3 pt-1"
                >
                  <button
                    type="button"
                    onClick={isReading ? handleStop : handleSpeak}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl h-12 text-sm font-semibold transition-all duration-300 active:scale-95 shadow-lg overflow-hidden relative glass-button"
                    style={{
                      backgroundColor: isReading ? "hsl(var(--destructive)/0.8)" : "",
                    }}
                  >
                    {isReading ? (
                      <><VolumeX className="w-4 h-4" /> Stop Narration</>
                    ) : (
                      <><Volume2 className="w-4 h-4" /> Listen to Story</>
                    )}
                  </button>

                  {monument.latitude && monument.longitude && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${monument.latitude},${monument.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl h-12 text-sm font-semibold glass-panel hover:bg-white/20 dark:hover:bg-white/10 text-foreground transition-all duration-300 active:scale-95 border border-white/20"
                    >
                      <MapPin className="w-4 h-4 text-primary" />
                      Open in Maps
                    </a>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MonumentFlashCard;
