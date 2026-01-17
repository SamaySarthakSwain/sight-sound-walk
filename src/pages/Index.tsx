import Hero from "@/components/Hero";
import DatabaseMonuments from "@/components/DatabaseMonuments";
import Navigation from "@/components/Navigation";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-16">
        <Hero />
        <DatabaseMonuments />
      </div>
    </div>
  );
};

export default Index;
