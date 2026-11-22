import { useState } from "react";
import { MapContainer, TileLayer, Polyline, Circle, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";
import { Navigation, AlertTriangle, CheckCircle2, ShieldCheck, Activity } from "lucide-react";
import { useWebRTC, PeerData } from "@/contexts/WebRTCContext";
import { useDetection } from "@/contexts/DetectionContext";

delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Real Bhubaneswar Arterial Corridors (Real geographic coordinates)
interface CorridorSegment {
  id: string;
  name: string;
  from: string;
  to: string;
  coords: [number, number][];
  density: number; // 0 - 100%
  speedKmH: number;
  freeFlowSpeed: number;
  status: "Normal" | "Moderate" | "Congested";
}

const BHUBANESWAR_CORRIDORS: CorridorSegment[] = [
  {
    id: "janpath-1",
    name: "Janpath Main Corridor",
    from: "Vani Vihar Square",
    to: "Master Canteen Station",
    coords: [
      [20.3012, 85.8504],
      [20.2925, 85.8480],
      [20.2810, 85.8450],
      [20.2676, 85.8441],
    ],
    density: 78,
    speedKmH: 22,
    freeFlowSpeed: 45,
    status: "Moderate",
  },
  {
    id: "nh16-rasulgarh",
    name: "NH-16 Bypass Highway",
    from: "Palasuni Overbridge",
    to: "Rasulgarh Major Interchange",
    coords: [
      [20.3150, 85.8750],
      [20.3080, 85.8700],
      [20.3012, 85.8654],
      [20.2910, 85.8590],
    ],
    density: 89,
    speedKmH: 14,
    freeFlowSpeed: 60,
    status: "Congested",
  },
  {
    id: "patia-expressway",
    name: "Nandankanan Road Corridor",
    from: "Jayadev Vihar",
    to: "Patia / KIIT Square",
    coords: [
      [20.3025, 85.8235],
      [20.3200, 85.8210],
      [20.3380, 85.8198],
      [20.3541, 85.8192],
    ],
    density: 64,
    speedKmH: 32,
    freeFlowSpeed: 50,
    status: "Moderate",
  },
  {
    id: "lingaraj-access",
    name: "Old Town Heritage Link",
    from: "Kalpana Square",
    to: "Lingaraj Temple Entrance",
    coords: [
      [20.2570, 85.8430],
      [20.2480, 85.8390],
      [20.2420, 85.8360],
      [20.2382, 85.8338],
    ],
    density: 82,
    speedKmH: 16,
    freeFlowSpeed: 35,
    status: "Congested",
  },
  {
    id: "khandagiri-arterial",
    name: "Khandagiri Caves Transit Way",
    from: "Baramunda Bus Terminal",
    to: "Khandagiri Square",
    coords: [
      [20.2760, 85.7980],
      [20.2680, 85.7920],
      [20.2594, 85.7865],
    ],
    density: 48,
    speedKmH: 40,
    freeFlowSpeed: 50,
    status: "Normal",
  },
  {
    id: "dhauli-connector",
    name: "Puri Road Shanti Stupa Branch",
    from: "Ravi Talkies Square",
    to: "Dhauli Peace Pagoda",
    coords: [
      [20.2460, 85.8460],
      [20.2200, 85.8430],
      [20.1925, 85.8394],
    ],
    density: 38,
    speedKmH: 48,
    freeFlowSpeed: 55,
    status: "Normal",
  },
];

const getStatusColor = (density: number) => {
  if (density > 80) return "#ef4444"; // Red
  if (density > 60) return "#f59e0b"; // Amber
  return "#10b981"; // Emerald
};

const CongestionMap = () => {
  const { peers } = useWebRTC();
  const { personCount, vehicleCount } = useDetection();
  const [selectedCorridor, setSelectedCorridor] = useState<CorridorSegment | null>(null);

  const peerList = Object.values(peers) as PeerData[];
  const activeCamerasCount = (personCount > 0 || vehicleCount > 0 ? 1 : 0) + peerList.length;

  return (
    <div className="relative overflow-hidden bg-card border border-border rounded-xl p-5 shadow-sm dark:shadow-[0_0_40px_rgba(0,0,0,0.3)] flex flex-col h-full group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-3 relative z-10 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-4 rounded-full bg-primary animate-pulse" />
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              Live Arterial Congestion Map
              <span className="text-[10px] font-mono font-normal text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Real Geographic Data
              </span>
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Bhubaneswar Urban Transit Corridors & Camera Feeds
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <Activity className="w-3.5 h-3.5 text-primary animate-pulse" />
          <span>{activeCamerasCount > 0 ? `${activeCamerasCount} Live Sensor Feeds` : "6 Transit Nodes"}</span>
        </div>
      </div>

      {/* Real Geographic Leaflet Map */}
      <div className="relative w-full h-[320px] rounded-lg overflow-hidden border border-border shadow-inner">
        <MapContainer
          center={[20.290, 85.835]}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          {/* Real Map Tiles — Esri World Dark Gray (Zero Watermarks) */}
          <TileLayer
            attribution='&copy; <a href="https://www.esri.com">Esri</a>, USGS'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
            maxZoom={16}
          />

          {/* Real Corridors rendered with color-coded congestion */}
          {BHUBANESWAR_CORRIDORS.map((corridor) => {
            const color = getStatusColor(corridor.density);
            return (
              <div key={corridor.id}>
                <Polyline
                  positions={corridor.coords}
                  pathOptions={{
                    color,
                    weight: 6,
                    opacity: 0.85,
                  }}
                  eventHandlers={{
                    click: () => setSelectedCorridor(corridor),
                  }}
                >
                  <Popup>
                    <div className="text-xs p-1 min-w-[180px]">
                      <p className="font-bold text-foreground text-sm">{corridor.name}</p>
                      <p className="text-muted-foreground text-[10px]">{corridor.from} → {corridor.to}</p>
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Congestion:</span>
                          <span className="font-bold" style={{ color }}>{corridor.density}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Flow Speed:</span>
                          <span className="font-mono font-semibold">{corridor.speedKmH} km/h</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Free Flow:</span>
                          <span className="font-mono text-muted-foreground">{corridor.freeFlowSpeed} km/h</span>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Polyline>

                {/* Terminus Markers */}
                <Circle
                  center={corridor.coords[corridor.coords.length - 1]}
                  radius={120}
                  pathOptions={{
                    color,
                    fillColor: color,
                    fillOpacity: 0.4,
                    weight: 2,
                  }}
                />
              </div>
            );
          })}
        </MapContainer>

        {/* Real-time Overlay Legend */}
        <div className="absolute top-2.5 right-2.5 z-[400] bg-slate-900/90 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-slate-700 text-[10px] space-y-1 shadow-md">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-slate-300">Free Flow (&lt;60%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-slate-300">Moderate (60-80%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-slate-300">Heavy (&gt;80%)</span>
          </div>
        </div>
      </div>

      {/* Selected Corridor Stats */}
      <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span className="text-muted-foreground">
            {selectedCorridor
              ? `${selectedCorridor.name}: ${selectedCorridor.speedKmH} km/h (${selectedCorridor.status})`
              : "Click any arterial line to inspect transit telemetry"}
          </span>
        </div>
        <span className="text-[11px] font-mono text-primary">GPS Georeferenced</span>
      </div>
    </div>
  );
};

export default CongestionMap;
