import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navigation, MapPin, Route } from "lucide-react";
import { useState } from "react";

const RouteSection = () => {
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");

  const handlePlanRoute = () => {
    if (startLocation && endLocation) {
      console.log("Planning route from", startLocation, "to", endLocation);
      // Route planning logic will be implemented here
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
                <Input
                  id="start"
                  placeholder="Enter your starting location"
                  value={startLocation}
                  onChange={(e) => setStartLocation(e.target.value)}
                  className="h-12 text-base"
                />
              </div>

              {/* End Location */}
              <div className="space-y-2">
                <Label htmlFor="end" className="text-base font-semibold flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-accent" />
                  Destination
                </Label>
                <Input
                  id="end"
                  placeholder="Enter your destination"
                  value={endLocation}
                  onChange={(e) => setEndLocation(e.target.value)}
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
        </div>
      </div>
    </section>
  );
};

export default RouteSection;
