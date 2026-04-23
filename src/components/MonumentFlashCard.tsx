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
                onClick={toggleSummary}
                className="flex-[0.6] inline-flex items-center justify-center gap-1.5 rounded-xl h-11 text-sm font-medium glass-panel hover:bg-white/20 dark:hover:bg-white/10 text-foreground transition-all duration-300 active:scale-95 border-white/20"
              >
                <FileText className="w-4 h-4" />
                {showSummary ? "Hide" : "Facts"}
              </button>
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
    </div>
  );
};

export default MonumentFlashCard;
