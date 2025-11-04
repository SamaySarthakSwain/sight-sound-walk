import Hero from "@/components/Hero";
import FeaturedMonuments from "@/components/FeaturedMonuments";
import PreferencesSection from "@/components/PreferencesSection";
import RouteSection from "@/components/RouteSection";
import MonumentsMap from "@/components/MonumentsMap";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedMonuments />
      <PreferencesSection />
      <RouteSection />
      <MonumentsMap />
    </div>
  );
};

export default Index;
