import { useState, useEffect, useCallback, useRef } from "react";
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
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const useMonuments = () => {
  const [monuments, setMonuments] = useState<Monument[]>(monumentCache?.data || []);
  const [loading, setLoading] = useState(!monumentCache);
  const [error, setError] = useState<string | null>(null);
  const { selectedCity } = useCity();
  const abortRef = useRef<AbortController | null>(null);

  const filterMonuments = useCallback((data: Monument[], cityName: string): Monument[] => {
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
  }, []);

  const fetchMonuments = useCallback(async () => {
    const cityName = selectedCity.split(",")[0];
    
    // Use cache if fresh
    if (monumentCache && monumentCache.city === cityName && Date.now() - monumentCache.timestamp < CACHE_TTL) {
      setMonuments(monumentCache.data);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch from MongoDB backend
      const response = await fetch(`${API_URL}/monuments`);
      if (!response.ok) {
        throw new Error("Failed to fetch monuments from backend");
      }
      
      const dbMonuments = await response.json();
      
      // Map MongoDB documents to expected format
      const mappedData: Monument[] = dbMonuments.map((m: any) => ({
        id: m.original_id || m._id,
        title: m.title,
        description: m.description,
        location: m.location,
        state: m.state,
        category: m.category,
        image_url: m.image_gridfs_id ? `${API_URL}/image/${m.image_gridfs_id}` : m.image_url,
        latitude: m.latitude,
        longitude: m.longitude,
        facts: m.facts,
        is_featured: m.is_featured,
        distance_from_berhampur: m.distance_from_berhampur,
        region: m.region
      }));

      let finalRawData = mappedData;

      if (finalRawData.length === 0) {
        console.warn("Using fallback monument data, database returned 0 items");
        finalRawData = fallbackMonuments as Monument[];
      } else {
        const dbIds = new Set(finalRawData.map((m) => m.id));
        const missingFallbacks = (fallbackMonuments as Monument[]).filter((m) => !dbIds.has(m.id));
        if (missingFallbacks.length > 0) {
          finalRawData = [...finalRawData, ...missingFallbacks];
        }
      }

      // Sort by featured
      finalRawData.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));

      const filtered = filterMonuments(finalRawData, cityName);
      const finalMonuments = filtered.length > 0 ? filtered : finalRawData;
      
      monumentCache = { data: finalMonuments, city: cityName, timestamp: Date.now() };
      setMonuments(finalMonuments);
    } catch (err) {
      console.warn("Error fetching from MongoDB API, using fallback:", err);
      const finalRawData = fallbackMonuments as Monument[];
      const filtered = filterMonuments(finalRawData, cityName);
      const finalMonuments = filtered.length > 0 ? filtered : finalRawData;
      
      monumentCache = { data: finalMonuments, city: cityName, timestamp: Date.now() };
      setMonuments(finalMonuments);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, [selectedCity, filterMonuments]);

  useEffect(() => {
    fetchMonuments();
  }, [fetchMonuments]);

  return { monuments, loading, error, refetch: fetchMonuments };
};
