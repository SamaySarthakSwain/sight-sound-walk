import Hero from "@/components/Hero";
import FeaturedMonuments from "@/components/FeaturedMonuments";
import Navigation from "@/components/Navigation";
import { CityProvider } from "@/contexts/CityContext";

const Index = () => {
  return (
    <CityProvider>
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-16">
          <Hero />
          <FeaturedMonuments />
        </div>
      </div>
    </CityProvider>
  );
};

export default Index;
