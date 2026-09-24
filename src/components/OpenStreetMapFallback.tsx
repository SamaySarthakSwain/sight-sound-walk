import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface OSMMarker {
  id: string;
  position: { lat: number; lng: number };
  title: string;
  description?: string;
}

interface OpenStreetMapFallbackProps {
  center: { lat: number; lng: number };
  zoom?: number;
  markers?: OSMMarker[];
  userLocation?: { lat: number; lng: number } | null;
  height?: string;
  onMarkerClick?: (id: string) => void;
  onMapClick?: (pos: { lat: number; lng: number }) => void;
  routePath?: { lat: number; lng: number }[];
}

const pinIcon = (color: string) =>
  L.divIcon({
    className: "",
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="${color}"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`,
    iconSize: [30, 30],
    iconAnchor: [15, 29],
  });

/**
 * Keyless OpenStreetMap map used whenever the Google Maps JS API can't load
 * (missing key, referrer restriction on localhost / custom domains, quota errors).
 */
const OpenStreetMapFallback = ({
  center,
  zoom = 10,
  markers = [],
  userLocation,
  height = "620px",
  onMarkerClick,
  onMapClick,
  routePath,
}: OpenStreetMapFallbackProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const clickRef = useRef(onMapClick);
  clickRef.current = onMapClick;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: [center.lat, center.lng],
      zoom,
      scrollWheelZoom: true,
      attributionControl: true,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);
    map.on("click", (e: L.LeafletMouseEvent) => {
      clickRef.current?.({ lat: e.latlng.lat, lng: e.latlng.lng });
    });
    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  // Keep view in sync
  useEffect(() => {
    mapRef.current?.setView([center.lat, center.lng], zoom);
  }, [center.lat, center.lng, zoom]);

  // Render markers + route
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    layer.clearLayers();

    markers.forEach((m) => {
      if (!Number.isFinite(m.position.lat) || !Number.isFinite(m.position.lng)) return;
      const marker = L.marker([m.position.lat, m.position.lng], { icon: pinIcon("#e07a3f") })
        .bindPopup(
          `<strong>${m.title}</strong>${m.description ? `<br/><span>${m.description}</span>` : ""}`
        )
        .addTo(layer);
      marker.on("click", () => onMarkerClick?.(m.id));
    });

    if (userLocation) {
      L.circleMarker([userLocation.lat, userLocation.lng], {
        radius: 8,
        color: "#ffffff",
        weight: 3,
        fillColor: "#4285F4",
        fillOpacity: 1,
      })
        .bindPopup("Your location")
        .addTo(layer);
    }

    if (routePath && routePath.length > 1) {
      L.polyline(
        routePath.map((p) => [p.lat, p.lng] as [number, number]),
        { color: "#e07a3f", weight: 5, opacity: 0.85 }
      ).addTo(layer);
    }
  }, [markers, userLocation, routePath, onMarkerClick]);

  return (
    <div
      ref={containerRef}
      style={{ height, width: "100%", borderRadius: "1rem", zIndex: 0 }}
      className="overflow-hidden"
    />
  );
};

export default OpenStreetMapFallback;
