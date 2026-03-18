import { useState, useEffect, useCallback, useMemo } from "react";
import { MapContainer, TileLayer, Circle, Polyline, Popup, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity, AlertTriangle, Radio, Siren, Thermometer, Zap,
  Route, Eye, Brain, ChevronDown, ChevronUp, RefreshCw
} from "lucide-react";
import { intersections, roads, type IntersectionNode, type EmergencyVehicle } from "@/lib/itos/cityTopology";
import { dijkstra, astar, findGreenCorridor, type RouteResult } from "@/lib/itos/graphRouting";
import { optimizeSignals, type SignalAction } from "@/lib/itos/rlSignalOptimizer";
import { runIncidentDetection, type DetectedIncident, getWeatherCapacityFactor } from "@/lib/itos/incidentDetector";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const BHUBANESWAR: [number, number] = [20.2961, 85.8245];

const getNodeColor = (c: number) => (c > 80 ? "#ef4444" : c > 60 ? "#f59e0b" : c > 40 ? "#3b82f6" : "#22c55e");
const getSeverityColor = (s: string) => (s === "critical" ? "#ef4444" : s === "warning" ? "#f59e0b" : "#3b82f6");

const weatherOptions = [
  { label: "Clear", value: "clear", icon: "☀️" },
  { label: "Rain", value: "rain", icon: "🌧️" },
  { label: "Fog", value: "fog", icon: "🌫️" },
  { label: "Heavy Rain", value: "heavy_rain", icon: "⛈️" },
];

const ITOSDashboard = () => {
  const [nodes, setNodes] = useState<IntersectionNode[]>(intersections);
  const [weather, setWeather] = useState("clear");
  const [signals, setSignals] = useState<Map<string, { action: SignalAction; reward: number }>>(new Map());
  const [incidents, setIncidents] = useState<DetectedIncident[]>([]);
  const [emergency, setEmergency] = useState<EmergencyVehicle | null>(null);
  const [greenCorridor, setGreenCorridor] = useState<RouteResult | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<RouteResult | null>(null);
  const [routeFrom, setRouteFrom] = useState("N05");
  const [routeTo, setRouteTo] = useState("N09");
  const [routeAlgo, setRouteAlgo] = useState<"dijkstra" | "astar">("astar");
  const [showIncidents, setShowIncidents] = useState(true);
  const [rlStep, setRlStep] = useState(0);
  const [totalReward, setTotalReward] = useState(0);

  // Simulate dynamic traffic
  const simulateTraffic = useCallback(() => {
    const wFactor = getWeatherCapacityFactor(weather);
    setNodes((prev) =>
      prev.map((n) => ({
        ...n,
        queueLength: Math.max(0, Math.min(30, n.queueLength + Math.floor(Math.random() * 7) - 3)),
        congestion: Math.max(5, Math.min(99, n.congestion + Math.floor(Math.random() * 15) - 7)),
      }))
    );
  }, [weather]);

  // RL optimization loop
  const runRL = useCallback(() => {
    const signalNodes = nodes.filter((n) => n.type === "signal" || n.type === "major");
    const weatherNum = weather === "rain" ? 1 : weather === "fog" ? 2 : weather === "heavy_rain" ? 3 : 0;
    const results = optimizeSignals(
      signalNodes.map((n) => ({
        id: n.id,
        queueLength: n.queueLength,
        congestion: n.congestion,
        emergencyActive: emergency?.corridor.includes(n.id) ?? false,
      })),
      weatherNum
    );
    setSignals(results);
    setRlStep((s) => s + 1);
    let rwd = 0;
    results.forEach((v) => (rwd += v.reward));
    setTotalReward((t) => t + rwd);
  }, [nodes, weather, emergency]);

  // Incident detection
  const detectIncidents = useCallback(() => {
    const detected = runIncidentDetection(nodes);
    setIncidents(detected);
  }, [nodes]);

  useEffect(() => {
    const t1 = setInterval(simulateTraffic, 3000);
    const t2 = setInterval(runRL, 5000);
    const t3 = setInterval(detectIncidents, 4000);
    runRL();
    detectIncidents();
    return () => {
      clearInterval(t1);
      clearInterval(t2);
      clearInterval(t3);
    };
  }, [simulateTraffic, runRL, detectIncidents]);

  // Route calculation
  const calcRoute = () => {
    const fn = routeAlgo === "astar" ? astar : dijkstra;
    const result = fn(routeFrom, routeTo);
    setSelectedRoute(result);
  };

  // Emergency simulation
  const triggerEmergency = () => {
    const src = "N36"; // MKCG Hospital
    const tgt = "N05"; // Bus Stand (busy area)
    const corridor = findGreenCorridor(src, tgt);
    if (corridor) {
      setGreenCorridor(corridor);
      setEmergency({
        id: "AMB-001",
        type: "ambulance",
        currentNode: src,
        targetNode: tgt,
        corridor: corridor.path,
        eta: Math.round(corridor.totalTime),
        active: true,
      });
      // Clear after 30s
      setTimeout(() => {
        setEmergency(null);
        setGreenCorridor(null);
      }, 30000);
    }
  };

  // Get positions for route polyline
  const nodeMap = useMemo(() => new Map(intersections.map((n) => [n.id, n])), []);
  const routePositions = selectedRoute?.path.map((id) => nodeMap.get(id)!.position) ?? [];
  const corridorPositions = greenCorridor?.path.map((id) => nodeMap.get(id)!.position) ?? [];

  // Stats
  const avgCongestion = Math.round(nodes.reduce((s, n) => s + n.congestion, 0) / nodes.length);
  const criticalNodes = nodes.filter((n) => n.congestion > 80).length;
  const cctvCount = nodes.filter((n) => n.hasCCTV).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* ITOS Header */}
      <div className="bg-card/30 backdrop-blur-xl border border-primary/20 rounded-2xl p-5 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/20 border border-primary/30 shadow-[0_0_20px_rgba(var(--primary),0.5)]">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-black text-foreground uppercase tracking-widest">ITOS — Intelligent Traffic Optimization</h2>
              <p className="text-xs text-muted-foreground mt-0.5">50-Node Network • Multi-Objective RL • Real-time Adaptation</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/50 border border-border/50 text-xs font-mono">
              <Zap className="w-3.5 h-3.5 text-primary" />
              RL Step: <span className="text-primary font-bold">{rlStep}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/50 border border-border/50 text-xs font-mono">
              <Activity className="w-3.5 h-3.5 text-accent" />
              Reward: <span className="text-accent font-bold">{totalReward.toFixed(0)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Avg Congestion", value: `${avgCongestion}%`, color: getNodeColor(avgCongestion), icon: Activity },
          { label: "Critical Nodes", value: `${criticalNodes}/50`, color: criticalNodes > 10 ? "#ef4444" : "#f59e0b", icon: AlertTriangle },
          { label: "CCTV Online", value: `${cctvCount}`, color: "#22c55e", icon: Eye },
          { label: "Incidents", value: `${incidents.length}`, color: incidents.length > 3 ? "#ef4444" : "#3b82f6", icon: Radio },
        ].map((s) => (
          <motion.div
            key={s.label}
            whileHover={{ scale: 1.02 }}
            className="bg-card/30 backdrop-blur-xl border border-primary/10 rounded-xl p-4 flex items-center gap-3"
          >
            <div className="p-2 rounded-lg" style={{ backgroundColor: `${s.color}20`, border: `1px solid ${s.color}40` }}>
              <s.icon className="w-4 h-4" style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
              <p className="text-lg font-black font-mono" style={{ color: s.color }}>{s.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Controls Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Weather */}
        <div className="bg-card/30 backdrop-blur-xl border border-primary/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Thermometer className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-foreground uppercase tracking-wider">Weather Condition</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {weatherOptions.map((w) => (
              <button
                key={w.value}
                onClick={() => setWeather(w.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  weather === w.value
                    ? "bg-primary/20 border-primary/50 text-primary shadow-[0_0_10px_rgba(var(--primary),0.3)]"
                    : "bg-background/30 border-border/50 text-muted-foreground hover:border-primary/30"
                }`}
              >
                {w.icon} {w.label}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 font-mono">
            Capacity factor: {(getWeatherCapacityFactor(weather) * 100).toFixed(0)}%
          </p>
        </div>

        {/* Routing */}
        <div className="bg-card/30 backdrop-blur-xl border border-primary/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Route className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-foreground uppercase tracking-wider">Route Finder</span>
          </div>
          <div className="flex gap-2 mb-2">
            <select value={routeFrom} onChange={(e) => setRouteFrom(e.target.value)} className="flex-1 bg-background/50 border border-border/50 rounded-lg px-2 py-1 text-xs text-foreground">
              {nodes.map((n) => <option key={n.id} value={n.id}>{n.id}: {n.name}</option>)}
            </select>
            <select value={routeTo} onChange={(e) => setRouteTo(e.target.value)} className="flex-1 bg-background/50 border border-border/50 rounded-lg px-2 py-1 text-xs text-foreground">
              {nodes.map((n) => <option key={n.id} value={n.id}>{n.id}: {n.name}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <select value={routeAlgo} onChange={(e) => setRouteAlgo(e.target.value as any)} className="bg-background/50 border border-border/50 rounded-lg px-2 py-1 text-xs text-foreground">
              <option value="astar">A* Search</option>
              <option value="dijkstra">Dijkstra</option>
            </select>
            <button onClick={calcRoute} className="flex-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-primary/20 text-primary border border-primary/40 hover:bg-primary hover:text-primary-foreground transition-all">
              Find Route
            </button>
          </div>
          {selectedRoute && (
            <p className="text-[10px] text-muted-foreground mt-2 font-mono">
              {selectedRoute.path.length} nodes • {(selectedRoute.totalDistance / 1000).toFixed(1)}km • ~{Math.round(selectedRoute.totalTime)}s
            </p>
          )}
        </div>

        {/* Emergency */}
        <div className="bg-card/30 backdrop-blur-xl border border-primary/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Siren className="w-4 h-4 text-destructive" />
            <span className="text-xs font-bold text-foreground uppercase tracking-wider">Emergency Control</span>
          </div>
          <button
            onClick={triggerEmergency}
            disabled={!!emergency}
            className={`w-full px-4 py-2.5 rounded-lg text-xs font-bold border transition-all ${
              emergency
                ? "bg-destructive/20 border-destructive/50 text-destructive animate-pulse cursor-not-allowed"
                : "bg-destructive/10 border-destructive/30 text-destructive hover:bg-destructive hover:text-white"
            }`}
          >
            {emergency ? `🚑 AMBULANCE ACTIVE — ETA ${emergency.eta}s` : "🚑 Simulate Ambulance Emergency"}
          </button>
          {emergency && (
            <p className="text-[10px] text-destructive mt-2 font-mono animate-pulse">
              Green corridor: {emergency.corridor.join(" → ")}
            </p>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="bg-card/30 backdrop-blur-xl border border-primary/20 rounded-2xl p-5 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
        <div className="rounded-xl overflow-hidden border border-primary/20" style={{ height: 500 }}>
          <MapContainer center={BHUBANESWAR} zoom={13} style={{ height: "100%", width: "100%" }} zoomControl={false}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {/* Road connections as lines */}
            {roads.map((r, i) => {
              const from = nodeMap.get(r.from);
              const to = nodeMap.get(r.to);
              if (!from || !to) return null;
              const utilization = r.pcu / r.capacity;
              return (
                <Polyline
                  key={i}
                  positions={[from.position, to.position]}
                  pathOptions={{
                    color: utilization > 0.8 ? "#ef4444" : utilization > 0.6 ? "#f59e0b" : "#334155",
                    weight: Math.max(1, r.lanes),
                    opacity: 0.5,
                    dashArray: r.lanes === 1 ? "5 5" : undefined,
                  }}
                />
              );
            })}

            {/* Selected route overlay */}
            {routePositions.length > 1 && (
              <Polyline positions={routePositions} pathOptions={{ color: "#3b82f6", weight: 5, opacity: 0.9 }} />
            )}

            {/* Green corridor */}
            {corridorPositions.length > 1 && (
              <Polyline positions={corridorPositions} pathOptions={{ color: "#22c55e", weight: 6, opacity: 0.9, dashArray: "10 5" }} />
            )}

            {/* Intersection nodes */}
            {nodes.map((n) => {
              const sig = signals.get(n.id);
              const isOnCorridor = emergency?.corridor.includes(n.id);
              return (
                <Circle
                  key={n.id}
                  center={n.position}
                  radius={isOnCorridor ? 120 : n.type === "major" ? 100 : n.type === "signal" ? 70 : 50}
                  pathOptions={{
                    color: isOnCorridor ? "#22c55e" : getNodeColor(n.congestion),
                    fillColor: isOnCorridor ? "#22c55e" : getNodeColor(n.congestion),
                    fillOpacity: isOnCorridor ? 0.7 : 0.4,
                    weight: n.hasCCTV ? 3 : 1,
                  }}
                >
                  <Popup>
                    <div style={{ fontFamily: "monospace", fontSize: 12, background: "rgba(10,10,10,0.9)", backdropFilter: "blur(10px)", color: "#fff", padding: 12, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", minWidth: 200 }}>
                      <p style={{ fontWeight: 800, fontSize: 13, marginBottom: 8 }}>{n.id} — {n.name}</p>
                      <p>Type: <span style={{ color: "#60a5fa" }}>{n.type}</span></p>
                      <p>Congestion: <span style={{ color: getNodeColor(n.congestion), fontWeight: 700 }}>{n.congestion}%</span></p>
                      <p>Queue: <span style={{ color: n.queueLength > 15 ? "#ef4444" : "#22c55e" }}>{n.queueLength} vehicles</span></p>
                      <p>CCTV: {n.hasCCTV ? "✅ Online" : "❌ None"}</p>
                      {sig && (
                        <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                          <p style={{ fontWeight: 700, color: "#a78bfa" }}>RL Signal Optimization</p>
                          <p>🟢 NS: {sig.action.greenNS}s | EW: {sig.action.greenEW}s</p>
                          <p>🟡 Yellow: {sig.action.yellowDuration}s | 🚶 Ped: {sig.action.pedestrianPhase}s</p>
                          <p>Reward: <span style={{ color: sig.reward > 0 ? "#22c55e" : "#ef4444" }}>{sig.reward.toFixed(1)}</span></p>
                        </div>
                      )}
                      {isOnCorridor && <p style={{ color: "#22c55e", fontWeight: 700, marginTop: 8 }}>🚑 GREEN CORRIDOR ACTIVE</p>}
                    </div>
                  </Popup>
                </Circle>
              );
            })}
          </MapContainer>
        </div>

        {/* Legend */}
        <div className="flex gap-4 mt-4 justify-center flex-wrap">
          {[
            { color: "#22c55e", label: "Low (<40%)" },
            { color: "#3b82f6", label: "Moderate (40-60%)" },
            { color: "#f59e0b", label: "High (60-80%)" },
            { color: "#ef4444", label: "Critical (>80%)" },
          ].map((l) => (
            <span key={l.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color, boxShadow: `0 0 6px ${l.color}` }} />
              {l.label}
            </span>
          ))}
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-6 h-0.5 bg-blue-500 rounded" /> Route
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-6 h-0.5 bg-green-500 rounded border-dashed" /> Green Corridor
          </span>
        </div>
      </div>

      {/* Incidents Panel */}
      <div className="bg-card/30 backdrop-blur-xl border border-primary/10 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Live Incident Feed</h3>
            <span className="px-2 py-0.5 rounded-full bg-destructive/20 text-destructive text-[10px] font-bold">{incidents.length}</span>
          </div>
          <button onClick={() => setShowIncidents(!showIncidents)} className="text-muted-foreground hover:text-foreground">
            {showIncidents ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
        <AnimatePresence>
          {showIncidents && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-2 overflow-hidden"
            >
              {incidents.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">No active incidents detected</p>
              ) : (
                incidents.map((inc) => (
                  <div
                    key={inc.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-background/30 border"
                    style={{ borderColor: `${getSeverityColor(inc.severity)}30` }}
                  >
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: getSeverityColor(inc.severity) }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">{inc.message}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">
                        {inc.type.replace("_", " ")} • {new Date(inc.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                      style={{ backgroundColor: `${getSeverityColor(inc.severity)}20`, color: getSeverityColor(inc.severity) }}
                    >
                      {inc.severity}
                    </span>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* RL Signal Status Grid */}
      <div className="bg-card/30 backdrop-blur-xl border border-primary/10 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">RL Signal Optimization — Active Signals</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {Array.from(signals.entries())
            .sort((a, b) => (b[1].reward - a[1].reward))
            .slice(0, 18)
            .map(([id, { action, reward }]) => {
              const node = nodeMap.get(id);
              if (!node) return null;
              return (
                <div
                  key={id}
                  className="p-2.5 rounded-lg bg-background/30 border border-border/30 hover:border-primary/30 transition-all"
                >
                  <p className="text-[10px] font-bold text-foreground truncate">{node.name}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="flex gap-0.5">
                      <span className="w-2 h-4 rounded-sm bg-green-500" />
                      <span className="w-2 h-4 rounded-sm bg-yellow-500" />
                      <span className="w-2 h-4 rounded-sm bg-red-500 opacity-30" />
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {action.greenNS}s/{action.greenEW}s
                    </span>
                  </div>
                  <p className={`text-[10px] font-mono font-bold mt-1 ${reward > 0 ? "text-green-400" : "text-red-400"}`}>
                    R: {reward.toFixed(1)}
                  </p>
                </div>
              );
            })}
        </div>
      </div>
    </motion.div>
  );
};

export default ITOSDashboard;
