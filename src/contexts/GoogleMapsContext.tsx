import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

// A project-specific key (VITE_GOOGLE_MAPS_API_KEY) wins so local dev / self-hosted
// deployments can use a key allowed for their own domain. Falls back to the Lovable
// connector browser key (referrer-restricted to *.lovable.app).
const GOOGLE_MAPS_API_KEY =
  (typeof import.meta !== "undefined" &&
    (import.meta.env?.VITE_GOOGLE_MAPS_API_KEY ||
      import.meta.env?.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY)) ||
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
  /** True when the key is missing/rejected (e.g. RefererNotAllowedMapError on localhost). */
  authFailed: boolean;
  /** True when Google Maps cannot be used and callers should render the OSM fallback. */
  useFallback: boolean;
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
  const hasKey = Boolean(GOOGLE_MAPS_API_KEY);
  const [authFailed, setAuthFailed] = useState(!hasKey);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
    channel: GOOGLE_MAPS_CHANNEL,
    // Avoid firing a request with an empty key (throws a hard script error).
    preventGoogleFontsLoading: true,
  });

  // Google calls window.gm_authFailure when the key is invalid or the referrer is
  // not allowed (very common on http://localhost and custom domains).
  useEffect(() => {
    if (typeof window === "undefined") return;
    (window as unknown as { gm_authFailure?: () => void }).gm_authFailure = () => {
      console.warn(
        "[Google Maps] Key rejected for this domain — falling back to OpenStreetMap."
      );
      setAuthFailed(true);
    };
  }, []);

  const useFallback = !hasKey || authFailed || Boolean(loadError);

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError, authFailed, useFallback }}>
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
