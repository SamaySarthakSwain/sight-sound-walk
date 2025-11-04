import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Map as MapIcon } from "lucide-react";

const GOOGLE_MAPS_API_KEY = "AIzaSyBVVkTWwfx3NW6bFi1t7CEomwv1owCO1SI";

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

const center = {
  lat: 20.2961,
  lng: 85.8245
};

const MonumentsMap = () => {
  const [selectedMonument, setSelectedMonument] = useState<typeof monuments[0] | null>(null);

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
            <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={9}
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
                {monuments.map((monument) => (
                  <Marker
                    key={monument.id}
                    position={monument.position}
                    onClick={() => setSelectedMonument(monument)}
                    icon={{
                      url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='%23e07a3f'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E"
                    }}
                  />
                ))}

                {selectedMonument && (
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
