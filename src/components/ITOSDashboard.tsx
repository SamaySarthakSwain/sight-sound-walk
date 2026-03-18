import { useState, useEffect, useCallback, useMemo } from "react";
import { MapContainer, TileLayer, Circle, Polyline, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity, AlertTriangle, Radio, Siren, Thermometer, Zap,
  Route, Eye, Brain, ChevronDown, ChevronUp, Map as MapIcon
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

// Custom theme colors for sight-sound-walk (Teal/Emerald scale)
const getNodeColor = (c: number) => (c > 80 ? "#ef4444" : c > 60 ? "#f59e0b" : c > 40 ? "#14b8a6" : "#10b981");
const getSeverityColor = (s: string) => (s === "critical" ? "#ef4444" : s === "warning" ? "#f59e0b" : "#14b8a6");

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
    <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-6 shadow-xl overflow-hidden mt-8 w-full max-w-5xl mx-auto mb-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        {/* ITOS Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent flex items-center gap-3">
              <MapIcon className="w-6 h-6 text-orange-500" />
              ITOS Traffic Management
            </h2>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted border border-border text-xs font-mono text-muted-foreground">
              <Zap className="w-3.5 h-3.5 text-orange-500" />
              RL Step: <span className="text-orange-500 font-bold">{rlStep}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted border border-border text-xs font-mono text-muted-foreground">
              <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Reward: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{totalReward.toFixed(0)}</span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Avg Congestion", value: `${avgCongestion}%`, color: getNodeColor(avgCongestion), icon: Activity },
            { label: "Critical Nodes", value: `${criticalNodes}/50`, color: criticalNodes > 10 ? "#ef4444" : "#f59e0b", icon: AlertTriangle },
            { label: "CCTV Online", value: `${cctvCount}`, color: "#10b981", icon: Eye },
            { label: "Incidents", value: `${incidents.length}`, color: incidents.length > 3 ? "#ef4444" : "#14b8a6", icon: Radio },
          ].map((s) => (
            <motion.div
              key={s.label}
              whileHover={{ scale: 1.02 }}
              className="bg-muted/30 border border-border rounded-xl p-4 flex items-center gap-3"
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
          <div className="bg-muted/30 border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Thermometer className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-bold text-foreground uppercase tracking-wider">Weather Factor</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {weatherOptions.map((w) => (
                <button
                  key={w.value}
                  onClick={() => setWeather(w.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    weather === w.value
                      ? "bg-teal-500/20 border-teal-500/50 text-teal-400 shadow-[0_0_10px_rgba(20,184,166,0.2)]"
                      : "bg-black/40 border-white/10 text-white/50 hover:border-white/30"
                  }`}
                >
                  {w.icon} {w.label}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 font-mono">
              Capacity capacity: {(getWeatherCapacityFactor(weather) * 100).toFixed(0)}%
            </p>
          </div>

          {/* Routing */}
          <div className="bg-muted/30 border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Route className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-bold text-foreground uppercase tracking-wider">Optimal Route</span>
            </div>
            <div className="flex gap-2 mb-2">
              <select value={routeFrom} onChange={(e) => setRouteFrom(e.target.value)} className="flex-1 bg-background border border-border rounded-lg px-2 py-1 text-xs text-foreground">
                {nodes.map((n) => <option key={n.id} value={n.id}>{n.id}: {n.name}</option>)}
              </select>
              <select value={routeTo} onChange={(e) => setRouteTo(e.target.value)} className="flex-1 bg-background border border-border rounded-lg px-2 py-1 text-xs text-foreground">
                {nodes.map((n) => <option key={n.id} value={n.id}>{n.id}: {n.name}</option>)}
              </select>
            </div>
            <div className="flex gap-2">
              <select value={routeAlgo} onChange={(e) => setRouteAlgo(e.target.value as any)} className="bg-background border border-border rounded-lg px-2 py-1 text-xs text-foreground">
                <option value="astar">A* Search</option>
                <option value="dijkstra">Dijkstra</option>
              </select>
              <button onClick={calcRoute} className="flex-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/30 hover:bg-orange-500 hover:text-white transition-all">
                Find Route
              </button>
            </div>
          </div>

          {/* Emergency */}
          <div className="bg-muted/30 border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Siren className="w-4 h-4 text-destructive" />
              <span className="text-xs font-bold text-foreground uppercase tracking-wider">Emergency Priority</span>
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
              {emergency ? `🚑 ACTIVE CORDON — ETA ${emergency.eta}s` : "🚑 Trigger Green Corridor"}
            </button>
            {emergency && (
              <p className="text-[10px] text-destructive mt-2 font-mono animate-pulse">
                Path: {emergency.corridor.join(" → ")}
              </p>
            )}
          </div>
        </div>

        {/* Map area and Incident side panel wrapper */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          
          {/* Map */}
          <div className="lg:col-span-3 bg-black/20 border border-white/10 rounded-xl overflow-hidden" style={{ height: 450 }}>
            <MapContainer center={BHUBANESWAR} zoom={13} style={{ height: "100%", width: "100%", background: '#0a0a0a' }} zoomControl={false}>
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
                      color: utilization > 0.8 ? "#ef4444" : utilization > 0.6 ? "#f59e0b" : "rgba(255,255,255,0.1)",
                      weight: Math.max(1, r.lanes),
                      opacity: 0.5,
                      dashArray: r.lanes === 1 ? "5 5" : undefined,
                    }}
                  />
                );
              })}

              {/* Selected route overlay */}
              {routePositions.length > 1 && (
                <Polyline positions={routePositions} pathOptions={{ color: "#14b8a6", weight: 5, opacity: 0.9 }} />
              )}

              {/* Green corridor */}
              {corridorPositions.length > 1 && (
                <Polyline positions={corridorPositions} pathOptions={{ color: "#10b981", weight: 6, opacity: 0.9, dashArray: "10 5" }} />
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
                      color: isOnCorridor ? "#10b981" : getNodeColor(n.congestion),
                      fillColor: isOnCorridor ? "#10b981" : getNodeColor(n.congestion),
                      fillOpacity: isOnCorridor ? 0.7 : 0.4,
                      weight: n.hasCCTV ? 2 : 1,
                    }}
                  >
                    <Popup>
                      <div className="p-3 min-w-[200px] bg-background border border-border rounded-lg shadow-xl">
                        <p className="font-bold text-sm mb-2 text-foreground">{n.id} — {n.name}</p>
                        <p className="text-xs">Type: <span className="text-orange-500">{n.type}</span></p>
                        <p className="text-xs">Congestion: <span className="font-bold" style={{ color: getNodeColor(n.congestion) }}>{n.congestion}%</span></p>
                        <p className="text-xs text-muted-foreground mt-1">Sensor: {n.hasCCTV ? "✅ Online" : "❌ None"}</p>
                        {sig && (
                          <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                            <p style={{ fontWeight: 700, color: "#14b8a6" }}>RL Active Control</p>
                            <p>🟢 NS: {sig.action.greenNS}s | EW: {sig.action.greenEW}s</p>
                            <p>Reward: <span style={{ color: sig.reward > 0 ? "#10b981" : "#ef4444" }}>{sig.reward.toFixed(1)}</span></p>
                          </div>
                        )}
                        {isOnCorridor && <p style={{ color: "#10b981", fontWeight: 700, marginTop: 8 }}>🚑 CORRIDOR ACTIVE</p>}
                      </div>
                    </Popup>
                  </Circle>
                );
              })}
            </MapContainer>
          </div>

          <div className="flex flex-col gap-4 h-full">
            {/* Incidents Panel */}
            <div className="bg-black/20 border border-white/10 rounded-xl p-4 flex-1 overflow-auto max-h-[220px] lg:max-h-full">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Live Incidents</h3>
              </div>
              <div className="space-y-2">
                {incidents.length === 0 ? (
                  <p className="text-xs text-white/40 text-center py-2">No active incidents</p>
                ) : (
                  incidents.map((inc) => (
                    <div
                      key={inc.id}
                      className="flex items-center gap-2 p-2 rounded-lg bg-black/40 border"
                      style={{ borderColor: `${getSeverityColor(inc.severity)}30` }}
                    >
                      <div className="w-2 h-2 rounded-full animate-pulse shrink-0" style={{ backgroundColor: getSeverityColor(inc.severity) }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-semibold text-white truncate">{inc.message}</p>
                        <p className="text-[9px] text-white/50 font-mono mt-0.5">
                          {new Date(inc.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Selected Signal View */}
            <div className="bg-black/20 border border-white/10 rounded-xl p-4 min-h-[150px]">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-4 h-4 text-teal-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Top Optimize</h3>
              </div>
              {signals.size > 0 ? (() => {
                const topSig = Array.from(signals.entries()).sort((a,b) => b[1].reward - a[1].reward)[0];
                const node = nodeMap.get(topSig[0]);
                if (!node) return null;
                return (
                  <div>
                    <p className="text-xs font-bold text-white truncate">{node.name}</p>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="bg-black/40 rounded p-1.5 text-center">
                        <p className="text-[9px] text-white/50">NS GREEN</p>
                        <p className="text-sm font-mono text-emerald-400">{topSig[1].action.greenNS}s</p>
                      </div>
                      <div className="bg-black/40 rounded p-1.5 text-center">
                        <p className="text-[9px] text-white/50">EW GREEN</p>
                        <p className="text-sm font-mono text-emerald-400">{topSig[1].action.greenEW}s</p>
                      </div>
                    </div>
                  </div>
                );
              })() : <p className="text-[10px] text-white/40">Calculating RL signals...</p>}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ITOSDashboard;
