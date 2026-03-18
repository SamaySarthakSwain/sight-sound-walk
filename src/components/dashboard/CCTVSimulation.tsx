import { motion } from "framer-motion";
import { Camera, Wifi, WifiOff, Users, Car } from "lucide-react";
import { useWebRTC, PeerData } from "@/contexts/WebRTCContext";
import { useDetection } from "@/contexts/DetectionContext";

const CCTVSimulation = () => {
  const { peers } = useWebRTC();
  const { personCount: localPersonCount, vehicleCount: localVehicleCount } = useDetection();

  const peerList = Object.values(peers) as PeerData[];

  // Build feeds from real connected cameras only
  type Feed = {
    id: string;
    name: string;
    online: boolean;
    personCount: number;
    vehicleCount: number;
  };

  const feeds: Feed[] = [];

  // Local camera
  feeds.push({
    id: "LOCAL",
    name: "Local Camera",
    online: localPersonCount > 0 || localVehicleCount > 0,
    personCount: localPersonCount,
    vehicleCount: localVehicleCount,
  });

  // Connected peers
  peerList.forEach((p) => {
    feeds.push({
      id: `peer-${feeds.length}`,
      name: `${p.username || "Device"} — ${p.location || "Unknown"}`,
      online: true,
      personCount: p.personCount || 0,
      vehicleCount: p.vehicleCount || 0,
    });
  });

  const onlineCount = feeds.filter((f) => f.online).length;
  const totalPersons = feeds.reduce((s, f) => s + f.personCount, 0);
  const totalVehicles = feeds.reduce((s, f) => s + f.vehicleCount, 0);

  return (
    <div className="bg-card/30 backdrop-blur-xl border border-primary/10 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">CCTV Network — Live Feeds</h3>
        </div>
        <div className="flex gap-3 text-xs font-mono text-muted-foreground">
          <span className="flex items-center gap-1"><Wifi className="w-3 h-3 text-green-400" />{onlineCount}/{feeds.length}</span>
          <span className="flex items-center gap-1"><Users className="w-3 h-3 text-blue-400" />{totalPersons}</span>
          <span className="flex items-center gap-1"><Car className="w-3 h-3 text-amber-400" />{totalVehicles}</span>
        </div>
      </div>

      {feeds.length <= 1 && !feeds[0]?.online ? (
        <div className="text-center py-8">
          <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">No cameras connected. Start your camera or scan the QR code to connect devices.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {feeds.map((feed, i) => (
            <motion.div
              key={feed.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              className={`relative rounded-lg overflow-hidden border transition-all ${
                feed.online
                  ? "bg-background/40 border-border/30 hover:border-primary/40"
                  : "bg-red-950/20 border-red-500/30"
              }`}
            >
              <div className="h-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative flex items-center justify-center">
                {feed.online ? (
                  <>
                    <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-30" />
                    <div className="text-[10px] font-mono text-green-400/60">LIVE FEED</div>
                    <div className="absolute top-1 right-1 flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-500/80 text-[8px] font-bold text-white">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />REC
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <WifiOff className="w-5 h-5 text-red-400" />
                    <span className="text-[10px] text-red-400 font-mono">WAITING</span>
                  </div>
                )}
              </div>

              <div className="p-2">
                <p className="text-[10px] font-bold text-foreground truncate">{feed.name}</p>
                {feed.online && (
                  <div className="flex gap-3 mt-1">
                    <span className="text-[10px] font-mono text-blue-400">👤 {feed.personCount}</span>
                    <span className="text-[10px] font-mono text-amber-400">🚗 {feed.vehicleCount}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CCTVSimulation;
