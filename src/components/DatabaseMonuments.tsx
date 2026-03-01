import { useEffect, useState, useMemo } from "react";
import { useMonuments } from "@/hooks/useMonuments";
import { useCity } from "@/contexts/CityContext";
import { Loader2, Landmark, Volume2, Search, X } from "lucide-react";
import MonumentFlashCard from "@/components/MonumentFlashCard";
import { getMonumentImage, resetImageCounters } from "@/data/monumentImages";
import { Input } from "@/components/ui/input";
import ScrollReveal from "@/components/ScrollReveal";

const DatabaseMonuments = () => {
  const { monuments, loading, error } = useMonuments();
  const { selectedCity } = useCity();
  const [searchQuery, setSearchQuery] = useState("");

  const cityDisplayName = selectedCity.split(",")[0] || "Odisha";

  useEffect(() => {
    resetImageCounters();
  }, [monuments]);

  const filteredMonuments = useMemo(() => {
    if (!searchQuery.trim()) return monuments;
    const q = searchQuery.toLowerCase();
    return monuments.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.location.toLowerCase().includes(q)
    );
  }, [monuments, searchQuery]);

  const groupedMonuments = filteredMonuments.reduce((acc, monument) => {
    const category = monument.category || "Other";
    if (!acc[category]) acc[category] = [];
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
    <section className="py-12 md:py-20 bg-background relative">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-8 md:mb-16 space-y-3 md:space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              Discover{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                {cityDisplayName}'s Heritage
              </span>
            </h1>
            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
              Explore {monuments.length} magnificent historical sites and natural wonders
            </p>
            <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-muted-foreground">
              <Volume2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
              <span>Listen to audio narrations for each monument</span>
            </div>
            <div className="relative max-w-md mx-auto mt-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search monuments, temples, beaches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 rounded-full border-border/60 bg-card/80 backdrop-blur-sm focus:border-primary/50 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </ScrollReveal>

        {filteredMonuments.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <Search className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No monuments found for "{searchQuery}"</p>
          </div>
        )}
        {Object.entries(groupedMonuments).map(([category, categoryMonuments]) => (
          <div key={category} className="mb-10 md:mb-16">
            <ScrollReveal>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8 text-center">
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  {category}s ({categoryMonuments.length})
                </span>
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
              {categoryMonuments.map((monument, i) => (
                <ScrollReveal key={monument.id} delay={Math.min(i * 100, 300)}>
                  <MonumentFlashCard
                    monument={monument}
                    imageUrl={getMonumentImage(monument)}
                  />
                </ScrollReveal>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DatabaseMonuments;
