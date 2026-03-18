import { Users, Car, MapPin, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { useWebRTC, PeerData } from "@/contexts/WebRTCContext";
import { useDetection } from "@/contexts/DetectionContext";

const StatsCards = () => {
  const { peers } = useWebRTC();
  const { personCount: localPersonCount, vehicleCount: localVehicleCount } = useDetection();
  
  const peerList = Object.values(peers) as PeerData[];
  
  const connectedDevices = peerList.length + 1; // Peers + local
  const totalPersons = peerList.reduce((sum, p) => sum + (p.personCount || 0), 0) + localPersonCount;
  const totalVehicles = peerList.reduce((sum, p) => sum + (p.vehicleCount || 0), 0) + localVehicleCount;

  const stats = [
    {
      label: "Total Persons",
      value: totalPersons.toLocaleString(),
      change: "LIVE DATA",
      icon: Users,
      color: "primary",
    },
    {
      label: "Total Vehicles",
      value: totalVehicles.toLocaleString(),
      change: "LIVE DATA",
      icon: Car,
      color: "primary",
    },
    { 
      label: "Active Nodes", 
      value: connectedDevices.toString(), 
      change: "CONNECTED", 
      icon: MapPin, 
      color: "accent", 
    },
    { 
      label: "System Health", 
      value: "100%", 
      change: "OPTIMAL", 
      icon: Activity, 
      color: "success", 
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
          className="relative overflow-hidden bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-5 transition-all duration-300 hover:bg-black/60 hover:border-white/20 hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] group"
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* Glow effect based on color */}
          <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500 pointer-events-none ${s.color === "primary" ? "bg-primary" : s.color === "accent" ? "bg-accent" : "bg-destructive"
            }`} />

          <div className="flex items-center justify-between mb-4 relative z-10">
            <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">{s.label}</span>
            <div className={`p-2 rounded-lg bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-300 ${s.color === "primary" ? "text-primary shadow-[0_0_10px_rgba(var(--primary),0.2)]" : s.color === "accent" ? "text-accent shadow-[0_0_10px_rgba(var(--accent),0.2)]" : "text-destructive shadow-[0_0_10px_rgba(var(--destructive),0.2)]"}`}>
              <s.icon className="w-4 h-4" />
            </div>
          </div>

          <p className="text-3xl font-bold font-mono text-white mb-2 relative z-10">{s.value}</p>

          <div className="flex items-center gap-1.5 mt-1 relative z-10">
            <div className="relative flex items-center justify-center w-2 h-2">
              <span className="absolute inline-flex w-full h-full rounded-full bg-success opacity-75 animate-ping" />
              <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-success animate-pulse-glow" />
            </div>
            <span className="text-xs text-success font-mono font-semibold">{s.change}</span>
            <span className="text-xs text-muted-foreground ml-1">real-time</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;
