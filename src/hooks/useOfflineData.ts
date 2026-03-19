import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const CACHE_KEYS = {
  monuments: "offline_monuments",
  foodPlaces: "offline_food_places",
  hotels: "offline_hotels",
  timestamp: "offline_cache_timestamp",
};

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export const useOfflineData = () => {
  useEffect(() => {
    const cacheData = async () => {
      const lastCached = localStorage.getItem(CACHE_KEYS.timestamp);
      if (lastCached && Date.now() - Number(lastCached) < CACHE_DURATION) return;

      try {
        // Sequential to avoid overwhelming the connection
        const monuments = await supabase.from("monuments").select("id,title,location,category,latitude,longitude,image_url,is_featured");
        if (monuments.data) localStorage.setItem(CACHE_KEYS.monuments, JSON.stringify(monuments.data));

        const foodPlaces = await supabase.from("food_places").select("id,name,location,category,latitude,longitude,image_url,google_rating");
        if (foodPlaces.data) localStorage.setItem(CACHE_KEYS.foodPlaces, JSON.stringify(foodPlaces.data));

        const hotels = await supabase.from("hotels").select("id,name,location,star_rating,price_per_night_min,image_url,google_rating");
        if (hotels.data) localStorage.setItem(CACHE_KEYS.hotels, JSON.stringify(hotels.data));

        localStorage.setItem(CACHE_KEYS.timestamp, String(Date.now()));
      } catch (e) {
        // Silently fail — offline caching is non-critical
      }
    };

    // Defer heavily — only run after page is idle for 5 seconds
    const timer = setTimeout(() => {
      if ("requestIdleCallback" in window) {
        (window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number }).requestIdleCallback(() => cacheData(), { timeout: 10000 });
      } else {
        cacheData();
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);
};

export const getOfflineData = (key: "monuments" | "foodPlaces" | "hotels") => {
  const raw = localStorage.getItem(CACHE_KEYS[key]);
  return raw ? JSON.parse(raw) : [];
};
