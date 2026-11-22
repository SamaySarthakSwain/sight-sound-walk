/**
 * Helper to get the full URL for Python AI Backend API endpoints.
 * - In local development: uses relative `/api/...` (proxied by Vite to localhost:5000).
 * - In production web (Vercel): uses relative `/api/...` directly handled by Vercel serverless Python.
 * - In Capacitor (Android APK): points to Vercel live API.
 * - If VITE_API_URL is explicitly set, respects that override.
 */
export const getApiUrl = (endpoint: string): string => {
  const envUrl = import.meta.env.VITE_API_URL;
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  if (envUrl) {
    const base = envUrl.replace(/\/$/, "");
    if (base.endsWith("/api") && cleanEndpoint.startsWith("/api")) {
      return `${base}${cleanEndpoint.slice(4)}`;
    }
    return `${base}${cleanEndpoint}`;
  }

  // Check if running inside Capacitor native mobile container
  const isCapacitor = typeof window !== "undefined" && (
    window.location.protocol === "capacitor:" ||
    (window.location.hostname === "localhost" && !import.meta.env.DEV && !window.location.port)
  );

  if (isCapacitor) {
    return `https://sight-sound-walk.vercel.app${cleanEndpoint}`;
  }

  // For both local dev (proxied by Vite) and production on Vercel (rewrites to api/index.py)
  return cleanEndpoint;
};


