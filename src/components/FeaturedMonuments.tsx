import MonumentCard from "./MonumentCard";
import { useCity } from "@/contexts/CityContext";
import { getCityData, Monument } from "@/data/cityMonuments";

const FeaturedMonuments = () => {
  const { selectedCity } = useCity();
  const cityData = getCityData(selectedCity);

  const renderSection = (title: string, monuments: Monument[]) => (
    <div className="mb-20">
      <h2 className="text-3xl font-bold mb-8 text-center">
        <span className="bg-gradient-hero bg-clip-text text-transparent">
          {title}
        </span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {monuments.map((monument, index) => (
          <MonumentCard key={index} {...monument} />
        ))}
      </div>
    </div>
  );

  const cityDisplayName = selectedCity.split(",")[0] || "Odisha";

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            Discover <span className="bg-gradient-hero bg-clip-text text-transparent">{cityDisplayName}'s Heritage</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore the rich cultural tapestry through these magnificent historical sites and natural wonders
          </p>
        </div>
        
        {cityData.sections.map((section, index) => (
          renderSection(section.title, section.monuments)
        ))}
      </div>
    </section>
  );
};

export default FeaturedMonuments;
