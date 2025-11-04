import Hero from "@/components/Hero";
import FeaturedMonuments from "@/components/FeaturedMonuments";
import Navigation from "@/components/Navigation";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-16">
        <Hero />
        <FeaturedMonuments />
      </div>
    </div>
  );
};

export default Index;
