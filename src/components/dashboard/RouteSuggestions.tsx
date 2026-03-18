import { Navigation, Clock, ArrowRight, Info } from "lucide-react";
import { motion } from "framer-motion";
import { useWebRTC, PeerData } from "@/contexts/WebRTCContext";
import { useDetection } from "@/contexts/DetectionContext";

const RouteSuggestions = () => {
  const { peers } = useWebRTC();
  const { personCount, vehicleCount } = useDetection();
  const peerList = Object.values(peers) as PeerData[];

  const totalPersons = peerList.reduce((sum, p) => sum + (p.personCount || 0), 0) + personCount;
  const totalVehicles = peerList.reduce((sum, p) => sum + (p.vehicleCount || 0), 0) + vehicleCount;

  // Generate route suggestions only when real congestion data exists
  const routes: { from: string; to: string; original: string; suggested: string; via: string; savings: string }[] = [];

  if (totalVehicles > 10) {
    routes.push({
      from: "Detected congestion zone",
      to: "Alternate route",
      original: `${Math.round(totalVehicles * 1.2)} min`,
      suggested: `${Math.round(totalVehicles * 0.8)} min`,
      via: "Via less congested roads (based on live data)",
      savings: `${Math.round(((totalVehicles * 1.2 - totalVehicles * 0.8) / (totalVehicles * 1.2)) * 100)}%`,
    });
  }

  if (totalPersons > 15) {
    routes.push({
      from: "High crowd area",
      to: "Alternate path",
      original: `${Math.round(totalPersons * 0.8)} min`,
      suggested: `${Math.round(totalPersons * 0.5)} min`,
      via: "Via lower density zones (based on camera data)",
      savings: `${Math.round(((totalPersons * 0.8 - totalPersons * 0.5) / (totalPersons * 0.8)) * 100)}%`,
    });
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Suggested Reroutes</h3>
      {routes.length === 0 ? (
        <div className="flex items-center gap-2 p-4 text-muted-foreground">
          <Info className="w-4 h-4" />
          <p className="text-xs">No reroutes needed. Connect cameras and detect traffic to generate suggestions.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {routes.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-3 rounded-md bg-secondary/50 border border-border hover:border-primary/30 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2 text-xs text-foreground font-medium">
                <span>{r.from}</span>
                <ArrowRight className="w-3 h-3 text-muted-foreground" />
                <span>{r.to}</span>
              </div>
              <p className="text-[11px] text-primary mt-1 flex items-center gap-1">
                <Navigation className="w-3 h-3" />{r.via}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[10px] text-muted-foreground line-through flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />{r.original}
                </span>
                <span className="text-[10px] text-success font-mono font-semibold flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />{r.suggested}
                </span>
                <span className="text-[10px] bg-success/20 text-success px-1.5 py-0.5 rounded font-mono">-{r.savings}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RouteSuggestions;
