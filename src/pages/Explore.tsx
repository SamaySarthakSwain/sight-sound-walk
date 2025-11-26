import PreferencesSection from "@/components/PreferencesSection";
import RouteSection from "@/components/RouteSection";
import MonumentsMap from "@/components/MonumentsMap";
import Navigation from "@/components/Navigation";
import { useState } from "react";

interface RouteData {
  start: { lat: number; lng: number };
  end: { lat: number; lng: number };
  waypoints?: { lat: number; lng: number }[];
}

const Explore = () => {
  const [routeData, setRouteData] = useState<RouteData | null>(null);

  const handleRouteSelected = (
    start: { lat: number; lng: number }, 
    end: { lat: number; lng: number },
    waypoints?: { lat: number; lng: number }[]
  ) => {
    setRouteData({ start, end, waypoints });
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-16">
        <PreferencesSection />
        <RouteSection onRouteSelected={handleRouteSelected} />
        <MonumentsMap routeData={routeData} />
      </div>
    </div>
  );
};

export default Explore;
