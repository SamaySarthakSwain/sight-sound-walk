import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Navigation, MapPin, Route, Clock, Landmark } from "lucide-react";
import { useState } from "react";

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

const locations = {
  "konark-sun-temple": { lat: 19.8876, lng: 86.0945, name: "Konark Sun Temple", description: "13th century Sun Temple - UNESCO World Heritage Site" },
  "jagannath-temple": { lat: 19.8048, lng: 85.8182, name: "Jagannath Temple, Puri", description: "Famous temple of Lord Jagannath with annual Rath Yatra" },
  "lingaraj-temple": { lat: 20.2379, lng: 85.8338, name: "Lingaraj Temple, Bhubaneswar", description: "11th century temple dedicated to Lord Shiva" },
  "rajarani-temple": { lat: 20.2524, lng: 85.8229, name: "Rajarani Temple, Bhubaneswar", description: "11th century temple known for exquisite carvings" },
  "mukteshwar-temple": { lat: 20.2508, lng: 85.8271, name: "Mukteshwar Temple, Bhubaneswar", description: "10th century gem of Odishan architecture" },
  "udayagiri-khandagiri": { lat: 20.2644, lng: 85.7787, name: "Udayagiri & Khandagiri Caves", description: "Ancient Jain rock-cut caves from 2nd century BCE" },
  "dhauli-stupa": { lat: 20.1895, lng: 85.8609, name: "Dhauli Shanti Stupa", description: "Buddhist peace pagoda at historic Kalinga War site" },
  "chilika-lake": { lat: 19.7166, lng: 85.3206, name: "Chilika Lake", description: "Asia's largest brackish water lagoon" },
  "nist-university": { lat: 19.2950, lng: 84.8108, name: "NIST University, Berhampur", description: "Premier educational institution in Berhampur" },
  "budhi-thakurani": { lat: 19.3149, lng: 84.7941, name: "Maa Budhi Thakurani Temple", description: "Presiding deity of Berhampur" },
  "tara-tarini": { lat: 19.2905, lng: 84.9567, name: "Tara Tarini Temple", description: "Ancient Shakti Peetha on Kumari Hills" },
  "gopalpur-beach": { lat: 19.2590, lng: 84.9090, name: "Gopalpur-on-Sea", description: "Serene beach town with colonial heritage" },
  "taptapani": { lat: 19.4833, lng: 84.4167, name: "Taptapani Hot Springs", description: "Natural sulfur hot springs with medicinal properties" },
  "barabati-fort": { lat: 20.4625, lng: 85.8830, name: "Barabati Fort, Cuttack", description: "14th century fort with moat and ramparts" },
  "ratnagiri": { lat: 20.6167, lng: 86.3333, name: "Ratnagiri Buddhist Site", description: "Buddhist Diamond Triangle monastery site" }
};

const RouteSection: React.FC<RouteSectionProps> = ({ onRouteSelected }) => {
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [availableTime, setAvailableTime] = useState("");
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [selectedWaypoints, setSelectedWaypoints] = useState<Monument[]>([]);

  // Calculate distance between two points (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
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

  // Find monuments along the route
  const findMonumentsOnRoute = (startKey: string, endKey: string): Monument[] => {
    const start = locations[startKey as keyof typeof locations];
    const end = locations[endKey as keyof typeof locations];
    
    const monumentsOnRoute: Monument[] = [];
    
    Object.entries(locations).forEach(([key, location]) => {
      if (key !== startKey && key !== endKey) {
        if (isNearRoute(location.lat, location.lng, start.lat, start.lng, end.lat, end.lng)) {
          monumentsOnRoute.push({
            id: key,
            name: location.name,
            lat: location.lat,
            lng: location.lng,
            description: location.description
          });
        }
      }
    });
    
    return monumentsOnRoute;
  };

  const handlePlanRoute = () => {
    if (startLocation && endLocation) {
      const start = locations[startLocation as keyof typeof locations];
      const end = locations[endLocation as keyof typeof locations];
      
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
        const start = locations[startLocation as keyof typeof locations];
        const end = locations[endLocation as keyof typeof locations];
        const waypoints = newWaypoints.map(w => ({ lat: w.lat, lng: w.lng }));
        onRouteSelected(start, end, waypoints);
      }
    } else {
      // Add waypoint
      const newWaypoints = [...selectedWaypoints, monument];
      setSelectedWaypoints(newWaypoints);
      
      // Update route with new waypoints
      if (startLocation && endLocation && onRouteSelected) {
        const start = locations[startLocation as keyof typeof locations];
        const end = locations[endLocation as keyof typeof locations];
        const waypoints = newWaypoints.map(w => ({ lat: w.lat, lng: w.lng }));
        onRouteSelected(start, end, waypoints);
      }
    }
  };

  const openInGoogleMaps = () => {
    if (!startLocation || !endLocation) return;
    
    const start = locations[startLocation as keyof typeof locations];
    const end = locations[endLocation as keyof typeof locations];
    
    let url = `https://www.google.com/maps/dir/?api=1&origin=${start.lat},${start.lng}&destination=${end.lat},${end.lng}`;
    
    if (selectedWaypoints.length > 0) {
      const waypoints = selectedWaypoints.map(w => `${w.lat},${w.lng}`).join('|');
      url += `&waypoints=${waypoints}`;
    }
    
    window.open(url, '_blank');
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
          <Card className="shadow-medium">
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
              {/* Start Location */}
              <div className="space-y-2">
                <Label htmlFor="start" className="text-base font-semibold flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-secondary" />
                  Starting Point
                </Label>
                <Select value={startLocation} onValueChange={setStartLocation}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Select starting monument" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nist-university">NIST University, Berhampur</SelectItem>
                    <SelectItem value="budhi-thakurani">Maa Budhi Thakurani Temple</SelectItem>
                    <SelectItem value="tara-tarini">Tara Tarini Temple</SelectItem>
                    <SelectItem value="konark-sun-temple">Konark Sun Temple</SelectItem>
                    <SelectItem value="jagannath-temple">Jagannath Temple, Puri</SelectItem>
                    <SelectItem value="lingaraj-temple">Lingaraj Temple, Bhubaneswar</SelectItem>
                    <SelectItem value="rajarani-temple">Rajarani Temple, Bhubaneswar</SelectItem>
                    <SelectItem value="mukteshwar-temple">Mukteshwar Temple, Bhubaneswar</SelectItem>
                    <SelectItem value="udayagiri-khandagiri">Udayagiri & Khandagiri Caves</SelectItem>
                    <SelectItem value="dhauli-stupa">Dhauli Shanti Stupa</SelectItem>
                    <SelectItem value="chilika-lake">Chilika Lake</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* End Location */}
              <div className="space-y-2">
                <Label htmlFor="end" className="text-base font-semibold flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-accent" />
                  Destination
                </Label>
                <Select value={endLocation} onValueChange={setEndLocation}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Select destination monument" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nist-university">NIST University, Berhampur</SelectItem>
                    <SelectItem value="budhi-thakurani">Maa Budhi Thakurani Temple</SelectItem>
                    <SelectItem value="tara-tarini">Tara Tarini Temple</SelectItem>
                    <SelectItem value="konark-sun-temple">Konark Sun Temple</SelectItem>
                    <SelectItem value="jagannath-temple">Jagannath Temple, Puri</SelectItem>
                    <SelectItem value="lingaraj-temple">Lingaraj Temple, Bhubaneswar</SelectItem>
                    <SelectItem value="rajarani-temple">Rajarani Temple, Bhubaneswar</SelectItem>
                    <SelectItem value="mukteshwar-temple">Mukteshwar Temple, Bhubaneswar</SelectItem>
                    <SelectItem value="udayagiri-khandagiri">Udayagiri & Khandagiri Caves</SelectItem>
                    <SelectItem value="dhauli-stupa">Dhauli Shanti Stupa</SelectItem>
                    <SelectItem value="chilika-lake">Chilika Lake</SelectItem>
                  </SelectContent>
                </Select>
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
              <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20 space-y-2">
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
            <Card className="mt-6 shadow-medium animate-in fade-in slide-in-from-bottom-4">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Route className="w-7 h-7 text-primary" />
                  Your Educational Journey
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Journey Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="text-sm text-muted-foreground mb-1">Total Distance</div>
                    <div className="text-2xl font-bold text-primary">
                      {routeInfo.distance.toFixed(1)} km
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
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
                            className={`p-4 rounded-lg border transition-colors ${
                              isAdded 
                                ? 'bg-primary/10 border-primary' 
                                : 'bg-background border-border hover:border-primary/50'
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
                  <div className="p-5 rounded-lg bg-gradient-subtle border border-primary/30">
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
                  <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                    <p className="text-sm text-muted-foreground">
                      💡 Enter your available time above to get a personalized itinerary!
                    </p>
                  </div>
                )}

                {/* Open in Google Maps Button */}
                <Button
                  onClick={openInGoogleMaps}
                  className="w-full h-12 text-base"
                  variant="outline"
                >
                  <Navigation className="w-5 h-5 mr-2" />
                  Open in Google Maps
                  {selectedWaypoints.length > 0 && ` (${selectedWaypoints.length} stops)`}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

export default RouteSection;
