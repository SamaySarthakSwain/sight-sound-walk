import { motion } from "framer-motion";
import { Users, Car, AlertTriangle, ShieldCheck } from "lucide-react";
import { useWebRTC, PeerData } from "@/contexts/WebRTCContext";
import { useDetection } from "@/contexts/DetectionContext";

const getDensityInfo = (count: number) => {
  if (count > 10) return { label: "HIGH", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30" };
  if (count > 5) return { label: "MODERATE", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" };
  return { label: "LOW", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" };
};

const CrowdDensityOverview = () => {
  const { peers } = useWebRTC();
  const { personCount: localPersonCount, vehicleCount: localVehicleCount } = useDetection();
  
  const peerList = Object.values(peers) as PeerData[];
  const totalPersons = peerList.reduce((sum, p) => sum + (p.personCount || 0), 0) + localPersonCount;
  const totalVehicles = peerList.reduce((sum, p) => sum + (p.vehicleCount || 0), 0) + localVehicleCount;
  const totalNodes = peerList.length + 1;

  const density = getDensityInfo(totalPersons / Math.max(1, totalNodes));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <ShieldCheck className="w-24 h-24 text-primary" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {/* Overall Status */}
        <div className="space-y-4">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">Overall Status</p>
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl ${density.bg} ${density.border} border flex items-center justify-center`}>
              <AlertTriangle className={`w-8 h-8 ${density.color}`} />
            </div>
            <div>
              <h4 className={`text-2xl font-black ${density.color}`}>{density.label}</h4>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Average Crowd Level</p>
            </div>
          </div>
        </div>

        {/* Aggregated Metadata */}
        <div className="space-y-4">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">Global Metadata</p>
          <div className="flex gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <span className="text-xl font-black text-white block">{totalPersons}</span>
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Persons</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                <Car className="w-5 h-5 text-accent" />
              </div>
              <div>
                <span className="text-xl font-black text-white block">{totalVehicles}</span>
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Vehicles</span>
              </div>
            </div>
          </div>
        </div>

        {/* Coverage */}
        <div className="space-y-4">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">Network Coverage</p>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[...Array(Math.min(4, totalNodes))].map((_, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                  {i + 1}
                </div>
              ))}
              {totalNodes > 4 && (
                <div className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                  +{totalNodes - 4}
                </div>
              )}
            </div>
            <div>
              <span className="text-sm font-bold text-white block">{totalNodes} Active Nodes</span>
              <span className="text-[10px] text-success font-bold uppercase tracking-widest">Syncing Live</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CrowdDensityOverview;
