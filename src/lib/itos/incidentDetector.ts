/**
 * Incident Detection: Queue spikes, congestion anomalies, weather adjustments
 */
import type { IntersectionNode, RoadEdge } from "./cityTopology";

export type DetectedIncident = {
  id: string;
  nodeId: string;
  type: "queue_spike" | "congestion_anomaly" | "weather_degradation" | "ambulance_detected" | "signal_failure" | "unusual_pattern";
  severity: "info" | "warning" | "critical";
  message: string;
  timestamp: number;
  value: number;
  threshold: number;
};

const history = new Map<string, number[]>(); // nodeId -> last N congestion values

export function recordCongestion(nodeId: string, congestion: number) {
  if (!history.has(nodeId)) history.set(nodeId, []);
  const arr = history.get(nodeId)!;
  arr.push(congestion);
  if (arr.length > 20) arr.shift();
}

function avg(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function stdDev(arr: number[]): number {
  const m = avg(arr);
  return Math.sqrt(arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length);
}

/** Detect queue spikes (sudden increase in queue length) */
export function detectQueueSpikes(nodes: IntersectionNode[]): DetectedIncident[] {
  const incidents: DetectedIncident[] = [];
  for (const n of nodes) {
    if (n.queueLength > 18) {
      incidents.push({
        id: `qs_${n.id}_${Date.now()}`,
        nodeId: n.id,
        type: "queue_spike",
        severity: n.queueLength > 22 ? "critical" : "warning",
        message: `Queue spike at ${n.name}: ${n.queueLength} vehicles`,
        timestamp: Date.now(),
        value: n.queueLength,
        threshold: 18,
      });
    }
  }
  return incidents;
}

/** Detect congestion anomalies using statistical analysis */
export function detectCongestionAnomalies(nodes: IntersectionNode[]): DetectedIncident[] {
  const incidents: DetectedIncident[] = [];
  for (const n of nodes) {
    recordCongestion(n.id, n.congestion);
    const h = history.get(n.id)!;
    if (h.length < 5) continue;

    const m = avg(h.slice(0, -1));
    const sd = stdDev(h.slice(0, -1));
    const current = h[h.length - 1];

    // Z-score > 2 = anomaly
    if (sd > 0 && (current - m) / sd > 2) {
      incidents.push({
        id: `ca_${n.id}_${Date.now()}`,
        nodeId: n.id,
        type: "congestion_anomaly",
        severity: "warning",
        message: `Unusual congestion spike at ${n.name}: ${current}% (avg: ${m.toFixed(0)}%)`,
        timestamp: Date.now(),
        value: current,
        threshold: m + 2 * sd,
      });
    }
  }
  return incidents;
}

/** Weather-aware capacity adjustments */
export function getWeatherCapacityFactor(weather: string): number {
  switch (weather) {
    case "rain": return 0.85;
    case "fog": return 0.75;
    case "heavy_rain": return 0.6;
    default: return 1.0;
  }
}

/** Apply weather adjustments to road capacities */
export function adjustForWeather(edges: RoadEdge[], weather: string): RoadEdge[] {
  const factor = getWeatherCapacityFactor(weather);
  return edges.map((e) => ({
    ...e,
    capacity: Math.floor(e.capacity * factor),
    speedLimit: Math.floor(e.speedLimit * factor),
    weather: weather as any,
  }));
}

/** Run full incident detection sweep */
export function runIncidentDetection(nodes: IntersectionNode[]): DetectedIncident[] {
  return [...detectQueueSpikes(nodes), ...detectCongestionAnomalies(nodes)];
}
