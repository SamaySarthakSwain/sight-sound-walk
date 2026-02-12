import { useState } from "react";
import { useMonuments } from "@/hooks/useMonuments";
import { useCity } from "@/contexts/CityContext";
import { Loader2, MapPin, Landmark, Volume2, FileText, VolumeX, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Import fallback images
import templeGeneric from "@/assets/temple-generic.jpg";
import beachGeneric from "@/assets/beach-generic.jpg";
import fortGeneric from "@/assets/fort-generic.jpg";
import lakeGeneric from "@/assets/lake-generic.jpg";
import hillsGeneric from "@/assets/hills-generic.jpg";
import stupaGeneric from "@/assets/stupa-generic.jpg";
import springsGeneric from "@/assets/springs-generic.jpg";
import caveGeneric from "@/assets/cave-generic.jpg";

// Function to get appropriate fallback image based on category/title
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

  // Group monuments by category
  const groupedMonuments = monuments.reduce((acc, monument) => {
    const category = monument.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(monument);
    return acc;
  }, {} as Record<string, typeof monuments>);

  const handleSpeak = (monumentId: string, description: string, title: string) => {
    if ('speechSynthesis' in window) {
      // Stop any current speech
      window.speechSynthesis.cancel();
      
      const text = `${title}. ${description}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onstart = () => {
        setCardStates(prev => ({
          ...prev,
          [monumentId]: { ...prev[monumentId], isReading: true }
        }));
      };
      
      utterance.onend = () => {
        setCardStates(prev => ({
          ...prev,
          [monumentId]: { ...prev[monumentId], isReading: false }
        }));
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStopSpeaking = (monumentId: string) => {
    window.speechSynthesis.cancel();
    setCardStates(prev => ({
      ...prev,
      [monumentId]: { ...prev[monumentId], isReading: false }
    }));
  };

  const toggleSummary = (monumentId: string) => {
    setCardStates(prev => ({
      ...prev,
      [monumentId]: {
        ...prev[monumentId],
        showSummary: !prev[monumentId]?.showSummary
      }
    }));
  };

  const getCardState = (monumentId: string): MonumentCardState => {
    return cardStates[monumentId] || { isReading: false, showSummary: false };
  };

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
    <section className="py-12 md:py-20 bg-background">
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

        {Object.entries(groupedMonuments).map(([category, categoryMonuments]) => (
          <div key={category} className="mb-10 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8 text-center">
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                {category}s ({categoryMonuments.length})
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {categoryMonuments.map((monument) => {
                const state = getCardState(monument.id);
                const imageUrl = monument.image_url || getFallbackImage(monument);
                
                return (
                  <Card
                    key={monument.id}
                    className="group overflow-hidden border-0 shadow-soft hover:shadow-medium transition-all duration-300 bg-card"
                  >
                    <div className="relative h-40 sm:h-48 overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={monument.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                      <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                        <Badge className="bg-primary/90 text-primary-foreground text-xs">
                          {monument.category}
                        </Badge>
                      </div>
                      {monument.is_featured && (
                        <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                          <Badge variant="secondary" className="bg-secondary/90 text-xs">
                            Featured
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4 sm:p-5 space-y-2 sm:space-y-3">
                      <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {monument.title}
                      </h3>
                      <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                        <span className="line-clamp-1">{monument.location}</span>
                      </div>
                      <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2 sm:line-clamp-3">
                        {monument.description}
                      </p>
                      
                      {/* Audio and Summary Controls */}
                      <div className="flex gap-2 pt-1 sm:pt-2">
                        <Button
                          variant={state.isReading ? "destructive" : "secondary"}
                          size="sm"
                          className="flex-1 h-8 sm:h-9 text-xs sm:text-sm"
                          onClick={() => 
                            state.isReading 
                              ? handleStopSpeaking(monument.id)
                              : handleSpeak(monument.id, monument.description, monument.title)
                          }
                        >
                          {state.isReading ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                              Stop
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                              Listen
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 h-8 sm:h-9 text-xs sm:text-sm"
                          onClick={() => toggleSummary(monument.id)}
                        >
                          <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                          {state.showSummary ? "Hide" : "Facts"}
                          {state.showSummary ? (
                            <ChevronUp className="w-3 h-3 ml-0.5 sm:ml-1" />
                          ) : (
                            <ChevronDown className="w-3 h-3 ml-0.5 sm:ml-1" />
                          )}
                        </Button>
                      </div>

                      {/* Summary/Facts Section */}
                      {state.showSummary && monument.facts && monument.facts.length > 0 && (
                        <div className="p-3 rounded-lg bg-muted/50 space-y-2 animate-in fade-in slide-in-from-top-2">
                          <h4 className="font-semibold text-sm flex items-center gap-1">
                            <FileText className="w-4 h-4 text-primary" />
                            Historical Facts
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
                            {monument.facts.map((fact, index) => (
                              <li key={index}>{fact}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {state.showSummary && (!monument.facts || monument.facts.length === 0) && (
                        <div className="p-3 rounded-lg bg-muted/50 animate-in fade-in slide-in-from-top-2">
                          <p className="text-xs text-muted-foreground italic">
                            No additional facts available for this monument yet.
                          </p>
                        </div>
                      )}

                      {monument.distance_from_berhampur && (
                        <p className="text-xs text-primary font-medium pt-1">
                          📍 {monument.distance_from_berhampur}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DatabaseMonuments;
