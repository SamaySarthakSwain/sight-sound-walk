import Hero from "@/components/Hero";
import FeaturedMonuments from "@/components/FeaturedMonuments";
import PreferencesSection from "@/components/PreferencesSection";
import RouteSection from "@/components/RouteSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedMonuments />
      <PreferencesSection />
      <RouteSection />
    </div>
  );
};

export default Index;
