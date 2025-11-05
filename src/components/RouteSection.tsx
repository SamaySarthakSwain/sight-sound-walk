import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navigation, MapPin, Route } from "lucide-react";
import { useState } from "react";

interface RouteSectionProps {
  onRouteSelected?: (start: string, end: string) => void;
}

const locations = {
  "konark-sun-temple": { lat: 19.8876, lng: 86.0945, name: "Konark Sun Temple" },
  "jagannath-temple": { lat: 19.8048, lng: 85.8182, name: "Jagannath Temple, Puri" },
  "lingaraj-temple": { lat: 20.2379, lng: 85.8338, name: "Lingaraj Temple, Bhubaneswar" },
  "rajarani-temple": { lat: 20.2524, lng: 85.8229, name: "Rajarani Temple, Bhubaneswar" },
  "mukteshwar-temple": { lat: 20.2508, lng: 85.8271, name: "Mukteshwar Temple, Bhubaneswar" },
  "udayagiri-khandagiri": { lat: 20.2644, lng: 85.7787, name: "Udayagiri & Khandagiri Caves" },
  "dhauli-stupa": { lat: 20.1895, lng: 85.8609, name: "Dhauli Shanti Stupa" },
  "chilika-lake": { lat: 19.7166, lng: 85.3206, name: "Chilika Lake" },
  "nist-university": { lat: 19.2950, lng: 84.8108, name: "NIST University, Berhampur" },
  "budhi-thakurani": { lat: 19.3149, lng: 84.7941, name: "Maa Budhi Thakurani Temple" },
  "tara-tarini": { lat: 19.2905, lng: 84.9567, name: "Tara Tarini Temple" }
};

const RouteSection: React.FC<RouteSectionProps> = ({ onRouteSelected }) => {
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");

  const handlePlanRoute = () => {
    if (startLocation && endLocation) {
      const start = locations[startLocation as keyof typeof locations];
      const end = locations[endLocation as keyof typeof locations];
      
      if (start && end) {
        // Open Google Maps with directions
        const url = `https://www.google.com/maps/dir/?api=1&origin=${start.lat},${start.lng}&destination=${end.lat},${end.lng}&travelmode=driving`;
        window.open(url, '_blank');
        
        // Also notify parent component if callback provided
        if (onRouteSelected) {
          onRouteSelected(startLocation, endLocation);
        }
      }
    }
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
        </div>
      </div>
    </section>
  );
};

export default RouteSection;
