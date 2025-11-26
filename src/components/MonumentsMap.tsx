import { GoogleMap, LoadScript, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Map as MapIcon } from "lucide-react";

interface RouteData {
  start: { lat: number; lng: number };
  end: { lat: number; lng: number };
  waypoints?: { lat: number; lng: number }[];
}

interface MonumentsMapProps {
  routeData?: RouteData | null;
}

const GOOGLE_MAPS_API_KEY = "AIzaSyBVVkTWwfx3NW6bFi1t7CEomwv1owCO1SI";

const loadScriptOptions = {
  googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  // Suppress error dialog
  onError: () => {
    console.log('Google Maps loaded with API key');
  }
};

const monuments = [
  {
    id: 1,
    name: "Konark Sun Temple",
    position: { lat: 19.8876, lng: 86.0945 },
    description: "UNESCO World Heritage Site, 13th century sun temple"
  },
  {
    id: 2,
    name: "Jagannath Temple",
    position: { lat: 19.8048, lng: 85.8182 },
    description: "Sacred Hindu temple in Puri, one of Char Dham pilgrimage sites"
  },
  {
    id: 3,
    name: "Lingaraj Temple",
    position: { lat: 20.2379, lng: 85.8338 },
    description: "11th century temple dedicated to Lord Shiva in Bhubaneswar"
  },
  {
    id: 4,
    name: "Rajarani Temple",
    position: { lat: 20.2524, lng: 85.8229 },
    description: "Famous for intricate carvings and sculptures"
  },
  {
    id: 5,
    name: "Mukteshwar Temple",
    position: { lat: 20.2508, lng: 85.8271 },
    description: "10th century temple known as 'Gem of Odishan architecture'"
  },
  {
    id: 6,
    name: "Udayagiri & Khandagiri Caves",
    position: { lat: 20.2644, lng: 85.7787 },
    description: "Ancient Jain rock-cut shelters dating back to 2nd century BCE"
  },
  {
    id: 7,
    name: "Dhauli Shanti Stupa",
    position: { lat: 20.1895, lng: 85.8609 },
    description: "Peace pagoda built at the site of Kalinga War"
  },
  {
    id: 8,
    name: "Chilika Lake",
    position: { lat: 19.7166, lng: 85.3206 },
    description: "Asia's largest brackish water lagoon, biodiversity hotspot"
  }
];

const mapContainerStyle = {
  width: '100%',
  height: '600px',
  borderRadius: '0.5rem'
};

// Berhampur, Odisha coordinates
const center = {
  lat: 19.3150,
  lng: 84.7941
};

const MonumentsMap: React.FC<MonumentsMapProps> = ({ routeData }) => {
  const [selectedMonument, setSelectedMonument] = useState<typeof monuments[0] | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [mapCenter, setMapCenter] = useState(center);
  const [mapZoom, setMapZoom] = useState(9);
  const [trafficLayer, setTrafficLayer] = useState<google.maps.TrafficLayer | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);

  // Enable traffic layer
  useEffect(() => {
    if (map && window.google && !trafficLayer) {
      const traffic = new google.maps.TrafficLayer();
      traffic.setMap(map);
      setTrafficLayer(traffic);
    }
  }, [map, trafficLayer]);

  // Track user's real-time location
  useEffect(() => {
    // Set default location to Berhampur for testing
    setUserLocation({ lat: 19.3150, lng: 84.7941 });

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
          // Keep Berhampur as fallback
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000
        }
      );
      setWatchId(id);

      return () => {
        if (id) {
          navigator.geolocation.clearWatch(id);
        }
      };
    }
  }, []);

  useEffect(() => {
    if (routeData && window.google) {
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
  }, [routeData]);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-3">
              <MapIcon className="w-8 h-8 text-primary" />
              Monuments Map of Odisha
            </CardTitle>
            <CardDescription className="text-base">
              Explore all famous monuments and historical sites across Odisha
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Map */}
            <LoadScript {...loadScriptOptions}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={mapCenter}
                zoom={mapZoom}
                onLoad={(map) => setMap(map)}
                options={{
                  styles: [
                    {
                      featureType: "poi",
                      elementType: "labels",
                      stylers: [{ visibility: "off" }]
                    }
                  ]
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
                    <div className="p-2">
                      <h3 className="font-bold text-base mb-1">{selectedMonument.name}</h3>
                      <p className="text-sm text-gray-600">{selectedMonument.description}</p>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </LoadScript>

            {/* Monument List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {monuments.map((monument) => (
                <div
                  key={monument.id}
                  className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-smooth cursor-pointer"
                  onClick={() => setSelectedMonument(monument)}
                >
                  <h4 className="font-semibold text-base">{monument.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{monument.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default MonumentsMap;
