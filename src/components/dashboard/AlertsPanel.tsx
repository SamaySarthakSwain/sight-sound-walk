import { AlertTriangle, Info, XCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useWebRTC, PeerData } from "@/contexts/WebRTCContext";
import { useDetection } from "@/contexts/DetectionContext";

const iconMap = { critical: XCircle, warning: AlertTriangle, info: Info };
const colorMap = { critical: "text-destructive", warning: "text-accent", info: "text-primary" };
const bgMap = { critical: "bg-destructive/10 border-destructive/30", warning: "bg-accent/10 border-accent/30", info: "bg-primary/10 border-primary/30" };
const glowMap = { critical: "hover:shadow-[0_0_15px_rgba(var(--destructive),0.3)]", warning: "hover:shadow-[0_0_15px_rgba(var(--accent),0.3)]", info: "hover:shadow-[0_0_15px_rgba(var(--primary),0.3)]" };

type Alert = {
  id: number;
  level: "critical" | "warning" | "info";
  message: string;
  time: string;
  zone: string;
};

const AlertsPanel = () => {
  const { peers } = useWebRTC();
  const { personCount, vehicleCount } = useDetection();

  const peerList = Object.values(peers) as PeerData[];
  const totalPersons = peerList.reduce((sum, p) => sum + (p.personCount || 0), 0) + personCount;
  const totalVehicles = peerList.reduce((sum, p) => sum + (p.vehicleCount || 0), 0) + vehicleCount;

  // Generate real-time alerts based on camera data
  const alerts: Alert[] = [];
  let alertId = 1;

  if (totalPersons > 20) {
    alerts.push({ id: alertId++, level: "critical", message: `High crowd density detected: ${totalPersons} persons across cameras`, time: "Just now", zone: "Network" });
  } else if (totalPersons > 10) {
    alerts.push({ id: alertId++, level: "warning", message: `Moderate crowd detected: ${totalPersons} persons`, time: "Just now", zone: "Network" });
  }

  if (totalVehicles > 15) {
    alerts.push({ id: alertId++, level: "critical", message: `Heavy vehicle traffic: ${totalVehicles} vehicles detected`, time: "Just now", zone: "Network" });
  } else if (totalVehicles > 8) {
    alerts.push({ id: alertId++, level: "warning", message: `Vehicle traffic building: ${totalVehicles} vehicles`, time: "Just now", zone: "Network" });
  }

  peerList.forEach((p) => {
    if ((p.personCount || 0) > 10) {
      alerts.push({ id: alertId++, level: "warning", message: `${p.username || "Device"} reporting high crowd: ${p.personCount} persons`, time: "Just now", zone: p.location || "Unknown" });
    }
  });

  if (alerts.length === 0) {
    alerts.push({ id: alertId++, level: "info", message: "All zones normal. No alerts at this time.", time: "Just now", zone: "System" });
  }

  return (
    <div className="relative overflow-hidden bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-5 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col h-full">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

      <div className="flex items-center justify-between mb-5 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 rounded-full bg-accent animate-pulse-glow" />
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Live Alerts</h3>
        </div>
        {alerts.filter(a => a.level === "critical").length > 0 && (
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="text-xs font-mono bg-destructive/20 border border-destructive/50 text-destructive px-2.5 py-1 rounded-full animate-pulse-glow shadow-[0_0_10px_rgba(var(--destructive),0.2)]"
          >
            {alerts.filter(a => a.level === "critical").length} Critical
          </motion.span>
        )}
      </div>

      <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1 relative z-10">
        {alerts.map((a, i) => {
          const Icon = iconMap[a.level];
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4, ease: "easeOut" }}
              whileHover={{ scale: 1.02, x: 5 }}
              className={`group relative flex items-start gap-3 p-3.5 rounded-lg border backdrop-blur-md transition-all duration-300 cursor-pointer ${bgMap[a.level]} ${glowMap[a.level]}`}
            >
              <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none" />

              <div className={`p-1.5 rounded-md bg-white/5 border border-white/10 shrink-0 ${colorMap[a.level]}`}>
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-200 leading-snug font-medium group-hover:text-white transition-colors">{a.message}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] text-gray-400 font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 uppercase tracking-wider">{a.zone}</span>
                  <span className="text-[10px] text-gray-500 font-medium flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {a.time}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AlertsPanel;
