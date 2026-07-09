import { createContext, useContext, ReactNode } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

// Prefer the Lovable connector browser key (referrer-restricted to *.lovable.app and
// managed via the Google Maps Platform connector). Falls back to the legacy env var.
const GOOGLE_MAPS_API_KEY =
  (typeof import.meta !== "undefined" &&
    (import.meta.env?.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY ||
      import.meta.env?.VITE_GOOGLE_MAPS_API_KEY)) ||
  "";

const GOOGLE_MAPS_CHANNEL =
  (typeof import.meta !== "undefined" &&
    import.meta.env?.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID) ||
  undefined;

// Static libraries reference — must be a stable reference to avoid LoadScript reloads.
const LIBRARIES: ("places" | "geometry")[] = ["places", "geometry"];

interface GoogleMapsContextType {
  isLoaded: boolean;
  loadError: Error | undefined;
}

const GoogleMapsContext = createContext<GoogleMapsContextType | undefined>(undefined);

// Suppress the Google Maps API alert popup — we surface errors through console.warn instead.
if (typeof window !== "undefined") {
  const originalAlert = window.alert;
  window.alert = function (message?: string) {
    if (
      typeof message === "string" &&
      (message.includes("Google Maps") || message.includes("can't load"))
    ) {
      console.warn("[Google Maps]", message);
      return;
    }
    originalAlert.call(window, message);
  };
}

export function GoogleMapsProvider({ children }: { children: ReactNode }) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
    channel: GOOGLE_MAPS_CHANNEL,
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
