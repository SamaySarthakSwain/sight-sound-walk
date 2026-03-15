/**
 * Graph-based routing: Dijkstra & A* with congestion-aware edge weights
 */
import { intersections, roads, type IntersectionNode, type RoadEdge } from "./cityTopology";

type AdjMap = Map<string, { to: string; weight: number; edge: RoadEdge }[]>;

function buildAdjacencyList(edges: RoadEdge[], weatherFactor: number = 1): AdjMap {
  const adj: AdjMap = new Map();
  for (const e of edges) {
    // Weight = travel time (seconds) adjusted for congestion + incidents
    const congestionPenalty = e.pcu / e.capacity; // 0-1+
    const incidentPenalty = e.incidents.length > 0 ? 1.5 : 1;
    const travelTime = (e.distance / ((e.currentSpeed * 1000) / 3600)) * congestionPenalty * incidentPenalty * weatherFactor;

    const addEdge = (from: string, to: string) => {
      if (!adj.has(from)) adj.set(from, []);
      adj.get(from)!.push({ to, weight: travelTime, edge: e });
    };
    addEdge(e.from, e.to);
    addEdge(e.to, e.from); // bidirectional
  }
  return adj;
}

function haversine(a: [number, number], b: [number, number]): number {
  const R = 6371000;
  const [lat1, lon1] = a.map((d) => (d * Math.PI) / 180);
  const [lat2, lon2] = b.map((d) => (d * Math.PI) / 180);
  const dlat = lat2 - lat1;
  const dlon = lon2 - lon1;
  const h = Math.sin(dlat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export type RouteResult = {
  path: string[];
  totalTime: number; // seconds
  totalDistance: number; // meters
  edges: RoadEdge[];
};

/** Dijkstra's shortest path (congestion-aware) */
export function dijkstra(source: string, target: string, edgesOverride?: RoadEdge[]): RouteResult | null {
  const adj = buildAdjacencyList(edgesOverride ?? roads);
  const dist = new Map<string, number>();
  const prev = new Map<string, string | null>();
  const visited = new Set<string>();

  for (const n of intersections) {
    dist.set(n.id, Infinity);
    prev.set(n.id, null);
  }
  dist.set(source, 0);

  while (true) {
    let u: string | null = null;
    let minD = Infinity;
    for (const [id, d] of dist) {
      if (!visited.has(id) && d < minD) {
        minD = d;
        u = id;
      }
    }
    if (!u || u === target) break;
    visited.add(u);

    for (const edge of adj.get(u) ?? []) {
      const alt = minD + edge.weight;
      if (alt < (dist.get(edge.to) ?? Infinity)) {
        dist.set(edge.to, alt);
        prev.set(edge.to, u);
      }
    }
  }

  if (!prev.has(target) && dist.get(target) === Infinity) return null;

  // Reconstruct
  const path: string[] = [];
  let curr: string | null = target;
  while (curr) {
    path.unshift(curr);
    curr = prev.get(curr) ?? null;
  }

  // Gather edges & distance
  const routeEdges: RoadEdge[] = [];
  let totalDist = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const e = roads.find(
      (r) => (r.from === path[i] && r.to === path[i + 1]) || (r.to === path[i] && r.from === path[i + 1])
    );
    if (e) {
      routeEdges.push(e);
      totalDist += e.distance;
    }
  }

  return { path, totalTime: dist.get(target) ?? 0, totalDistance: totalDist, edges: routeEdges };
}

/** A* search with haversine heuristic */
export function astar(source: string, target: string): RouteResult | null {
  const adj = buildAdjacencyList(roads);
  const nodeMap = new Map(intersections.map((n) => [n.id, n]));
  const targetPos = nodeMap.get(target)?.position;
  if (!targetPos) return null;

  const gScore = new Map<string, number>();
  const fScore = new Map<string, number>();
  const prev = new Map<string, string | null>();
  const openSet = new Set<string>([source]);
  const closedSet = new Set<string>();

  for (const n of intersections) {
    gScore.set(n.id, Infinity);
    fScore.set(n.id, Infinity);
  }
  gScore.set(source, 0);
  fScore.set(source, haversine(nodeMap.get(source)!.position, targetPos) / 15); // heuristic: ~15 m/s avg

  while (openSet.size > 0) {
    let u: string | null = null;
    let minF = Infinity;
    for (const id of openSet) {
      if ((fScore.get(id) ?? Infinity) < minF) {
        minF = fScore.get(id)!;
        u = id;
      }
    }
    if (!u) break;
    if (u === target) break;

    openSet.delete(u);
    closedSet.add(u);

    for (const edge of adj.get(u) ?? []) {
      if (closedSet.has(edge.to)) continue;
      const tentG = (gScore.get(u) ?? Infinity) + edge.weight;
      if (tentG < (gScore.get(edge.to) ?? Infinity)) {
        prev.set(edge.to, u);
        gScore.set(edge.to, tentG);
        const h = haversine(nodeMap.get(edge.to)!.position, targetPos) / 15;
        fScore.set(edge.to, tentG + h);
        openSet.add(edge.to);
      }
    }
  }

  if (gScore.get(target) === Infinity) return null;

  const path: string[] = [];
  let curr: string | null = target;
  while (curr) {
    path.unshift(curr);
    curr = prev.get(curr) ?? null;
  }

  const routeEdges: RoadEdge[] = [];
  let totalDist = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const e = roads.find(
      (r) => (r.from === path[i] && r.to === path[i + 1]) || (r.to === path[i] && r.from === path[i + 1])
    );
    if (e) {
      routeEdges.push(e);
      totalDist += e.distance;
    }
  }

  return { path, totalTime: gScore.get(target) ?? 0, totalDistance: totalDist, edges: routeEdges };
}

/** Find green corridor (fastest emergency route) — reduces edge weights on corridor */
export function findGreenCorridor(source: string, target: string): RouteResult | null {
  // Create modified edges with reduced weights for emergency
  const emergencyEdges = roads.map((r) => ({
    ...r,
    currentSpeed: r.speedLimit, // assume max speed for emergency
    pcu: 0, // cleared road
    incidents: [],
  }));
  return dijkstra(source, target, emergencyEdges);
}
