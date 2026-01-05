import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import FoodPlaceCard from "@/components/FoodPlaceCard";
import { useFoodPlaces } from "@/hooks/useFoodPlaces";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, UtensilsCrossed } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Food = () => {
  const { foodPlaces, loading, submitRating, refetch } = useFoodPlaces();
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState("all");

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
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <UtensilsCrossed className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">
                Food Near You
              </h1>
            </div>
            <p className="text-muted-foreground">
              Discover local flavors and authentic Odia cuisine in Bhubaneswar
            </p>
          </div>

          {/* Food Streets Section */}
          {foodStreets.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-semibold mb-4">
                Famous Food Streets & Hubs
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            className="mb-6"
          >
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="restaurant">Restaurants</TabsTrigger>
              <TabsTrigger value="street_food">Street Food</TabsTrigger>
              <TabsTrigger value="food_street">Food Hubs</TabsTrigger>
            </TabsList>
          </Tabs>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredPlaces.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No food places found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
