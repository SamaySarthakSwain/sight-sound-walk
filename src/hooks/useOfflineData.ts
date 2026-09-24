import { useEffect } from "react";
import { getApiUrl } from "@/lib/apiConfig";


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
        const monRes = await fetch(getApiUrl("/api/monuments"));
        if (monRes.ok) {
          const monData = await monRes.json();
          localStorage.setItem(CACHE_KEYS.monuments, JSON.stringify(monData));
        }

        const foodRes = await fetch(getApiUrl("/api/food-places"));
        if (foodRes.ok) {
          const foodData = await foodRes.json();
          localStorage.setItem(CACHE_KEYS.foodPlaces, JSON.stringify(foodData));
        }

        const hotelRes = await fetch(getApiUrl("/api/hotels"));
        if (hotelRes.ok) {
          const hotelData = await hotelRes.json();
          localStorage.setItem(CACHE_KEYS.hotels, JSON.stringify(hotelData));
        }

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
