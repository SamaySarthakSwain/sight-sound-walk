import { useState, useEffect, useCallback, useRef } from "react";
import { getApiUrl } from "@/lib/apiConfig";
import { useCity } from "@/contexts/CityContext";
import { fallbackMonuments } from "@/data/fallbackMonuments";

export interface Monument {
  id: string;
  title: string;
  description: string;
  location: string;
  state: string;
  category: string;
  image_url: string | null;
  latitude: number | null;
  longitude: number | null;
  facts: string[] | null;
  history?: string | null;
  builtYear?: string | null;
  longDescription?: string | null;
  is_featured: boolean | null;
  distance_from_berhampur: string | null;
  region: string | null;
}

// In-memory cache to avoid redundant fetches across hook instances
let monumentCache: { data: Monument[]; city: string; timestamp: number } | null = null;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export const filterMonumentsByCity = (data: Monument[], cityName: string): Monument[] => {
  const cn = cityName.toLowerCase().trim();

  if (cn === "berhampur" || cn === "brahmapur") {
    return data.filter((m) => {
      const loc = m.location.toLowerCase();
      const reg = m.region?.toLowerCase();
      return (
        loc.includes("berhampur") || loc.includes("brahmapur") || loc.includes("ganjam") ||
        loc.includes("gopalpur") || loc.includes("taptapani") || loc.includes("chilika") ||
        loc.includes("gajapati") || loc.includes("aryapalli") || reg === "berhampur"
      );
    });
  }
  if (cn === "bhubaneswar" || cn === "bbsr") {
    return data.filter((m) => {
      const loc = m.location.toLowerCase();
      const reg = m.region?.toLowerCase();
      return loc.includes("bhubaneswar") || loc.includes("bbsr") || loc.includes("konark") || loc.includes("puri") || reg === "bhubaneswar";
    });
  }
  if (cn === "puri") {
    return data.filter((m) => {
      const loc = m.location.toLowerCase();
      return loc.includes("puri") || loc.includes("konark") || loc.includes("chilika");
    });
  }
  if (cn === "cuttack") {
    return data.filter((m) => {
      const loc = m.location.toLowerCase();
      return loc.includes("cuttack") || loc.includes("jajpur") || loc.includes("angul");
    });
  }
  return data;
};

export const useMonuments = () => {
  const { selectedCity } = useCity();
  const cityName = selectedCity.split(",")[0] || "Odisha";

  // Compute immediate initial data synchronously for zero-lag first paint
  const getInitialData = (): Monument[] => {
    if (monumentCache && monumentCache.city === cityName) {
      return monumentCache.data;
    }
    const filtered = filterMonumentsByCity(fallbackMonuments as Monument[], cityName);
    return filtered.length > 0 ? filtered : (fallbackMonuments as Monument[]);
  };

  const [monuments, setMonuments] = useState<Monument[]>(getInitialData);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchMonuments = useCallback(async () => {
    const curCity = selectedCity.split(",")[0] || "Odisha";

    // If cache is fresh, use it directly
    if (monumentCache && monumentCache.city === curCity && Date.now() - monumentCache.timestamp < CACHE_TTL) {
      setMonuments(monumentCache.data);
      setLoading(false);
      return;
    }

    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Timeout signal to avoid 60s freeze if Render backend is sleeping
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    try {
      setIsRefreshing(true);
      setError(null);

      const res = await fetch(getApiUrl("/api/monuments"), {
        signal: controller.signal,
        headers: { "Accept": "application/json" }
      });
      clearTimeout(timeoutId);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const dbData = await res.json();
      const mappedData = (dbData || []) as unknown as Monument[];

      let finalRawData = mappedData;

      if (!finalRawData || finalRawData.length === 0) {
        finalRawData = fallbackMonuments as Monument[];
      } else {
        const dbIds = new Set(finalRawData.map((m) => m.id));
        const missingFallbacks = (fallbackMonuments as Monument[]).filter((m) => !dbIds.has(m.id));
        if (missingFallbacks.length > 0) {
          finalRawData = [...finalRawData, ...missingFallbacks];
        }
      }

      // Sort by featured first
      finalRawData.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));

      const filtered = filterMonumentsByCity(finalRawData, curCity);
      const finalMonuments = filtered.length > 0 ? filtered : finalRawData;

      monumentCache = { data: finalMonuments, city: curCity, timestamp: Date.now() };
      setMonuments(finalMonuments);
    } catch (err: any) {
      clearTimeout(timeoutId);
      // If aborted or network error, silently fall back to local curated dataset with zero disruption
      if (err.name !== "AbortError") {
        console.warn("Could not fetch remote monuments, using curated local dataset:", err.message);
      }
      const filtered = filterMonumentsByCity(fallbackMonuments as Monument[], curCity);
      const finalMonuments = filtered.length > 0 ? filtered : (fallbackMonuments as Monument[]);
      monumentCache = { data: finalMonuments, city: curCity, timestamp: Date.now() };
      setMonuments(finalMonuments);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [selectedCity]);

  useEffect(() => {
    // When city changes, immediately update monuments from local fallback synchronously
    const localFiltered = filterMonumentsByCity(fallbackMonuments as Monument[], cityName);
    setMonuments(localFiltered.length > 0 ? localFiltered : (fallbackMonuments as Monument[]));
    
    fetchMonuments();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [cityName, fetchMonuments]);

  return { monuments, loading, isRefreshing, error, refetch: fetchMonuments };
};
