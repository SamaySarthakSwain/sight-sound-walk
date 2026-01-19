import Hero from "@/components/Hero";
import DatabaseMonuments from "@/components/DatabaseMonuments";
import Navigation from "@/components/Navigation";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <DatabaseMonuments />
    </div>
  );
};

export default Index;
