import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";
import { Layers, RefreshCw } from "lucide-react";
import { useWebRTC, PeerData } from "@/contexts/WebRTCContext";
import { useDetection } from "@/contexts/DetectionContext";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const BHUBANESWAR_CENTER: [number, number] = [20.2961, 85.8245];

type Road = {
  name: string;
  position: [number, number];
  density: number;
  radius: number;
};

const getColor = (d: number) => (d > 80 ? "#ef4444" : d > 60 ? "#f59e0b" : "#22c55e");

const TrafficDensityMap = () => {
  const { peers } = useWebRTC();
  const { personCount: localPersonCount, vehicleCount: localVehicleCount } = useDetection();
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const peerList = Object.values(peers) as PeerData[];

  // Build roads from live camera data only
  const roads: Road[] = [];

  // Add local camera if active
  if (localPersonCount > 0 || localVehicleCount > 0) {
    roads.push({
      name: "Local Camera",
      position: BHUBANESWAR_CENTER,
      density: Math.min(99, (localPersonCount + localVehicleCount) * 5),
      radius: 250,
    });
  }

  // Add peer camera feeds
  peerList.forEach((p) => {
    if ((p.personCount || 0) > 0 || (p.vehicleCount || 0) > 0) {
      roads.push({
        name: `${p.username || "Device"} — ${p.location || "Unknown"}`,
        position: BHUBANESWAR_CENTER, // Would use real GPS
        density: Math.min(99, ((p.personCount || 0) + (p.vehicleCount || 0)) * 5),
        radius: 200,
      });
    }
  });

  const refreshData = () => setLastUpdated(new Date());

  useEffect(() => {
    const interval = setInterval(refreshData, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="bg-card/30 backdrop-blur-xl border border-primary/20 rounded-2xl p-5 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="flex items-center justify-between mb-5 flex-wrap gap-2 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.5)]">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-foreground uppercase tracking-widest text-glow">
            Live Traffic Density — Bhubaneswar
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-muted-foreground font-mono bg-background/50 px-2 py-1 rounded border border-border/50">
            Updated: {lastUpdated.toLocaleTimeString()}
          </span>
          <button
            onClick={refreshData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary/20 text-primary border border-primary/40 hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_20px_rgba(var(--primary),0.8)] transition-all duration-300"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden border border-primary/20 shadow-[0_0_20px_rgba(var(--primary),0.1)] relative z-10" style={{ height: 400 }}>
        <MapContainer
          center={BHUBANESWAR_CENTER}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          {roads.map((road, i) => (
            <Circle
              key={`${road.name}-${i}`}
              center={road.position}
              radius={road.radius}
              pathOptions={{
                color: getColor(road.density),
                fillColor: getColor(road.density),
                fillOpacity: 0.5,
                weight: 2,
              }}
            >
              <Popup className="glass-popup">
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, background: "rgba(10,10,10,0.8)", backdropFilter: "blur(10px)", color: "#fff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <p style={{ fontWeight: 800, marginBottom: 6, letterSpacing: "0.5px" }}>{road.name}</p>
                  <p>
                    Traffic Density:{" "}
                    <span style={{ color: getColor(road.density), fontWeight: 800, textShadow: `0 0 10px ${getColor(road.density)}` }}>
                      {road.density}%
                    </span>
                  </p>
                  <p style={{ fontSize: 11, color: "#aaa", marginTop: 4 }}>
                    Status: {road.density > 80 ? "🔴 Heavy" : road.density > 60 ? "🟡 Moderate" : "🟢 Light"}
                  </p>
                </div>
              </Popup>
            </Circle>
          ))}
        </MapContainer>
      </div>

      {roads.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center mt-5 relative z-10">
          No camera data available. Connect cameras to see live traffic density.
        </p>
      ) : (
        <div className="mt-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 relative z-10">
          {roads
            .sort((a, b) => b.density - a.density)
            .map((r, i) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                key={`${r.name}-${i}`}
                className="group/item flex items-center gap-3 p-2.5 rounded-lg bg-background/40 hover:bg-background/60 border border-white/5 hover:border-primary/30 transition-all duration-300"
              >
                <div
                  className="relative flex items-center justify-center w-6 h-6 rounded-full shrink-0 outline outline-1 outline-offset-2"
                  style={{ outlineColor: `${getColor(r.density)}50` }}
                >
                  <span
                    className="w-3 h-3 rounded-full absolute"
                    style={{ backgroundColor: getColor(r.density), boxShadow: `0 0 10px ${getColor(r.density)}` }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] text-foreground/90 font-semibold truncate group-hover/item:text-primary transition-colors">{r.name}</p>
                  <p className="text-[11px] font-mono font-bold" style={{ color: getColor(r.density), textShadow: `0 0 8px ${getColor(r.density)}50` }}>
                    {r.density}%
                  </p>
                </div>
              </motion.div>
            ))}
        </div>
      )}
    </motion.div>
  );
};

export default TrafficDensityMap;
