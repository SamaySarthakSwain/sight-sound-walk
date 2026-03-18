import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

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

export const useTrafficDensity = (refreshInterval = 30000) => {
  const [densities, setDensities] = useState<IntersectionDensity[]>([]);
  const [summary, setSummary] = useState<TrafficSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchDensity = useCallback(async () => {
    try {
      const { data, error: fnError } = await supabase.functions.invoke("traffic-density");
      if (fnError) throw fnError;
      setDensities(data.densities);
      setSummary(data.summary);
      setLastUpdated(new Date());
      setError(null);
    } catch (e: any) {
      console.error("Traffic density fetch error:", e);
      setError(e.message || "Failed to fetch traffic data");
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
