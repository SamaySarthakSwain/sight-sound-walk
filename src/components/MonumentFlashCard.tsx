import React, { useState } from "react";
import { MapPin, Volume2, FileText, VolumeX, X, Calendar, Clock, BookOpen, Maximize2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Monument } from "@/hooks/useMonuments";
import { useAppTTS } from "@/hooks/useAppTTS";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface Props {
  monument: Monument;
  imageUrl: string;
}

const MonumentFlashCard = ({ monument, imageUrl }: Props) => {
  const [showSummary, setShowSummary] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { speak, stop, isSpeaking: isReading } = useAppTTS();

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
    const text = `${monument.title}. ${monument.longDescription || monument.description}`;
    speak(text);
  };

  const toggleSummary = () => {
    setShowSummary((prev) => !prev);
  };

  const fallbackImg = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&q=70";

  return (
    <>
      <div className="perspective-[2000px] w-full">
        <motion.div
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={() => setShowModal(true)}
          className="group relative rounded-3xl overflow-hidden glass-card glass-card-hover cursor-pointer"
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
            <div className="relative h-48 sm:h-56 overflow-hidden mt-2 mx-2 rounded-2xl shadow-lg ring-1 ring-black/5 dark:ring-white/10 group/img">
              {!imgLoaded && !imgError && (
                <Skeleton className="absolute inset-0 rounded-2xl" />
              )}
              <img
                src={imgError ? fallbackImg : imageUrl}
                alt={monument.title}
                className={`w-full h-full object-cover transition-transform duration-700 group-[.group/img]:hover:scale-110 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
                loading="lazy"
                onLoad={() => setImgLoaded(true)}
                onError={() => {
                  setImgError(true);
                  setImgLoaded(true);
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
              
              <div className="absolute inset-0 bg-black/40 opacity-0 group-[.group/img]:hover:opacity-100 transition-opacity flex items-center justify-center">
                <Maximize2 className="w-8 h-8 text-white drop-shadow-lg" />
              </div>

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
                className="flex gap-2 pt-2"
                style={{ transform: "translateZ(40px)" }}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isReading) stop();
                    else handleSpeak();
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl h-10 text-xs sm:text-sm font-medium transition-all duration-300 active:scale-95 shadow-lg overflow-hidden relative glass-button"
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
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSummary();
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl h-10 text-xs sm:text-sm font-medium glass-panel hover:bg-white/20 dark:hover:bg-white/10 text-foreground transition-all duration-300 active:scale-95 border-white/20"
                >
                  <FileText className="w-4 h-4" />
                  {showSummary ? "Hide" : "Facts"}
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowModal(true);
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl h-10 text-xs sm:text-sm font-medium glass-panel hover:bg-primary/20 bg-primary/10 text-primary transition-all duration-300 active:scale-95 border-primary/20"
                >
                  <BookOpen className="w-4 h-4" />
                  Details
                </button>
              </div>

              {/* Facts Section */}
              {showSummary && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
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

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent
          className="max-w-4xl w-[95vw] sm:w-full h-[92vh] sm:h-[85vh] max-h-[90vh] p-0 gap-0 flex flex-col overflow-hidden rounded-t-3xl sm:rounded-2xl border-border [&>button]:hidden"
        >
          <DialogTitle className="sr-only">{monument.title} – Details</DialogTitle>
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-2 rounded-full bg-background/90 hover:bg-muted text-foreground border border-border shadow-lg"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 min-w-0 scrollbar-thin">
            <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 w-full shrink-0 min-w-0">
              <img
                src={imgError ? fallbackImg : imageUrl}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
<div className="absolute bottom-6 left-6 sm:left-10 z-10 right-12 min-w-0">
                <Badge className="bg-primary/90 text-primary-foreground mb-3 backdrop-blur-md border border-primary/50 shadow-lg">
                    {monument.category}
                  </Badge>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-md break-words line-clamp-2">
                    {monument.title}
                  </h2>
                <div className="flex items-center gap-2 text-white/90 font-medium drop-shadow min-w-0">
                  <MapPin className="w-5 h-5 shrink-0" />
                  <span className="truncate">{monument.location}</span>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 md:p-10 space-y-6 sm:space-y-8 min-w-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 min-w-0">
                <div className="md:col-span-2 space-y-6 min-w-0">
                  <div className="min-w-0">
                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-foreground">
                      <BookOpen className="w-5 h-5 shrink-0 text-primary" />
                      About
                    </h3>
                    <p className="text-foreground/80 leading-relaxed text-lg break-words">
                      {monument.longDescription || monument.description}
                    </p>
                  </div>

                  {monument.history && (
                    <div className="min-w-0">
                      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-foreground">
                        <Clock className="w-5 h-5 shrink-0 text-primary" />
                        History
                      </h3>
                      <p className="text-foreground/80 leading-relaxed break-words">
                        {monument.history}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-6 min-w-0">
                  {monument.builtYear && (
                    <div className="glass-panel p-5 rounded-2xl relative overflow-hidden">
                      <div className="absolute -right-4 -top-4 w-16 h-16 bg-primary/20 blur-2xl rounded-full" />
                      <h4 className="text-sm text-foreground/60 mb-1 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Built Year
                      </h4>
                      <p className="text-xl font-semibold text-foreground">
                        {monument.builtYear}
                      </p>
                    </div>
                  )}

                  {monument.facts && monument.facts.length > 0 && (
                    <div className="glass-panel p-5 rounded-2xl">
                      <h4 className="font-semibold mb-4 flex items-center gap-2 text-foreground">
                        <FileText className="w-4 h-4 text-primary" />
                        Key Facts
                      </h4>
                      <ul className="space-y-3">
                        {monument.facts.map((fact, index) => (
                          <li key={index} className="flex gap-3 text-sm text-foreground/80">
                            <span className="w-2 h-2 rounded-full bg-primary/50 shrink-0 mt-1.5" />
                            <span className="leading-relaxed">{fact}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 sm:pt-6 flex justify-center border-t border-border">
                <button
                  type="button"
                  onClick={isReading ? stop : handleSpeak}
                  className="flex items-center gap-2 glass-button px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl text-sm sm:text-base font-medium shadow-xl hover:shadow-primary/20 transition-all active:scale-95"
                >
                  {isReading ? (
                    <><VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> Stop Audio Guide</>
                  ) : (
                    <><Volume2 className="w-4 h-4 sm:w-5 sm:h-5" /> Play Audio Tour</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MonumentFlashCard;
