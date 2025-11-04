import PreferencesSection from "@/components/PreferencesSection";
import RouteSection from "@/components/RouteSection";
import MonumentsMap from "@/components/MonumentsMap";
import Navigation from "@/components/Navigation";

const Explore = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-16">
        <PreferencesSection />
        <RouteSection />
        <MonumentsMap />
      </div>
    </div>
  );
};

export default Explore;
