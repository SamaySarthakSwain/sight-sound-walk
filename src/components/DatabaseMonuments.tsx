import { useState } from "react";
import { useMonuments } from "@/hooks/useMonuments";
import { useCity } from "@/contexts/CityContext";
import { Loader2, Landmark, Volume2 } from "lucide-react";
import AnimatedMonumentCard from "@/components/AnimatedMonumentCard";

// Import fallback images
import templeGeneric from "@/assets/temple-generic.jpg";
import beachGeneric from "@/assets/beach-generic.jpg";
import fortGeneric from "@/assets/fort-generic.jpg";
import lakeGeneric from "@/assets/lake-generic.jpg";
import hillsGeneric from "@/assets/hills-generic.jpg";
import stupaGeneric from "@/assets/stupa-generic.jpg";
import springsGeneric from "@/assets/springs-generic.jpg";
import caveGeneric from "@/assets/cave-generic.jpg";

const getFallbackImage = (monument: { title: string; category: string }) => {
  const title = monument.title.toLowerCase();
  const category = monument.category.toLowerCase();
  if (title.includes("beach") || title.includes("sea")) return beachGeneric;
  if (title.includes("fort") || title.includes("palace")) return fortGeneric;
  if (title.includes("lake") || title.includes("chilika")) return lakeGeneric;
  if (title.includes("hill") || title.includes("mountain") || title.includes("giri")) return hillsGeneric;
  if (title.includes("stupa") || title.includes("buddhist")) return stupaGeneric;
  if (title.includes("spring") || title.includes("taptapani")) return springsGeneric;
  if (title.includes("cave") || title.includes("udayagiri") || title.includes("khandagiri")) return caveGeneric;
  if (category === "beach") return beachGeneric;
  if (category === "fort" || category === "historical") return fortGeneric;
  if (category === "lake" || category === "nature") return lakeGeneric;
  if (category === "hill" || category === "hills") return hillsGeneric;
  return templeGeneric;
};

interface MonumentCardState {
  isReading: boolean;
  showSummary: boolean;
}

const DatabaseMonuments = () => {
  const { monuments, loading, error } = useMonuments();
  const { selectedCity } = useCity();
  const [cardStates, setCardStates] = useState<Record<string, MonumentCardState>>({});

  const cityDisplayName = selectedCity.split(",")[0] || "Odisha";

  const groupedMonuments = monuments.reduce((acc, monument) => {
    const category = monument.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(monument);
    return acc;
  }, {} as Record<string, typeof monuments>);

  const handleSpeak = (monumentId: string, description: string, title: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`${title}. ${description}`);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.onstart = () => setCardStates(prev => ({ ...prev, [monumentId]: { ...prev[monumentId], isReading: true } }));
      utterance.onend = () => setCardStates(prev => ({ ...prev, [monumentId]: { ...prev[monumentId], isReading: false } }));
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStopSpeaking = (monumentId: string) => {
    window.speechSynthesis.cancel();
    setCardStates(prev => ({ ...prev, [monumentId]: { ...prev[monumentId], isReading: false } }));
  };

  const toggleSummary = (monumentId: string) => {
    setCardStates(prev => ({
      ...prev,
      [monumentId]: { ...prev[monumentId], showSummary: !prev[monumentId]?.showSummary },
    }));
  };

  const getState = (id: string): MonumentCardState => cardStates[id] || { isReading: false, showSummary: false };

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading monuments...</span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center py-12">
          <p className="text-destructive">{error}</p>
        </div>
      </section>
    );
  }

  if (monuments.length === 0) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center py-12">
          <Landmark className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No monuments found</h3>
          <p className="text-muted-foreground">No monuments available for {cityDisplayName} yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
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
        </div>

        {Object.entries(groupedMonuments).map(([category, categoryMonuments], catIndex) => {
          // Duplicate cards for infinite scroll effect
          const duplicated = [...categoryMonuments, ...categoryMonuments];
          const direction = catIndex % 2 === 0 ? "scroll-left" : "scroll-right";

          return (
            <div key={category} className="mb-10 md:mb-16">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8 text-center">
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  {category}s ({categoryMonuments.length})
                </span>
              </h2>
              <div className="overflow-hidden py-4">
                <div className={`monument-carousel-track ${direction}`}>
                  {duplicated.map((monument, idx) => {
                    const state = getState(monument.id);
                    return (
                      <AnimatedMonumentCard
                        key={`${monument.id}-${idx}`}
                        monument={monument}
                        fallbackImage={getFallbackImage(monument)}
                        isReading={state.isReading}
                        showSummary={state.showSummary}
                        onSpeak={handleSpeak}
                        onStopSpeaking={handleStopSpeaking}
                        onToggleSummary={toggleSummary}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default DatabaseMonuments;
