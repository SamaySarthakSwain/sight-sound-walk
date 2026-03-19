import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Navigation, MapPin, Route, Clock, Landmark, ChevronDown, Loader2 } from "lucide-react";
import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useMonuments } from "@/hooks/useMonuments";
import { cn } from "@/lib/utils";

interface RouteSectionProps {
  onRouteSelected?: (
    start: { lat: number; lng: number },
    end: { lat: number; lng: number },
    waypoints?: { lat: number; lng: number }[]
  ) => void;
}

interface Monument {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description: string;
}

interface RouteInfo {
  distance: number;
  duration: number;
  monumentsOnRoute: Monument[];
}

type LocationEntry = { lat: number; lng: number; name: string; description: string };

const RouteSection: React.FC<RouteSectionProps> = ({ onRouteSelected }) => {
  const { monuments, loading } = useMonuments();
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [startDisplay, setStartDisplay] = useState("");
  const [endDisplay, setEndDisplay] = useState("");
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);
  const [availableTime, setAvailableTime] = useState("");
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [selectedWaypoints, setSelectedWaypoints] = useState<Monument[]>([]);

  // Build location map from DB monuments that have coordinates (for route planning and search)
  const locationMap = useMemo((): Record<string, LocationEntry> => {
    const map: Record<string, LocationEntry> = {};
    for (const m of monuments) {
      if (m.latitude != null && m.longitude != null) {
        map[m.id] = {
          lat: m.latitude,
          lng: m.longitude,
          name: m.title,
          description: m.description || "",
        };
      }
    }
    return map;
  }, [monuments]);

  const routeLocations = useMemo(() => Object.entries(locationMap).map(([id, loc]) => ({ id, ...loc })), [locationMap]);

  // Calculate distance between two points (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Calculate if a point is near the route
  const isNearRoute = (pointLat: number, pointLng: number, startLat: number, startLng: number, endLat: number, endLng: number): boolean => {
    const distanceToStart = calculateDistance(pointLat, pointLng, startLat, startLng);
    const distanceToEnd = calculateDistance(pointLat, pointLng, endLat, endLng);
    const routeDistance = calculateDistance(startLat, startLng, endLat, endLng);

    // Point is on route if: distance to start + distance to end ≈ route distance (with 20% tolerance)
    const totalDistance = distanceToStart + distanceToEnd;
    return totalDistance <= routeDistance * 1.2;
  };

  // Find monuments along the route (from DB locations)
  const findMonumentsOnRoute = (startId: string, endId: string): Monument[] => {
    const start = locationMap[startId];
    const end = locationMap[endId];
    if (!start || !end) return [];

    const monumentsOnRoute: Monument[] = [];
    for (const [id, location] of Object.entries(locationMap)) {
      if (id !== startId && id !== endId) {
        if (isNearRoute(location.lat, location.lng, start.lat, start.lng, end.lat, end.lng)) {
          monumentsOnRoute.push({
            id,
            name: location.name,
            lat: location.lat,
            lng: location.lng,
            description: location.description,
          });
        }
      }
    }
    return monumentsOnRoute;
  };

  const handlePlanRoute = async () => {
    if (startLocation && endLocation) {
      const start = locationMap[startLocation];
      const end = locationMap[endLocation];

      if (start && end) {
        // Calculate distance and estimated time
        const distance = calculateDistance(start.lat, start.lng, end.lat, end.lng);
        const duration = distance / 50; // Assuming average speed of 50 km/h

        // Find monuments along the route
        const monumentsOnRoute = findMonumentsOnRoute(startLocation, endLocation);

        setRouteInfo({
          distance,
          duration,
          monumentsOnRoute
        });
        setShowResults(true);
        setSelectedWaypoints([]);

        // Save search history if user is logged in
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { error } = await supabase
            .from('search_history')
            .insert({
              user_id: user.id,
              start_location: start.name,
              end_location: end.name,
            });

          if (error) {
            console.error('Error saving search history:', error);
          }
        }

        // Notify parent component to display route on embedded map
        if (onRouteSelected) {
          onRouteSelected(start, end);
        }
      }
    }
  };

  const handleAddStop = (monument: Monument) => {
    if (selectedWaypoints.find(w => w.id === monument.id)) {
      // Remove waypoint if already added
      const newWaypoints = selectedWaypoints.filter(w => w.id !== monument.id);
      setSelectedWaypoints(newWaypoints);

      // Update route with new waypoints
      if (startLocation && endLocation && onRouteSelected) {
        const start = locationMap[startLocation];
        const end = locationMap[endLocation];
        if (start && end) {
          const waypoints = newWaypoints.map(w => ({ lat: w.lat, lng: w.lng }));
          onRouteSelected(start, end, waypoints);
        }
      }
    } else {
      // Add waypoint
      const newWaypoints = [...selectedWaypoints, monument];
      setSelectedWaypoints(newWaypoints);

      // Update route with new waypoints
      if (startLocation && endLocation && onRouteSelected) {
        const start = locationMap[startLocation];
        const end = locationMap[endLocation];
        if (start && end) {
          const waypoints = newWaypoints.map(w => ({ lat: w.lat, lng: w.lng }));
          onRouteSelected(start, end, waypoints);
        }
      }
    }
  };

  const openInGoogleMaps = () => {
    if (!startLocation || !endLocation) return;

    const start = locationMap[startLocation];
    const end = locationMap[endLocation];
    if (!start || !end) return;

    let url = `https://www.google.com/maps/dir/?api=1&origin=${start.lat},${start.lng}&destination=${end.lat},${end.lng}&travelmode=driving`;

    if (selectedWaypoints.length > 0) {
      const waypoints = selectedWaypoints.map(w => `${w.lat},${w.lng}`).join('|');
      url += `&waypoints=${waypoints}`;
    }

    // Create a temporary link element to trigger download/navigation
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getRecommendedMonuments = (): Monument[] => {
    if (!routeInfo || !availableTime) return routeInfo?.monumentsOnRoute || [];

    const timeInHours = parseFloat(availableTime);
    const travelTime = routeInfo.duration;
    const availableForVisits = timeInHours - travelTime;

    // Assume 1 hour per monument visit
    const maxMonuments = Math.floor(availableForVisits);

    return routeInfo.monumentsOnRoute.slice(0, Math.max(0, maxMonuments));
  };

  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-medium glass-card border-none">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-3">
                <Route className="w-8 h-8 text-primary" />
                Plan Your Journey
              </CardTitle>
              <CardDescription className="text-base">
                Set your route and discover monuments along the way with historical narration
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Start Location — searchable from DB */}
              <div className="space-y-2">
                <Label htmlFor="start" className="text-base font-semibold flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-secondary" />
                  Starting Point
                </Label>
                <Popover open={openStart} onOpenChange={setOpenStart}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openStart}
                      className={cn(
                        "w-full h-12 text-base justify-between font-normal",
                        !startDisplay && "text-muted-foreground"
                      )}
                    >
                      <span className="truncate">{startDisplay || "Type to search monuments..."}</span>
                      {loading ? (
                        <Loader2 className="ml-2 h-4 w-4 shrink-0 animate-spin opacity-50" />
                      ) : (
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search by name or location..." className="h-10" />
                      <CommandList>
                        <CommandEmpty>No monument found. Keep typing to search.</CommandEmpty>
                        <CommandGroup heading="Monuments from database">
                          {routeLocations.map((loc) => (
                            <CommandItem
                              key={loc.id}
                              value={`${loc.name} ${loc.description} ${loc.id}`}
                              onSelect={() => {
                                setStartLocation(loc.id);
                                setStartDisplay(loc.name);
                                setOpenStart(false);
                              }}
                              className="flex flex-col items-start gap-0.5 py-3"
                            >
                              <span className="font-medium">{loc.name}</span>
                              <span className="text-xs text-muted-foreground truncate w-full">{loc.description || "—"}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* End Location — searchable from DB */}
              <div className="space-y-2">
                <Label htmlFor="end" className="text-base font-semibold flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-accent" />
                  Destination
                </Label>
                <Popover open={openEnd} onOpenChange={setOpenEnd}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openEnd}
                      className={cn(
                        "w-full h-12 text-base justify-between font-normal",
                        !endDisplay && "text-muted-foreground"
                      )}
                    >
                      <span className="truncate">{endDisplay || "Type to search monuments..."}</span>
                      {loading ? (
                        <Loader2 className="ml-2 h-4 w-4 shrink-0 animate-spin opacity-50" />
                      ) : (
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search by name or location..." className="h-10" />
                      <CommandList>
                        <CommandEmpty>No monument found. Keep typing to search.</CommandEmpty>
                        <CommandGroup heading="Monuments from database">
                          {routeLocations.map((loc) => (
                            <CommandItem
                              key={loc.id}
                              value={`${loc.name} ${loc.description} ${loc.id}`}
                              onSelect={() => {
                                setEndLocation(loc.id);
                                setEndDisplay(loc.name);
                                setOpenEnd(false);
                              }}
                              className="flex flex-col items-start gap-0.5 py-3"
                            >
                              <span className="font-medium">{loc.name}</span>
                              <span className="text-xs text-muted-foreground truncate w-full">{loc.description || "—"}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Available Time Input */}
              <div className="space-y-2">
                <Label htmlFor="time" className="text-base font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  How much time do you have? (in hours)
                </Label>
                <Input
                  id="time"
                  type="number"
                  min="1"
                  step="0.5"
                  placeholder="e.g., 4"
                  value={availableTime}
                  onChange={(e) => setAvailableTime(e.target.value)}
                  className="h-12 text-base"
                />
              </div>

              {/* Action Button */}
              <Button
                onClick={handlePlanRoute}
                disabled={!startLocation || !endLocation}
                className="w-full h-12 text-base bg-gradient-hero hover:shadow-glow transition-smooth"
              >
                <Navigation className="w-5 h-5 mr-2" />
                Start Educational Journey
              </Button>

              {/* Info Box */}
              <div className="p-4 rounded-lg glass-panel space-y-2 border-transparent">
                <h4 className="font-semibold text-secondary">What happens next?</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Route displays monuments along your path</li>
                  <li>• GPS tracks your location in real-time</li>
                  <li>• Notifications alert you as you approach sites</li>
                  <li>• Choose audio narration or text summaries</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Route Results */}
          {showResults && routeInfo && (
            <Card className="mt-6 shadow-medium animate-in fade-in slide-in-from-bottom-4 glass-card border-none">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Route className="w-7 h-7 text-primary" />
                  Your Educational Journey
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Journey Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg glass-panel border-transparent">
                    <div className="text-sm text-muted-foreground mb-1">Total Distance</div>
                    <div className="text-2xl font-bold text-primary">
                      {routeInfo.distance.toFixed(1)} km
                    </div>
                  </div>
                  <div className="p-4 rounded-lg glass-panel border-transparent">
                    <div className="text-sm text-muted-foreground mb-1">Travel Time</div>
                    <div className="text-2xl font-bold text-secondary">
                      {Math.floor(routeInfo.duration)}h {Math.round((routeInfo.duration % 1) * 60)}m
                    </div>
                  </div>
                </div>

                {/* Monuments on Route */}
                {routeInfo.monumentsOnRoute.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <Landmark className="w-5 h-5 text-accent" />
                      Monuments Along Your Route ({routeInfo.monumentsOnRoute.length})
                    </h3>
                    <div className="space-y-3">
                      {routeInfo.monumentsOnRoute.map((monument, index) => {
                        const isAdded = selectedWaypoints.find(w => w.id === monument.id);
                        return (
                          <div
                            key={monument.id}
                            className={`p-4 rounded-xl glass-panel transition-all hover:-translate-y-1 ${isAdded
                                ? 'ring-2 ring-primary border-transparent'
                                : 'border-white/10 hover:border-primary/50 text-foreground'
                              }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-lg mb-1">{monument.name}</h4>
                                <p className="text-sm text-muted-foreground mb-3">{monument.description}</p>
                                <Button
                                  onClick={() => handleAddStop(monument)}
                                  size="sm"
                                  variant={isAdded ? "secondary" : "outline"}
                                  className="w-full"
                                >
                                  {isAdded ? "✓ Added to Route" : "+ Add Stop"}
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Recommended Itinerary */}
                {availableTime && (
                  <div className="p-5 rounded-xl glass-panel border-white/20">
                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      Recommended Itinerary for {availableTime} hours
                    </h3>
                    {getRecommendedMonuments().length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground mb-3">
                          Based on your available time, we recommend visiting these monuments:
                        </p>
                        <ul className="space-y-2">
                          {getRecommendedMonuments().map((monument) => (
                            <li key={monument.id} className="flex items-start gap-2">
                              <span className="text-primary mt-1">✓</span>
                              <div>
                                <span className="font-medium">{monument.name}</span>
                                <span className="text-sm text-muted-foreground ml-2">(~1 hour visit)</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                        <p className="text-sm text-muted-foreground mt-4">
                          Total journey time: ~{(routeInfo.duration + getRecommendedMonuments().length).toFixed(1)} hours
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Your available time ({availableTime}h) covers the travel time ({routeInfo.duration.toFixed(1)}h).
                        Consider adding more time to visit monuments along the way!
                      </p>
                    )}
                  </div>
                )}

                {!availableTime && routeInfo.monumentsOnRoute.length > 0 && (
                  <div className="p-4 rounded-xl glass-panel border-white/20">
                    <p className="text-sm text-muted-foreground">
                      💡 Enter your available time above to get a personalized itinerary!
                    </p>
                  </div>
                )}

                {/* Open in Google Maps Button */}
                <div className="space-y-2">
                  <Button
                    onClick={openInGoogleMaps}
                    className="w-full h-12 text-base"
                    variant="outline"
                  >
                    <Navigation className="w-5 h-5 mr-2" />
                    Open in Google Maps
                    {selectedWaypoints.length > 0 && ` (${selectedWaypoints.length} stops)`}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Note: External links may be blocked in preview. This will work when you publish your app.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

export default RouteSection;
