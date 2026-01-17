import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { GoogleMap, Marker, DirectionsRenderer, Autocomplete } from "@react-google-maps/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Plus, X, Navigation, Locate } from "lucide-react";
import { toast } from "sonner";
import { useCity } from "@/contexts/CityContext";

interface Location {
  lat: number;
  lng: number;
  name: string;
}

interface CabMapSelectorProps {
  onRouteCalculated: (
    start: Location,
    end: Location,
    stops: Location[],
    distanceKm: number,
    durationMins: number
  ) => void;
}

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const CabMapSelector = ({ onRouteCalculated }: CabMapSelectorProps) => {
  const { cityLat, cityLng } = useCity();
  
  const defaultCenter = useMemo(() => ({
    lat: cityLat,
    lng: cityLng,
  }), [cityLat, cityLng]);

  const [startLocation, setStartLocation] = useState<Location | null>(null);
  const [endLocation, setEndLocation] = useState<Location | null>(null);
  const [stops, setStops] = useState<Location[]>([]);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [selectionMode, setSelectionMode] = useState<"start" | "end" | "stop" | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const mapRef = useRef<google.maps.Map | null>(null);
  const startAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const endAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          console.log("Could not get user location");
        }
      );
    }
  }, []);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const handleMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (!event.latLng || !selectionMode) return;

      const location: Location = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
        name: `${event.latLng.lat().toFixed(4)}, ${event.latLng.lng().toFixed(4)}`,
      };

      // Reverse geocode to get address
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: event.latLng }, (results, status) => {
        if (status === "OK" && results?.[0]) {
          location.name = results[0].formatted_address;
        }

        if (selectionMode === "start") {
          setStartLocation(location);
          toast.success("Starting point set!");
        } else if (selectionMode === "end") {
          setEndLocation(location);
          toast.success("Destination set!");
        } else if (selectionMode === "stop") {
          setStops((prev) => [...prev, location]);
          toast.success("Stop added!");
        }
        setSelectionMode(null);
      });
    },
    [selectionMode]
  );

  const handleMarkerDrag = useCallback(
    (type: "start" | "end" | number, event: google.maps.MapMouseEvent) => {
      if (!event.latLng) return;

      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: event.latLng }, (results, status) => {
        const name =
          status === "OK" && results?.[0]
            ? results[0].formatted_address
            : `${event.latLng!.lat().toFixed(4)}, ${event.latLng!.lng().toFixed(4)}`;

        const location: Location = {
          lat: event.latLng!.lat(),
          lng: event.latLng!.lng(),
          name,
        };

        if (type === "start") {
          setStartLocation(location);
        } else if (type === "end") {
          setEndLocation(location);
        } else if (typeof type === "number") {
          setStops((prev) =>
            prev.map((stop, i) => (i === type ? location : stop))
          );
        }
      });
    },
    []
  );

  const handlePlaceSelect = useCallback(
    (autocomplete: google.maps.places.Autocomplete | null, type: "start" | "end") => {
      if (!autocomplete) return;

      const place = autocomplete.getPlace();
      if (!place.geometry?.location) return;

      const location: Location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        name: place.formatted_address || place.name || "",
      };

      if (type === "start") {
        setStartLocation(location);
      } else {
        setEndLocation(location);
      }

      if (mapRef.current && place.geometry.location) {
        mapRef.current.panTo(place.geometry.location);
        mapRef.current.setZoom(14);
      }
    },
    []
  );

  const removeStop = (index: number) => {
    setStops((prev) => prev.filter((_, i) => i !== index));
  };

  const useCurrentLocation = () => {
    if (userLocation) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: userLocation }, (results, status) => {
        const name =
          status === "OK" && results?.[0]
            ? results[0].formatted_address
            : "Your Location";

        setStartLocation({
          ...userLocation,
          name,
        });
        toast.success("Using your current location!");
      });
    } else {
      toast.error("Could not get your location");
    }
  };

  const calculateRoute = useCallback(() => {
    if (!startLocation || !endLocation) {
      toast.error("Please select start and end locations");
      return;
    }

    const directionsService = new google.maps.DirectionsService();

    const waypoints = stops.map((stop) => ({
      location: { lat: stop.lat, lng: stop.lng },
      stopover: true,
    }));

    directionsService.route(
      {
        origin: { lat: startLocation.lat, lng: startLocation.lng },
        destination: { lat: endLocation.lat, lng: endLocation.lng },
        waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: true,
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);

          // Calculate total distance and duration
          let totalDistance = 0;
          let totalDuration = 0;

          result.routes[0].legs.forEach((leg) => {
            totalDistance += leg.distance?.value || 0;
            totalDuration += leg.duration?.value || 0;
          });

          const distanceKm = totalDistance / 1000;
          const durationMins = Math.ceil(totalDuration / 60);

          onRouteCalculated(startLocation, endLocation, stops, distanceKm, durationMins);
          toast.success(`Route calculated: ${distanceKm.toFixed(1)} km, ~${durationMins} min`);
        } else {
          toast.error("Could not calculate route");
        }
      }
    );
  }, [startLocation, endLocation, stops, onRouteCalculated]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Select Route on Map
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Inputs */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Starting Point</label>
            <div className="flex gap-2">
              <Autocomplete
                onLoad={(autocomplete) => {
                  startAutocompleteRef.current = autocomplete;
                }}
                onPlaceChanged={() =>
                  handlePlaceSelect(startAutocompleteRef.current, "start")
                }
                className="flex-1"
              >
                <Input
                  placeholder="Search or click on map..."
                  value={startLocation?.name || ""}
                  onChange={(e) =>
                    setStartLocation((prev) =>
                      prev ? { ...prev, name: e.target.value } : null
                    )
                  }
                />
              </Autocomplete>
              <Button
                variant="outline"
                size="icon"
                onClick={useCurrentLocation}
                title="Use my location"
              >
                <Locate className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Destination</label>
            <Autocomplete
              onLoad={(autocomplete) => {
                endAutocompleteRef.current = autocomplete;
              }}
              onPlaceChanged={() =>
                handlePlaceSelect(endAutocompleteRef.current, "end")
              }
            >
              <Input
                placeholder="Search or click on map..."
                value={endLocation?.name || ""}
                onChange={(e) =>
                  setEndLocation((prev) =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
                }
              />
            </Autocomplete>
          </div>
        </div>

        {/* Stops */}
        {stops.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Stops</label>
            <div className="flex flex-wrap gap-2">
              {stops.map((stop, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full text-sm"
                >
                  <span className="truncate max-w-[200px]">{stop.name}</span>
                  <button onClick={() => removeStop(index)}>
                    <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selection Mode Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectionMode === "start" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectionMode(selectionMode === "start" ? null : "start")}
          >
            <MapPin className="w-4 h-4 mr-2" />
            {selectionMode === "start" ? "Click on map..." : "Set Start"}
          </Button>
          <Button
            variant={selectionMode === "end" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectionMode(selectionMode === "end" ? null : "end")}
          >
            <Navigation className="w-4 h-4 mr-2" />
            {selectionMode === "end" ? "Click on map..." : "Set Destination"}
          </Button>
          <Button
            variant={selectionMode === "stop" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectionMode(selectionMode === "stop" ? null : "stop")}
          >
            <Plus className="w-4 h-4 mr-2" />
            {selectionMode === "stop" ? "Click on map..." : "Add Stop"}
          </Button>
        </div>

        {/* Map */}
        <div className="rounded-lg overflow-hidden border">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={userLocation || defaultCenter}
            zoom={12}
            onLoad={onMapLoad}
            onClick={handleMapClick}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
            }}
          >
            {/* Start Marker */}
            {startLocation && (
              <Marker
                position={{ lat: startLocation.lat, lng: startLocation.lng }}
                draggable
                onDragEnd={(e) => handleMarkerDrag("start", e)}
                label={{ text: "A", color: "white" }}
              />
            )}

            {/* End Marker */}
            {endLocation && (
              <Marker
                position={{ lat: endLocation.lat, lng: endLocation.lng }}
                draggable
                onDragEnd={(e) => handleMarkerDrag("end", e)}
                label={{ text: "B", color: "white" }}
              />
            )}

            {/* Stop Markers */}
            {stops.map((stop, index) => (
              <Marker
                key={index}
                position={{ lat: stop.lat, lng: stop.lng }}
                draggable
                onDragEnd={(e) => handleMarkerDrag(index, e)}
                label={{ text: `${index + 1}`, color: "white" }}
              />
            ))}

            {/* Directions */}
            {directions && (
              <DirectionsRenderer
                directions={directions}
                options={{
                  suppressMarkers: true,
                  polylineOptions: {
                    strokeColor: "#4F46E5",
                    strokeWeight: 5,
                  },
                }}
              />
            )}
          </GoogleMap>
        </div>

        {/* Calculate Button */}
        <Button
          className="w-full"
          onClick={calculateRoute}
          disabled={!startLocation || !endLocation}
        >
          Calculate Route & Compare Fares
        </Button>
      </CardContent>
    </Card>
  );
};

export default CabMapSelector;
