import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, Users, Car, Clock, Trash2 } from "lucide-react";
import { useDetection } from "@/contexts/DetectionContext";

type HistoryEntry = {
  id: string;
  timestamp: Date;
  persons: number;
  vehicles: number;
};

const DetectionHistory = () => {
  const { personCount, vehicleCount } = useDetection();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const isActive = personCount > 0 || vehicleCount > 0;

  // Log every 5 seconds when camera is active
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setHistory((prev) => [
        {
          id: Date.now().toString(),
          timestamp: new Date(),
          persons: personCount,
          vehicles: vehicleCount,
        },
        ...prev,
      ].slice(0, 50)); // Keep last 50 entries
    }, 5000);
    return () => clearInterval(interval);
  }, [isActive, personCount, vehicleCount]);

  const clearHistory = () => setHistory([]);

  const getPersonLevel = (count: number) => {
    if (count > 10) return "destructive";
    if (count > 5) return "accent";
    return "success";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-card/30 backdrop-blur-xl border border-primary/20 rounded-2xl p-5 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="flex items-center justify-between mb-5 flex-wrap gap-2 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.5)]">
            <History className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-foreground uppercase tracking-widest text-glow">
            Detection History
          </h3>
          <span className="text-[10px] font-mono text-muted-foreground bg-background/50 px-2 py-0.5 rounded border border-border/50">
            {history.length} entries
          </span>
        </div>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-destructive/20 text-destructive border border-destructive/40 hover:bg-destructive hover:text-destructive-foreground hover:shadow-[0_0_20px_rgba(var(--destructive),0.8)] transition-all duration-300"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 gap-3 relative z-10">
          <div className="w-16 h-16 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center">
            <History className="w-8 h-8 text-primary/30" />
          </div>
          <p className="text-xs text-muted-foreground font-mono">
            {isActive ? "Recording will start shortly..." : "Start camera to begin recording history"}
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[320px] overflow-y-auto pr-2 relative z-10 custom-scrollbar">
          <AnimatePresence initial={false}>
            {history.map((entry, i) => {
              const level = getPersonLevel(entry.persons);
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`flex items-center gap-3 p-3 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] shadow-sm ${level === "destructive"
                      ? "bg-destructive/10 border-destructive/30 hover:shadow-[0_0_15px_rgba(var(--destructive),0.3)]"
                      : level === "accent"
                        ? "bg-accent/10 border-accent/30 hover:shadow-[0_0_15px_rgba(var(--accent),0.3)]"
                        : "bg-success/10 border-success/30 hover:shadow-[0_0_15px_rgba(var(--success),0.3)]"
                    }`}
                >
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    {entry.timestamp.toLocaleTimeString()}
                  </div>

                  <div className="flex items-center gap-4 flex-1 justify-center">
                    <div className="flex items-center gap-1.5">
                      <Users className={`w-3.5 h-3.5 ${level === "destructive" ? "text-destructive" : level === "accent" ? "text-accent" : "text-success"
                        }`} />
                      <span className={`text-sm font-bold font-mono ${level === "destructive" ? "text-destructive" : level === "accent" ? "text-accent" : "text-success"
                        }`} style={{ textShadow: `0 0 10px ${level === "destructive" ? "rgba(var(--destructive),0.5)" : level === "accent" ? "rgba(var(--accent),0.5)" : "rgba(var(--success),0.5)"}` }}>
                        {entry.persons}
                      </span>
                    </div>
                    <div className="w-px h-4 bg-border/50" />
                    <div className="flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-accent" />
                      <span className="text-sm font-bold font-mono text-accent" style={{ textShadow: "0 0 10px rgba(var(--accent),0.5)" }}>{entry.vehicles}</span>
                    </div>
                  </div>

                  {/* Visual density bar */}
                  <div className="w-20 h-2 bg-background/50 rounded-full overflow-hidden border border-white/5 shadow-inner hidden sm:block">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${level === "destructive" ? "bg-destructive shadow-[0_0_8px_rgba(var(--destructive),0.8)]" : level === "accent" ? "bg-accent shadow-[0_0_8px_rgba(var(--accent),0.8)]" : "bg-success shadow-[0_0_8px_rgba(var(--success),0.8)]"
                        }`}
                      style={{ width: `${Math.min(100, entry.persons * 5)}%` }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default DetectionHistory;
