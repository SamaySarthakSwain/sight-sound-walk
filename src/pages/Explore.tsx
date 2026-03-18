import PreferencesSection from "@/components/PreferencesSection";
import RouteSection from "@/components/RouteSection";
import MonumentsMap from "@/components/MonumentsMap";
import Navigation from "@/components/Navigation";
import MonumentSearch from "@/components/MonumentSearch";
import { useState } from "react";

interface RouteData {
  start: { lat: number; lng: number };
  end: { lat: number; lng: number };
  waypoints?: { lat: number; lng: number }[];
}

const Explore = () => {
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [selectedMonumentId, setSelectedMonumentId] = useState<string | null>(null);

  const handleRouteSelected = (
    start: { lat: number; lng: number }, 
    end: { lat: number; lng: number },
    waypoints?: { lat: number; lng: number }[]
  ) => {
    setRouteData({ start, end, waypoints });
  };

  const handleMonumentSelect = (monumentId: string) => {
    setSelectedMonumentId(monumentId);
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-24 pb-12 bg-gradient-to-b from-background to-black/20">
        <div className="container mx-auto px-4 mb-2">
           <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
             Explore Odisha
           </h1>
           <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
             Discover the rich cultural heritage and majestic temples of Odisha. Use our interactive map to plan your visit.
           </p>
           <MonumentSearch onSelect={handleMonumentSelect} />
        </div>
        
        <PreferencesSection />
        <RouteSection onRouteSelected={handleRouteSelected} />
        <MonumentsMap routeData={routeData} selectedMonumentId={selectedMonumentId} />
      </div>
    </div>
  );
};

export default Explore;
