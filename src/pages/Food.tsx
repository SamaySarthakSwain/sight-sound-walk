import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import FoodPlaceCard from "@/components/FoodPlaceCard";
import { useFoodPlaces } from "@/hooks/useFoodPlaces";
import { useAuth } from "@/hooks/useAuth";
import { useCity } from "@/contexts/CityContext";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, UtensilsCrossed } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const Food = () => {
  const { foodPlaces, loading, submitRating, refetch } = useFoodPlaces();
  const { user } = useAuth();
  const { selectedCity } = useCity();
  const [activeCategory, setActiveCategory] = useState("all");

  const cityDisplayName = selectedCity.split(",")[0] || "Odisha";

  // Fetch Google ratings on mount (runs once in background)
  useEffect(() => {
    const fetchGoogleRatings = async () => {
      try {
        await supabase.functions.invoke("fetch-google-ratings");
        // Refetch to get updated Google ratings
        setTimeout(() => refetch(), 2000);
      } catch (error) {
        console.error("Failed to fetch Google ratings:", error);
      }
    };
    fetchGoogleRatings();
  }, []);

  const filteredPlaces =
    activeCategory === "all"
      ? foodPlaces
      : activeCategory === "food_street"
      ? foodPlaces.filter((p) => p.is_food_street)
      : foodPlaces.filter(
          (p) => p.category === activeCategory && !p.is_food_street
        );

  const foodStreets = foodPlaces.filter((p) => p.is_food_street);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16 md:pt-20 pb-8 md:pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6 md:mb-8 pt-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <UtensilsCrossed className="w-6 h-6 md:w-8 md:h-8 text-primary" />
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Food in {cityDisplayName}
              </h1>
            </div>
            <p className="text-sm md:text-base text-muted-foreground">
              Discover local flavors and authentic cuisine in {cityDisplayName}
            </p>
          </div>

          {/* Food Streets Section */}
          {foodStreets.length > 0 && (
            <section className="mb-8 md:mb-10">
              <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
                Famous Food Streets & Hubs
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {foodStreets.map((place) => (
                  <FoodPlaceCard
                    key={place.id}
                    place={place}
                    onRate={submitRating}
                    isLoggedIn={!!user}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Category Tabs */}
          <Tabs
            value={activeCategory}
            onValueChange={setActiveCategory}
            className="mb-4 md:mb-6"
          >
            <TabsList className="w-full justify-start overflow-x-auto flex-nowrap">
              <TabsTrigger value="all" className="text-xs md:text-sm">All</TabsTrigger>
              <TabsTrigger value="restaurant" className="text-xs md:text-sm">Restaurants</TabsTrigger>
              <TabsTrigger value="street_food" className="text-xs md:text-sm">Street Food</TabsTrigger>
              <TabsTrigger value="food_street" className="text-xs md:text-sm">Food Hubs</TabsTrigger>
            </TabsList>
          </Tabs>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 py-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col space-y-3 p-4 border rounded-xl bg-card">
                  <Skeleton className="h-40 w-full rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPlaces.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No food places found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {filteredPlaces.map((place) => (
                <FoodPlaceCard
                  key={place.id}
                  place={place}
                  onRate={submitRating}
                  isLoggedIn={!!user}
                />
              ))}
            </div>
          )}

          {!user && (
            <p className="text-center text-sm text-muted-foreground mt-8">
              Login to rate food places after you visit them
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Food;
