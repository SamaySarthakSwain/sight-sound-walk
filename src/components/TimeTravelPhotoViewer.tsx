import { useState, useMemo, useEffect } from "react";
import { X, Calendar, Info, ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import type { ARModel, HistoricalPhoto } from "@/data/arModels";
import { motion, AnimatePresence } from "framer-motion";

interface TimeTravelPhotoViewerProps {
  model: ARModel;
  onClose: () => void;
}

const TimeTravelPhotoViewer = ({ model, onClose }: TimeTravelPhotoViewerProps) => {
  const photos = useMemo(() => {
    if (!model.historicalPhotos || model.historicalPhotos.length === 0) {
      // Fallback if no specific historical photos are provided
      return [
        { year: 1900, url: "https://images.unsplash.com/photo-1548013146-72479768b921?auto=format&fit=crop&q=80&w=1200", caption: "Vintage depiction from the early 20th century." },
        { year: 1960, url: "https://images.unsplash.com/photo-1524492707947-2f85a643199c?auto=format&fit=crop&q=80&w=1200", caption: "Mid-century architectural study." },
        { year: 2024, url: model.embedUrl.includes("sketchfab") ? "https://images.unsplash.com/photo-1590050752117-2ba079ca9631?auto=format&fit=crop&q=80&w=1200" : model.embedUrl, caption: "Modern day high-fidelity capture." }
      ] as HistoricalPhoto[];
    }
    return [...model.historicalPhotos].sort((a, b) => a.year - b.year);
  }, [model]);

  const minYear = photos[0].year;
  const maxYear = photos[photos.length - 1].year;

  const [selectedYear, setSelectedYear] = useState(maxYear);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  // Find the closest photo for the selected year
  const activePhoto = useMemo(() => {
    return photos.reduce((prev, curr) => {
      return Math.abs(curr.year - selectedYear) < Math.abs(prev.year - selectedYear) ? curr : prev;
    });
  }, [selectedYear, photos]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setSelectedYear((prev) => {
          if (prev >= maxYear) {
            setIsAutoPlaying(false);
            return maxYear;
          }
          return prev + 1;
        });
      }, 50);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoPlaying, maxYear]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex items-center justify-between z-10 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex flex-col gap-1">
          <Badge variant="outline" className="w-fit border-orange-500/50 text-orange-400 bg-orange-500/10 gap-1.5 px-3 py-1">
            <Calendar className="h-3.5 w-3.5" />
            Time Travel Mode
          </Badge>
          <h2 className="text-xl md:text-3xl font-bold text-white tracking-tight">{model.name}</h2>
          <p className="text-sm text-gray-400 font-medium">{model.location}</p>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="rounded-full bg-white/10 hover:bg-white/20 text-white h-12 w-12"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative flex items-center justify-center p-4 md:p-12 mt-16 mb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePhoto.url}
            initial={{ opacity: 0, scale: 0.95, filter: "grayscale(100%)" }}
            animate={{ opacity: 1, scale: 1, filter: selectedYear < 1950 ? "grayscale(50%) sepia(30%)" : "grayscale(0%)" }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative max-w-5xl w-full aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10"
          >
            <img 
              src={activePhoto.url} 
              alt={activePhoto.caption}
              className="w-full h-full object-cover"
            />
            {/* Overlay Info */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent text-white">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                key={activePhoto.caption}
                className="space-y-2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-4xl md:text-6xl font-black text-orange-500 italic tabular-nums">
                    {activePhoto.year}
                  </span>
                  <div className="h-4 w-px bg-white/20 mx-2" />
                  <p className="text-sm md:text-lg font-medium text-gray-200 max-w-xl line-clamp-2">
                    {activePhoto.caption}
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <div className="absolute left-6 hidden md:block">
          <Button 
            variant="ghost" 
            size="icon" 
            disabled={selectedYear === minYear}
            onClick={() => setSelectedYear(prev => {
              const prevIdx = photos.findIndex(p => p.year === activePhoto.year) - 1;
              return prevIdx >= 0 ? photos[prevIdx].year : minYear;
            })}
            className="h-16 w-16 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
        </div>
        <div className="absolute right-6 hidden md:block">
          <Button 
            variant="ghost" 
            size="icon" 
            disabled={selectedYear === maxYear}
            onClick={() => setSelectedYear(prev => {
              const nextIdx = photos.findIndex(p => p.year === activePhoto.year) + 1;
              return nextIdx < photos.length ? photos[nextIdx].year : maxYear;
            })}
            className="h-16 w-16 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
        <div className="max-w-4xl mx-auto space-y-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="text-center">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Timeline</span>
                <span className="text-2xl font-black text-white tabular-nums">{selectedYear}</span>
              </div>
            </div>
            <div className="flex gap-2">
               <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className={`rounded-full gap-2 border-white/10 ${isAutoPlaying ? "bg-orange-600 text-white border-orange-500" : "bg-white/5 text-white"}`}
              >
                {isAutoPlaying ? "Pause Journey" : "Begin Journey"}
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="relative pt-2 pb-6">
            <div className="absolute top-0 left-0 right-0 flex justify-between px-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest pointer-events-none">
              <span>{minYear}</span>
              <span>Present Day</span>
            </div>
            <Slider
              value={[selectedYear]}
              min={minYear}
              max={maxYear}
              step={1}
              onValueChange={(val) => {
                setSelectedYear(val[0]);
                setIsAutoPlaying(false);
              }}
              className="cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Background Ambience */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-orange-600/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
      </div>
    </motion.div>
  );
};

export default TimeTravelPhotoViewer;
