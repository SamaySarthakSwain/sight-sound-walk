import { createContext, useContext, ReactNode } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY =
  typeof import.meta !== "undefined" && import.meta.env?.VITE_GOOGLE_MAPS_API_KEY
    ? import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    : "AIzaSyBVVkTWwfx3NW6bFi1t7CEomwv1owCO1SI";

interface GoogleMapsContextType {
  isLoaded: boolean;
  loadError: Error | undefined;
}

const GoogleMapsContext = createContext<GoogleMapsContextType | undefined>(undefined);

/**
 * Suppress the Google Maps API alert as soon as this module loads, so it's in place
 * before the Maps script runs (useEffect runs too late and the alert can still fire).
 */
if (typeof window !== "undefined") {
  const originalAlert = window.alert;
  window.alert = function (message?: string) {
    if (typeof message === "string" && (message.includes("Google Maps") || message.includes("can't load"))) {
      console.warn("[Google Maps]", message);
      return;
    }
    originalAlert.call(window, message);
  };
}

/**
 * Provider that loads the Google Maps JS API once at app level.
 * Must stay mounted so useJsApiLoader is not called again on Cabs remount (avoids "Loader must not be called again" / Something went wrong).
 */
export function GoogleMapsProvider({ children }: { children: ReactNode }) {

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>
      {children}
    </GoogleMapsContext.Provider>
  );
}

export function useGoogleMaps() {
  const context = useContext(GoogleMapsContext);
  if (context === undefined) {
    throw new Error("useGoogleMaps must be used within a GoogleMapsProvider");
  }
  return context;
}
