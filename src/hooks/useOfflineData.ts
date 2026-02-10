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
        const [monuments, foodPlaces, hotels] = await Promise.all([
          supabase.from("monuments").select("*"),
          supabase.from("food_places").select("*"),
          supabase.from("hotels").select("*"),
        ]);

        if (monuments.data) localStorage.setItem(CACHE_KEYS.monuments, JSON.stringify(monuments.data));
        if (foodPlaces.data) localStorage.setItem(CACHE_KEYS.foodPlaces, JSON.stringify(foodPlaces.data));
        if (hotels.data) localStorage.setItem(CACHE_KEYS.hotels, JSON.stringify(hotels.data));
        localStorage.setItem(CACHE_KEYS.timestamp, String(Date.now()));
      } catch (e) {
        console.log("Offline cache update skipped (offline?)");
      }
    };

    cacheData();
  }, []);
};

export const getOfflineData = (key: "monuments" | "foodPlaces" | "hotels") => {
  const raw = localStorage.getItem(CACHE_KEYS[key]);
  return raw ? JSON.parse(raw) : [];
};
