import { useEffect } from "react";
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useWebRTC, PeerData } from "@/contexts/WebRTCContext";
import { useDetection } from "@/contexts/DetectionContext";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const BHUBANESWAR_CENTER: [number, number] = [20.2961, 85.8245];

const getCircleColor = (density: number) => {
  if (density > 85) return "#ef4444";
  if (density > 65) return "#f59e0b";
  return "#22c55e";
};

const AnimatedZoom = () => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.flyTo(BHUBANESWAR_CENTER, 13, { duration: 2 }), 500);
  }, [map]);
  return null;
};

const BerhampurMap = () => {
  const { peers, gpsCoords } = useWebRTC();
  const { personCount: localPersonCount, vehicleCount: localVehicleCount } = useDetection();

  const peerList = Object.values(peers) as PeerData[];

  // Build map points from connected cameras with GPS locations
  type CameraPoint = {
    name: string;
    position: [number, number];
    density: number;
    radius: number;
    hasGps: boolean;
  };

  const cameraPoints: CameraPoint[] = [];

  // Local camera with GPS
  if (localPersonCount > 0 || localVehicleCount > 0) {
    const pos: [number, number] = gpsCoords
      ? [gpsCoords.lat, gpsCoords.lng]
      : BHUBANESWAR_CENTER;
    cameraPoints.push({
      name: `Local Camera${gpsCoords ? " (GPS)" : ""}`,
      position: pos,
      density: Math.min(99, (localPersonCount + localVehicleCount) * 3),
      radius: 200,
      hasGps: !!gpsCoords,
    });
  }

  // Peer cameras with GPS
  peerList.forEach((p) => {
    const peerGps = p.gpsCoords;
    const pos: [number, number] = peerGps
      ? [peerGps.lat, peerGps.lng]
      : BHUBANESWAR_CENTER;
    if ((p.personCount || 0) > 0 || (p.vehicleCount || 0) > 0) {
      cameraPoints.push({
        name: `${p.username || "Device"} — ${p.location}${peerGps ? " (GPS)" : ""}`,
        position: pos,
        density: Math.min(99, ((p.personCount || 0) + (p.vehicleCount || 0)) * 3),
        radius: 200,
        hasGps: !!peerGps,
      });
    }
  });

  const hasData = cameraPoints.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-card border border-border rounded-lg p-4"
    >
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Bhubaneswar — Live Camera Coverage
        </h3>
      </div>
      <div className="rounded-lg overflow-hidden border border-border" style={{ height: 420 }}>
        <MapContainer
          center={BHUBANESWAR_CENTER}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <AnimatedZoom />
          {cameraPoints.map((point, i) => (
            <Circle
              key={`${point.name}-${i}`}
              center={point.position}
              radius={point.radius}
              pathOptions={{
                color: getCircleColor(point.density),
                fillColor: getCircleColor(point.density),
                fillOpacity: 0.35,
                weight: 2,
              }}
            >
              <Popup>
                <div className="text-xs font-sans">
                  <p className="font-bold text-sm">{point.name}</p>
                  <p>
                    Activity:{" "}
                    <span style={{ color: getCircleColor(point.density), fontWeight: 700 }}>
                      {point.density}%
                    </span>
                  </p>
                  {point.hasGps && (
                    <p className="text-[10px] mt-1">
                      📍 {point.position[0].toFixed(4)}, {point.position[1].toFixed(4)}
                    </p>
                  )}
                </div>
              </Popup>
            </Circle>
          ))}
        </MapContainer>
      </div>
      {!hasData && (
        <p className="text-xs text-muted-foreground text-center mt-3">
          Connect cameras to see live coverage data on the map. GPS-enabled devices will be placed at their real location.
        </p>
      )}
      <div className="flex gap-4 mt-3 justify-center">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="w-2.5 h-2.5 rounded-full bg-success" />Low (&lt;65%)
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="w-2.5 h-2.5 rounded-full bg-accent" />Medium (65-85%)
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="w-2.5 h-2.5 rounded-full bg-destructive" />High (&gt;85%)
        </span>
      </div>
    </motion.div>
  );
};

export default BerhampurMap;
