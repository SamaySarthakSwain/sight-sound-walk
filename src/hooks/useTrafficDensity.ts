import { useState, useEffect, useCallback } from "react";
import { getCityData } from "@/data/cityMonuments";

export type IntersectionDensity = {
  id: string;
  name: string;
  position: [number, number];
  currentDensity: number;
  currentSpeed: number;
  avgDensity: number;
  prediction30m: number;
  prediction60m: number;
  prediction90m: number;
  trend: "increasing" | "decreasing" | "stable";
  peakHour: boolean;
  congestionLevel: "low" | "moderate" | "high" | "critical";
};

export type TrafficSummary = {
  timestamp: string;
  istTime: string;
  isPeakHour: boolean;
  dayType: string;
  avgCityDensity: number;
  criticalZones: number;
  highZones: number;
};

// Generate realistic mock data based on monument locations
const generateMockTrafficData = () => {
  const bbsrData = getCityData("Bhubaneswar");
  const monuments = [
    ...bbsrData.sections[0].monuments,
    ...bbsrData.sections[1].monuments
  ];

  const hour = new Date().getHours();
  // Peak hours: 9-11 AM, 5-8 PM
  const isPeakHour = (hour >= 9 && hour <= 11) || (hour >= 17 && hour <= 20);
  const baseMultiplier = isPeakHour ? 1.5 : 1;

  const densities: IntersectionDensity[] = monuments.map((monument, i) => {
    // Adding some random variance
    const baseDensity = Math.min(100, Math.floor(Math.random() * 40 + 30 * baseMultiplier));
    const trendValue = Math.random();
    const trend = trendValue > 0.6 ? "increasing" : trendValue < 0.4 ? "decreasing" : "stable";
    
    let congestionLevel: "low" | "moderate" | "high" | "critical" = "low";
    if (baseDensity > 85) congestionLevel = "critical";
    else if (baseDensity > 65) congestionLevel = "high";
    else if (baseDensity > 40) congestionLevel = "moderate";

    const currentSpeed = Math.max(5, Math.floor(60 - (baseDensity * 0.5)));

    return {
      id: `route-${i}`,
      name: `${monument.title} Route`,
      position: [20.2961 + (Math.random() * 0.1 - 0.05), 85.8245 + (Math.random() * 0.1 - 0.05)], // Approx BBSR coords
      currentDensity: baseDensity,
      currentSpeed,
      avgDensity: Math.max(10, baseDensity - 15),
      prediction30m: Math.min(100, baseDensity + (trend === "increasing" ? 10 : trend === "decreasing" ? -10 : 0)),
      prediction60m: Math.min(100, baseDensity + (trend === "increasing" ? 20 : trend === "decreasing" ? -20 : 0)),
      prediction90m: Math.min(100, baseDensity + (trend === "increasing" ? 25 : trend === "decreasing" ? -25 : 0)),
      trend,
      peakHour: isPeakHour,
      congestionLevel
    };
  });

  const avgCityDensity = Math.floor(densities.reduce((acc, d) => acc + d.currentDensity, 0) / densities.length);
  const criticalZones = densities.filter(d => d.congestionLevel === "critical").length;
  const highZones = densities.filter(d => d.congestionLevel === "high").length;

  const summary: TrafficSummary = {
    timestamp: new Date().toISOString(),
    istTime: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }),
    isPeakHour,
    dayType: new Date().getDay() === 0 || new Date().getDay() === 6 ? "Weekend" : "Weekday",
    avgCityDensity,
    criticalZones,
    highZones
  };

  return { densities, summary };
};

export const useTrafficDensity = (refreshInterval = 30000) => {
  const [densities, setDensities] = useState<IntersectionDensity[]>([]);
  const [summary, setSummary] = useState<TrafficSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchDensity = useCallback(() => {
    try {
      setLoading(true);
      const data = generateMockTrafficData();
      setDensities(data.densities);
      setSummary(data.summary);
      setLastUpdated(new Date());
      setError(null);
    } catch (e: unknown) {
      console.error("Traffic density Generation error:", e);
      setError("Failed to generate traffic data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDensity();
    const interval = setInterval(fetchDensity, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchDensity, refreshInterval]);

  return { densities, summary, loading, error, lastUpdated, refresh: fetchDensity };
};
