/**
 * Helper to get the full URL for Python AI Backend API endpoints.
 * In local development, falls back to relative `/api/...` (proxied by Vite).
 * In production, uses `VITE_API_URL` (e.g., https://sight-sound-walk-api.onrender.com).
 */
export const getApiUrl = (endpoint: string): string => {
  const envUrl = import.meta.env.VITE_API_URL;
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  let base = envUrl;
  if (!base) {
    base = import.meta.env.DEV ? "http://localhost:5000" : "https://sight-sound-walk-api.onrender.com";
  }

  base = base.replace(/\/$/, "");

  // If base already ends with /api and endpoint also starts with /api, deduplicate
  if (base.endsWith("/api") && cleanEndpoint.startsWith("/api")) {
    return `${base}${cleanEndpoint.slice(4)}`;
  }
  
  // If base does not end with /api and endpoint does not start with /api
  if (!base.endsWith("/api") && !cleanEndpoint.startsWith("/api")) {
    return `${base}/api${cleanEndpoint}`;
  }

  return `${base}${cleanEndpoint}`;
};

