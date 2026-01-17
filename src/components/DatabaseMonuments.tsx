import { useMonuments } from "@/hooks/useMonuments";
import { useCity } from "@/contexts/CityContext";
import { Loader2, MapPin, Landmark } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const DatabaseMonuments = () => {
  const { monuments, loading, error } = useMonuments();
  const { selectedCity } = useCity();

  const cityDisplayName = selectedCity.split(",")[0] || "Odisha";

  // Group monuments by category
  const groupedMonuments = monuments.reduce((acc, monument) => {
    const category = monument.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(monument);
    return acc;
  }, {} as Record<string, typeof monuments>);

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading monuments...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-destructive">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (monuments.length === 0) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <Landmark className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No monuments found</h3>
            <p className="text-muted-foreground">
              No monuments available for {cityDisplayName} yet.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            Discover{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              {cityDisplayName}'s Heritage
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore {monuments.length} magnificent historical sites and natural wonders
          </p>
        </div>

        {Object.entries(groupedMonuments).map(([category, categoryMonuments]) => (
          <div key={category} className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                {category}s ({categoryMonuments.length})
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categoryMonuments.map((monument) => (
                <Card
                  key={monument.id}
                  className="group overflow-hidden border-0 shadow-soft hover:shadow-medium transition-all duration-300 bg-card"
                >
                  <div className="relative h-48 overflow-hidden">
                    {monument.image_url ? (
                      <img
                        src={monument.image_url}
                        alt={monument.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <Landmark className="w-16 h-16 text-primary/50" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-primary/90 text-primary-foreground">
                        {monument.category}
                      </Badge>
                    </div>
                    {monument.is_featured && (
                      <div className="absolute top-3 right-3">
                        <Badge variant="secondary" className="bg-secondary/90">
                          Featured
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-5 space-y-3">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {monument.title}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{monument.location}</span>
                    </div>
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {monument.description}
                    </p>
                    {monument.facts && monument.facts.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-2">
                        {monument.facts.slice(0, 3).map((fact, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs bg-background"
                          >
                            {fact.length > 30 ? fact.substring(0, 30) + "..." : fact}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {monument.distance_from_berhampur && (
                      <p className="text-xs text-primary font-medium pt-1">
                        📍 {monument.distance_from_berhampur}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DatabaseMonuments;
