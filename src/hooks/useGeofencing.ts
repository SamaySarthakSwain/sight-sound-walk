import { useState, useEffect, useRef } from "react";
import { Monument } from "./useMonuments";

interface GeofencingOptions {
    radius?: number; // meters
    enabled?: boolean;
    cooldown?: number; // ms
}

export const useGeofencing = (monuments: Monument[], options: GeofencingOptions = {}) => {
    const { radius = 300, enabled = true, cooldown = 600000 } = options; // Default 300m, 10 min cooldown
    const [nearbyMonument, setNearbyMonument] = useState<Monument | null>(null);
    const visitedMonumentsRef = useRef<Record<string, number>>({}); // monumentId -> lastTriggeredTimestamp

    useEffect(() => {
        if (!enabled || !monuments.length) return;

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const now = Date.now();

                for (const monument of monuments) {
                    if (!monument.latitude || !monument.longitude) continue;

                    const distance = calculateDistance(
                        latitude,
                        longitude,
                        monument.latitude,
                        monument.longitude
                    );

                    if (distance <= radius) {
                        const lastTriggered = visitedMonumentsRef.current[monument.id] || 0;
                        if (now - lastTriggered > cooldown) {
                            visitedMonumentsRef.current[monument.id] = now;
                            setNearbyMonument(monument);

                            // Trigger a custom event for VoiceGuide or other components to listen to
                            const event = new CustomEvent("proactive-nudge", {
                                detail: { monument },
                            });
                            window.dispatchEvent(event);

                            break; // Only trigger one at a time
                        }
                    }
                }
            },
            (error) => {
                // Geolocation permission denied / unavailable — silent, expected on many devices.
                if (error && (error.code === error.PERMISSION_DENIED || error.code === error.POSITION_UNAVAILABLE)) return;
                console.warn("[Geofencing]", error?.message || "location unavailable");
            },
            {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 10000,
            }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, [monuments, enabled, radius, cooldown]);

    return { nearbyMonument };
};

// Haversine formula to calculate distance in meters
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}
