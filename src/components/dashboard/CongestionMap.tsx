import { motion } from "framer-motion";
import { useWebRTC, PeerData } from "@/contexts/WebRTCContext";
import { useDetection } from "@/contexts/DetectionContext";

const getColor = (d: number) => d > 80 ? "destructive" : d > 60 ? "accent" : "success";
const getShadowColor = (d: number) => d > 80 ? "rgba(var(--destructive), 0.5)" : d > 60 ? "rgba(var(--accent), 0.5)" : "rgba(var(--success), 0.5)";

const CongestionMap = () => {
  const { peers } = useWebRTC();
  const { personCount, vehicleCount } = useDetection();

  const peerList = Object.values(peers) as PeerData[];

  // Build zones from real camera data
  type Zone = { id: string; x: number; y: number; density: number; label: string };
  const zones: Zone[] = [];

  if (personCount > 0 || vehicleCount > 0) {
    zones.push({ id: "L", x: 50, y: 50, density: Math.min(99, (personCount + vehicleCount) * 5), label: "Local Camera" });
  }

  peerList.forEach((p, i) => {
    const count = (p.personCount || 0) + (p.vehicleCount || 0);
    if (count > 0) {
      const positions = [
        { x: 25, y: 30 }, { x: 75, y: 30 }, { x: 25, y: 70 }, { x: 75, y: 70 },
      ];
      const pos = positions[i % positions.length];
      zones.push({
        id: `P${i}`,
        x: pos.x,
        y: pos.y,
        density: Math.min(99, count * 5),
        label: `${p.username || "Device"} — ${p.location || "Unknown"}`,
      });
    }
  });

  return (
    <div className="relative overflow-hidden bg-card border border-border rounded-xl p-5 shadow-sm dark:shadow-[0_0_40px_rgba(0,0,0,0.3)] flex flex-col h-full group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent pointer-events-none" />

      <div className="flex items-center gap-2 mb-4 relative z-10">
        <div className="w-1.5 h-4 rounded-full bg-primary animate-pulse" />
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Live Congestion Map</h3>
      </div>

      <div className="relative w-full h-[300px] rounded-lg overflow-hidden grid-bg border border-border shadow-inner">
        <div className="absolute inset-0 scanline opacity-30 mix-blend-overlay" />
        <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="roadGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(220 20% 30%)" stopOpacity="0" />
              <stop offset="50%" stopColor="hsl(220 20% 40%)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="hsl(220 20% 30%)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <line x1="5" y1="30" x2="95" y2="30" stroke="url(#roadGradient1)" strokeWidth="0.8" />
          <line x1="5" y1="60" x2="95" y2="60" stroke="url(#roadGradient1)" strokeWidth="0.8" />
          <line x1="30" y1="5" x2="30" y2="95" stroke="url(#roadGradient1)" strokeWidth="0.8" />
          <line x1="60" y1="5" x2="60" y2="95" stroke="url(#roadGradient1)" strokeWidth="0.8" />
        </svg>

        {zones.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-xs text-muted-foreground font-mono">Connect cameras to see live congestion data</p>
          </div>
        ) : (
          zones.map((z, i) => {
            const c = getColor(z.density);
            const shadowColor = getShadowColor(z.density);
            return (
              <motion.div
                key={z.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1 + 0.3, type: "spring", stiffness: 200, damping: 15 }}
                whileHover={{ scale: 1.15, zIndex: 20 }}
                className="absolute group/zone cursor-crosshair"
                style={{ left: `${z.x}%`, top: `${z.y}%`, transform: "translate(-50%, -50%)" }}
              >
                <div className={`relative z-10 w-11 h-11 rounded-full flex items-center justify-center border-2 backdrop-blur-md transition-all duration-300
                  ${c === "destructive" ? "border-destructive bg-destructive/30 text-white" :
                    c === "accent" ? "border-accent bg-accent/30 text-white" :
                      "border-success bg-success/30 text-white"}`}
                  style={{ boxShadow: `0 0 15px ${shadowColor}` }}>
                  <span className="text-xs font-mono font-bold">{z.density}%</span>
                </div>

                <div className={`absolute -inset-2 rounded-full animate-ping opacity-20 pointer-events-none
                  ${c === "destructive" ? "bg-destructive" : c === "accent" ? "bg-accent" : "bg-success"}`} />

                <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-popover border border-border rounded-lg px-3 py-2 opacity-0 group-hover/zone:opacity-100 transition-opacity whitespace-nowrap z-20 shadow-xl pointer-events-none">
                  <p className="text-sm font-semibold text-popover-foreground mb-0.5">{z.label}</p>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      <div className="flex gap-5 mt-5 justify-center relative z-10 flex-wrap">
        <div className="flex items-center gap-2 bg-muted/80 rounded-full px-3 py-1 border border-border">
          <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success shadow-[0_0_5px_rgba(var(--success),0.5)]"></span></span>
          <span className="text-xs text-foreground font-medium">Low Traffic</span>
        </div>
        <div className="flex items-center gap-2 bg-muted/80 rounded-full px-3 py-1 border border-border">
          <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" style={{ animationDuration: '1.5s' }}></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent shadow-[0_0_5px_rgba(var(--accent),0.5)]"></span></span>
          <span className="text-xs text-foreground font-medium">Medium</span>
        </div>
        <div className="flex items-center gap-2 bg-muted/80 rounded-full px-3 py-1 border border-border">
          <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" style={{ animationDuration: '1s' }}></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-destructive shadow-[0_0_5px_rgba(var(--destructive),0.5)]"></span></span>
          <span className="text-xs text-foreground font-medium">High Traffic</span>
        </div>
      </div>
    </div>
  );
};

export default CongestionMap;
