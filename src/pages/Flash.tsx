import Navigation from "@/components/Navigation";
import DatabaseMonuments from "@/components/DatabaseMonuments";
import { AuroraBackground } from "@/components/ui/aurora-background";

const Flash = () => {
  return (
    <div className="min-h-screen relative bg-background/50">
      <AuroraBackground />
      <Navigation />
      <div className="pt-24 pb-12">
        <DatabaseMonuments />
      </div>
    </div>
  );
};

export default Flash;
