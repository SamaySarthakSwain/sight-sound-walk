import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useCity } from "@/contexts/CityContext";
import { toast } from "sonner";
import { berhampur_restaurants } from "@/data/berhampur_restaurants";
import { fallbackFoodPlaces } from "@/data/fallbackFoodPlaces";

export interface FoodPlace {
  id: string;
  name: string;
  description: string | null;
  location: string;
  latitude: number | null;
  longitude: number | null;
  category: string;
  famous_dishes: string[];
  avg_price_min: number | null;
  avg_price_max: number | null;
  image_url: string | null;
  is_food_street: boolean;
  avg_overall: number;
  avg_taste: number;
  avg_hygiene: number;
  avg_value: number;
  total_ratings: number;
  user_rating: FoodRating | null;
  google_rating: number | null;
  google_total_ratings: number | null;
}

export interface FoodRating {
  id: string;
  overall_rating: number;
  taste_rating: number;
  hygiene_rating: number;
  value_rating: number;
  comment: string | null;
}

export const useFoodPlaces = () => {
  const [foodPlaces, setFoodPlaces] = useState<FoodPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { selectedCity } = useCity();

  const fetchFoodPlaces = async () => {
    try {
      setLoading(true);
      
      const cityName = (selectedCity || "").split(",")[0].toLowerCase().trim();
      
      // Special logic for Berhampur using local data
      if (cityName === "berhampur" || cityName === "brahmapur") {
        const enrichedPlaces: FoodPlace[] = berhampur_restaurants.map((place) => ({
          id: place.id,
          name: place.name,
          description: place.description,
          location: place.location,
          latitude: place.latitude,
          longitude: place.longitude,
          category: place.category,
          famous_dishes: place.famous_dishes || [],
          avg_price_min: place.avg_price_min,
          avg_price_max: place.avg_price_max,
          image_url: place.image_url,
          is_food_street: place.is_food_street || false,
          avg_overall: place.google_rating || place.avg_overall || 0,
          avg_taste: place.avg_taste || 0,
          avg_hygiene: place.avg_hygiene || 0,
          avg_value: place.avg_value || 0,
          total_ratings: place.total_ratings || 0,
          google_rating: place.google_rating,
          google_total_ratings: place.google_total_ratings,
          user_rating: null,
        }));
        
        setFoodPlaces(enrichedPlaces.sort((a, b) => a.name.localeCompare(b.name)));
        return;
      }

      // Fetch from Supabase for other cities
      let { data: places, error: placesError } = await supabase
        .from("food_places")
        .select("*")
        .order("name");

      if (placesError || !places || places.length === 0) {
        console.log('Using fallback food places data for Supabase failure...');
        places = fallbackFoodPlaces as any;
      }

      const { data: ratingsData } = await supabase
        .from("food_ratings_public" as any)
        .select("*");
      const ratings = (ratingsData as any[]) || [];



      // Filter based on city
      let filteredPlaces = places || [];
      if (cityName === "bhubaneswar" || cityName === "bbsr") {
        filteredPlaces = filteredPlaces.filter((p) => {
          const loc = (p.location || "").toLowerCase();
          return loc.includes("bhubaneswar") || loc.includes("bbsr");
        });
      } else if (cityName === "puri") {
        filteredPlaces = filteredPlaces.filter((p) => (p.location || "").toLowerCase().includes("puri"));
      } else if (cityName === "cuttack") {
        filteredPlaces = filteredPlaces.filter((p) => (p.location || "").toLowerCase().includes("cuttack"));
      }

      const enrichedPlaces: FoodPlace[] = filteredPlaces.map((place: any) => {
        const placeRatings = (ratings || []).filter((r) => r.food_place_id === place.id);
        const count = placeRatings.length;

        const avgOverall = count 
          ? placeRatings.reduce((s, r) => s + (r.overall_rating || 0), 0) / count 
          : (place.avg_overall || 0);
        const avgTaste = count 
          ? placeRatings.reduce((s, r) => s + (r.taste_rating || 0), 0) / count 
          : (place.avg_taste || 0);
        const avgHygiene = count 
          ? placeRatings.reduce((s, r) => s + (r.hygiene_rating || 0), 0) / count 
          : (place.avg_hygiene || 0);
        const avgValue = count 
          ? placeRatings.reduce((s, r) => s + (r.value_rating || 0), 0) / count 
          : (place.avg_value || 0);

        const userRatingMatch = user ? placeRatings.find((r) => r.user_id === user.id) : null;

        return {
          id: place.id,
          name: place.name,
          description: place.description,
          location: place.location,
          latitude: place.latitude ? Number(place.latitude) : null,
          longitude: place.longitude ? Number(place.longitude) : null,
          category: place.category,
          famous_dishes: place.famous_dishes || [],
          avg_price_min: place.avg_price_min,
          avg_price_max: place.avg_price_max,
          image_url: place.image_url,
          is_food_street: place.is_food_street || false,
          avg_overall: avgOverall,
          avg_taste: avgTaste,
          avg_hygiene: avgHygiene,
          avg_value: avgValue,
          total_ratings: count || place.total_ratings || 0,
          google_rating: place.google_rating ? Number(place.google_rating) : null,
          google_total_ratings: place.google_total_ratings,
          user_rating: userRatingMatch ? {
            id: userRatingMatch.id,
            overall_rating: userRatingMatch.overall_rating,
            taste_rating: userRatingMatch.taste_rating,
            hygiene_rating: userRatingMatch.hygiene_rating,
            value_rating: userRatingMatch.value_rating,
            comment: userRatingMatch.comment,
          } : null,
        };
      });

      setFoodPlaces(enrichedPlaces);
    } catch (err) {
      console.error("Critical error in fetchFoodPlaces:", err);
      // Fallback robustly
      const enrichedFallback: FoodPlace[] = fallbackFoodPlaces.map(place => ({
        ...place,
        user_rating: null,
        avg_taste: 0,
        avg_hygiene: 0,
        avg_value: 0
      } as any));
      setFoodPlaces(enrichedFallback);
    } finally {
      setLoading(false);
    }
  };

  const submitRating = async (
    foodPlaceId: string,
    rating: {
      overall_rating: number;
      taste_rating: number;
      hygiene_rating: number;
      value_rating: number;
      comment?: string;
    }
  ) => {
    if (!user) {
      toast.error("Please login to rate");
      return false;
    }

    const existingPlace = foodPlaces.find((p) => p.id === foodPlaceId);
    if (existingPlace?.user_rating) {
      const { error } = await supabase
        .from("food_ratings")
        .update({
          overall_rating: rating.overall_rating,
          taste_rating: rating.taste_rating,
          hygiene_rating: rating.hygiene_rating,
          value_rating: rating.value_rating,
          comment: rating.comment || null,
        })
        .eq("id", existingPlace.user_rating.id);

      if (error) {
        toast.error("Failed to update rating");
        return false;
      }
      toast.success("Rating updated!");
    } else {
      const { error } = await supabase.from("food_ratings").insert({
        user_id: user.id,
        food_place_id: foodPlaceId,
        overall_rating: rating.overall_rating,
        taste_rating: rating.taste_rating,
        hygiene_rating: rating.hygiene_rating,
        value_rating: rating.value_rating,
        comment: rating.comment || null,
      });

      if (error) {
        if (error.code === "23505") {
          toast.error("You have already rated this place");
        } else {
          toast.error("Failed to submit rating");
        }
        return false;
      }
      toast.success("Rating submitted!");
    }

    fetchFoodPlaces();
    return true;
  };

  useEffect(() => {
    fetchFoodPlaces();

    const channel = supabase
      .channel("food-ratings-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "food_ratings",
        },
        () => {
          fetchFoodPlaces();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, selectedCity]);

  return { foodPlaces, loading, submitRating, refetch: fetchFoodPlaces };
};
