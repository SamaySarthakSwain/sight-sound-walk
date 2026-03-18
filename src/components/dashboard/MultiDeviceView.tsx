import { motion, AnimatePresence } from "framer-motion";
import { Camera, Users, Car, MapPin, Smartphone } from "lucide-react";
import { useWebRTC } from "../../contexts/WebRTCContext";
import { VideoPlayer } from "./VideoPlayer";

const MultiDeviceView = () => {
  const { peers, localStream, username, location } = useWebRTC();
  const peersList = Object.values(peers);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15 }}
      className="bg-card border border-border rounded-lg p-4"
    >
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Connected Devices — Live Feeds
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground font-mono">
            {peersList.length} devices online
          </span>
        </div>
      </div>

      {peersList.length === 0 ? (
        <div className="h-40 flex items-center justify-center border border-dashed border-border rounded-lg bg-secondary/20">
          <div className="text-center text-muted-foreground">
            <Camera className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm font-medium">No other devices connected yet</p>
            <p className="text-xs">Scan the QR code to join this session from another device.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <AnimatePresence>
            {peersList.map((peer, i) => (
              <motion.div
                key={peer.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
                className="relative group"
              >
                <div
                  className="rounded-xl border p-4 transition-all duration-300 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/30 hover:border-primary/60 hover:glow-primary"
                  style={{ perspective: 1000 }}
                >
                  {/* Status indicator */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-success animate-pulse-glow" />
                      <span className="text-[10px] font-mono text-muted-foreground uppercase">
                        live
                      </span>
                    </div>
                  </div>

                  {/* Camera preview */}
                  <div className="w-full h-32 rounded-lg bg-background/50 border border-border mb-3 flex items-center justify-center overflow-hidden">
                    {peer.stream ? (
                      <VideoPlayer stream={peer.stream} className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-6 h-6 text-muted-foreground/30" />
                    )}
                  </div>

                  {/* User info */}
                  <h4 className="text-sm font-bold text-foreground truncate">{peer.username || "Unknown User"}</h4>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-primary" />
                    <span className="text-[10px] text-muted-foreground truncate">{peer.location || "Unknown Location"}</span>
                  </div>

                  {/* Counts */}
                  <div className="flex gap-2 mt-3">
                    <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 border border-primary/20">
                      <Users className="w-3 h-3 text-primary" />
                      <span className="text-xs font-bold font-mono text-primary">{peer.personCount || 0}</span>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-accent/10 border border-accent/20">
                      <Car className="w-3 h-3 text-accent" />
                      <span className="text-xs font-bold font-mono text-accent">{peer.vehicleCount || 0}</span>
                      <span className="text-[8px] text-muted-foreground">veh</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default MultiDeviceView;
