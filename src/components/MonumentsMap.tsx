import { GoogleMap, Marker, InfoWindow, DirectionsRenderer } from "@react-google-maps/api";
import { useState, useEffect } from "react";
import { getApiUrl } from "@/lib/apiConfig";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Map as MapIcon, Loader2, Navigation as NavButtonIcon } from "lucide-react";

import DownloadMapButton from "./DownloadMapButton";
import { useGoogleMaps } from "@/contexts/GoogleMapsContext";
import PlacesAutocomplete from "./PlacesAutocomplete";
import OpenStreetMapFallback from "./OpenStreetMapFallback";
import { fallbackMonuments } from "@/data/fallbackMonuments";

interface RouteData {
  start: { lat: number; lng: number };
  end: { lat: number; lng: number };
  waypoints?: { lat: number; lng: number }[];
}

interface MonumentsMapProps {
  routeData?: RouteData | null;
  selectedMonumentId?: string | null;
}

interface MonumentRaw {
  id: string;
  title: string;
  latitude: number | null;
  longitude: number | null;
  description?: string | null;
  category?: string;
  location?: string;
  image_url?: string | null;
  rating?: number;
}

interface Monument {
  id: string;
  name: string;
  position: { lat: number; lng: number };
  description: string;
  category?: string;
  location?: string;
  image_url?: string;
  rating?: number;
}

const mapContainerStyle = {
  width: '100%',
  height: '620px',
  borderRadius: '1rem'
};

// Central Odisha coordinates covering Bhubaneswar, Puri, Konark, Cuttack & Ganjam
const center = {
  lat: 20.25,
  lng: 85.50
};

const MonumentsMap: React.FC<MonumentsMapProps> = ({ routeData, selectedMonumentId }) => {
  const { isLoaded: mapsLoaded, useFallback } = useGoogleMaps();
  const [monuments, setMonuments] = useState<Monument[]>([]);
  const [monumentsLoading, setMonumentsLoading] = useState(true);
  const [selectedMonument, setSelectedMonument] = useState<Monument | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [mapCenter, setMapCenter] = useState(center);
  const [mapZoom, setMapZoom] = useState(8);
  const [trafficLayer, setTrafficLayer] = useState<google.maps.TrafficLayer | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);

  // Fetch monuments with precise lat/lng
  useEffect(() => {
    let cancelled = false;
    const fetchMonuments = async () => {
      try {
        let allData = [];
        try {
          const response = await fetch(getApiUrl("/api/monuments"));
          if (response.ok) {
            allData = await response.json();
          }
        } catch {
          allData = [];
        }

        if (!allData || allData.length === 0) {
          allData = fallbackMonuments;
        }
        
        // Filter out those without coords
        const data = (allData as MonumentRaw[]).filter((m) => m.latitude && m.longitude);

        if (cancelled) return;

        const formattedMonuments: Monument[] = data.map((m) => ({
          id: m.id,
          name: m.title,
          position: {
            lat: Number(m.latitude) as number,
            lng: Number(m.longitude) as number,
          },
          description: m.description ?? "",
          category: m.category ?? "Heritage",
          location: m.location ?? "Odisha",
          image_url: m.image_url ?? "/images/monuments/konark-temple.jpg",
          rating: m.rating ?? 4.8,
        }));

        setMonuments(formattedMonuments);
      } catch (error) {
        if (!cancelled) console.error("Error fetching monuments:", error);
      } finally {
        if (!cancelled) setMonumentsLoading(false);
      }
    };

    fetchMonuments();
    return () => {
      cancelled = true;
    };
  }, []);

  // Enable traffic layer
  useEffect(() => {
    if (map && !trafficLayer) {
      const traffic = new google.maps.TrafficLayer();
      traffic.setMap(map);
      setTrafficLayer(traffic);
    }
  }, [map, trafficLayer]);

  // Track user's real-time location (available for "My Location" button)
  useEffect(() => {
    if (navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(newLocation);
        },
        (error) => {
          console.error('Error getting location:', error);
          setUserLocation({ lat: 19.2950, lng: 84.8108 });
        },
        {
          enableHighAccuracy: true,
          maximumAge: 30000,
          timeout: 5000
        }
      );
      setWatchId(id);

      return () => {
        if (id) {
          navigator.geolocation.clearWatch(id);
        }
      };
    } else {
      setUserLocation({ lat: 19.2950, lng: 84.8108 });
    }
  }, []);

  useEffect(() => {
    if (selectedMonumentId && monuments.length > 0) {
      const selected = monuments.find(m => m.id === selectedMonumentId);
      if (selected) {
        setMapCenter(selected.position);
        setMapZoom(16);
        setSelectedMonument(selected);
      }
    }
  }, [selectedMonumentId, monuments]);

  useEffect(() => {
    if (routeData && mapsLoaded && typeof window !== "undefined" && window.google) {
      const directionsService = new google.maps.DirectionsService();

      const waypoints = routeData.waypoints?.map(wp => ({
        location: { lat: wp.lat, lng: wp.lng },
        stopover: true
      })) || [];

      directionsService.route(
        {
          origin: routeData.start,
          destination: routeData.end,
          waypoints: waypoints,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            setDirections(result);
            // Center map on the route
            const bounds = new google.maps.LatLngBounds();
            bounds.extend(routeData.start);
            bounds.extend(routeData.end);
            routeData.waypoints?.forEach(wp => bounds.extend(wp));
            setMapCenter({
              lat: (routeData.start.lat + routeData.end.lat) / 2,
              lng: (routeData.start.lng + routeData.end.lng) / 2
            });
            setMapZoom(8);
          } else {
            console.error('Directions request failed:', status);
          }
        }
      );
    } else if (!routeData) {
      setDirections(null);
    }
  }, [routeData, mapsLoaded]);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <Card className="shadow-medium glass-card border-none">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle className="text-3xl flex items-center gap-3">
                  <MapIcon className="w-8 h-8 text-primary" />
                  Monuments Map of Odisha
                </CardTitle>
                <CardDescription className="text-base mt-1">
                  {monumentsLoading
                    ? "Loading monuments…"
                    : `Explore all ${monuments.length} famous monuments and historical sites across Odisha`}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (userLocation) {
                      setMapCenter(userLocation);
                      setMapZoom(14);
                    }
                  }}
                  disabled={!userLocation}
                  className="gap-2"
                >
                  <NavButtonIcon className="w-4 h-4" />
                  My Location
                </Button>
                <DownloadMapButton />
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Beautiful autocomplete search bar — Google Places (New) */}
            <PlacesAutocomplete
              placeholder="Search a monument, temple, city or address in Odisha…"
              onSelect={(p) => {
                if (p.location) {
                  setMapCenter(p.location);
                  setMapZoom(15);
                }
              }}
            />

            {useFallback ? (
              <>
                <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
                  Showing the OpenStreetMap view — the Google Maps key isn't authorised for{" "}
                  <span className="font-medium text-foreground">
                    {typeof window !== "undefined" ? window.location.origin : "this domain"}
                  </span>
                  . Add this origin to the key's allowed referrers (or set{" "}
                  <code className="text-xs">VITE_GOOGLE_MAPS_API_KEY</code>) to restore Google Maps.
                </div>
                <div className="relative rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-[0_20px_60px_-20px_hsl(var(--primary)/0.35)]">
                  <OpenStreetMapFallback
                    center={mapCenter}
                    zoom={mapZoom}
                    markers={monuments.map((m) => ({
                      id: m.id,
                      position: m.position,
                      title: m.name,
                      description: m.description,
                      image_url: m.image_url,
                    }))}
                    userLocation={userLocation}
                    onMarkerClick={(id) => {
                      const m = monuments.find((x) => x.id === id);
                      if (m) {
                        setSelectedMonument(m);
                        setMapCenter(m.position);
                        setMapZoom(15);
                      }
                    }}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {monuments.map((monument) => (
                    <div
                      key={monument.id}
                      className="p-3.5 rounded-xl glass-panel glass-card-hover cursor-pointer border border-white/5 flex gap-3.5 items-center group transition-all"
                      onClick={() => {
                        setMapCenter(monument.position);
                        setMapZoom(15);
                        setSelectedMonument(monument);
                      }}
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted/40 shadow-sm">
                        <img
                          src={monument.image_url || "/images/monuments/konark-temple.jpg"}
                          alt={monument.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/images/monuments/konark-temple.jpg";
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] uppercase font-bold text-primary tracking-wider block">
                          {monument.category || "Monument"}
                        </span>
                        <h4 className="font-semibold text-sm truncate text-foreground group-hover:text-primary transition-colors">
                          {monument.name}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {monument.location || monument.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : !mapsLoaded ? (
              <div className="flex flex-col items-center justify-center h-[600px] gap-3 rounded-lg bg-muted/30">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading map…</p>
              </div>
            ) : (
              <>
                {/* Map — uses global script so renders instantly */}
                <div className="relative rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-[0_20px_60px_-20px_hsl(var(--primary)/0.35)]">
                  {/* Soft primary glow around map edges */}
                  <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-primary/10 via-transparent to-primary/10 z-[1]" />
                  {monumentsLoading && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/60">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  )}
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={mapCenter}
                    zoom={mapZoom}
                    onLoad={(map) => setMap(map)}
                    options={{
                      tilt: 45,
                      heading: 0,
                      mapTypeId: "hybrid",
                      mapTypeControl: true,
                      streetViewControl: true,
                      fullscreenControl: true,
                      zoomControl: true,
                      scaleControl: true,
                      styles: [
                        {
                          featureType: "poi",
                          elementType: "labels",
                          stylers: [{ visibility: "off" }],
                        },
                      ],
                    }}
                  >
                    {/* Display route if available */}
                    {directions && (
                      <DirectionsRenderer
                        directions={directions}
                        options={{
                          polylineOptions: {
                            strokeColor: '#e07a3f',
                            strokeWeight: 5,
                            strokeOpacity: 0.8
                          },
                          suppressMarkers: false
                        }}
                      />
                    )}

                    {/* Show monument markers always */}
                    {monuments.map((monument) => (
                      <Marker
                        key={monument.id}
                        position={monument.position}
                        onClick={() => setSelectedMonument(monument)}
                        icon={{
                          url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='%23e07a3f'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E"
                        }}
                      />
                    ))}

                    {/* User's current location marker */}
                    {userLocation && (
                      <Marker
                        position={userLocation}
                        icon={{
                          url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='%234285F4'%3E%3Ccircle cx='12' cy='12' r='8' fill='%234285F4' stroke='white' stroke-width='3'/%3E%3C/svg%3E"
                        }}
                        title="Your Location"
                      />
                    )}

                    {selectedMonument && !directions && (
                      <InfoWindow
                        position={selectedMonument.position}
                        onCloseClick={() => setSelectedMonument(null)}
                      >
                        <div className="p-2 max-w-[240px]">
                          {selectedMonument.image_url && (
                            <img
                              src={selectedMonument.image_url}
                              alt={selectedMonument.name}
                              className="w-full h-28 object-cover rounded-md mb-2"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          )}
                          <h3 className="font-bold text-base mb-1">{selectedMonument.name}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-3">
                            {selectedMonument.description || "—"}
                          </p>
                        </div>
                      </InfoWindow>
                    )}
                  </GoogleMap>
                </div>

                {/* Monument List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {monuments.map((monument) => (
                    <div
                      key={monument.id}
                      className="p-3.5 rounded-xl glass-panel glass-card-hover cursor-pointer border border-white/5 flex gap-3.5 items-center group transition-all"
                      onClick={() => {
                        setMapCenter(monument.position);
                        setMapZoom(15);
                        setSelectedMonument(monument);
                      }}
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted/40 shadow-sm">
                        <img
                          src={monument.image_url || "/images/monuments/konark-temple.jpg"}
                          alt={monument.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/images/monuments/konark-temple.jpg";
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] uppercase font-bold text-primary tracking-wider block">
                          {monument.category || "Monument"}
                        </span>
                        <h4 className="font-semibold text-sm truncate text-foreground group-hover:text-primary transition-colors">
                          {monument.name}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {monument.location || monument.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default MonumentsMap;
