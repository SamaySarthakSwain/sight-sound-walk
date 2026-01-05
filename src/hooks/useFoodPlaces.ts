import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

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

  const fetchFoodPlaces = async () => {
    setLoading(true);
    
    // Fetch food places
    const { data: places, error: placesError } = await supabase
      .from("food_places")
      .select("*")
      .order("name");

    if (placesError) {
      toast.error("Failed to load food places");
      setLoading(false);
      return;
    }

    // Fetch all ratings
    const { data: ratings, error: ratingsError } = await supabase
      .from("food_ratings")
      .select("*");

    if (ratingsError) {
      toast.error("Failed to load ratings");
      setLoading(false);
      return;
    }

    // Calculate averages and map user ratings
    const enrichedPlaces: FoodPlace[] = (places || []).map((place) => {
      const placeRatings = (ratings || []).filter(
        (r) => r.food_place_id === place.id
      );
      const totalRatings = placeRatings.length;

      const avgOverall = totalRatings
        ? placeRatings.reduce((sum, r) => sum + r.overall_rating, 0) / totalRatings
        : 0;
      const avgTaste = totalRatings
        ? placeRatings.reduce((sum, r) => sum + r.taste_rating, 0) / totalRatings
        : 0;
      const avgHygiene = totalRatings
        ? placeRatings.reduce((sum, r) => sum + r.hygiene_rating, 0) / totalRatings
        : 0;
      const avgValue = totalRatings
        ? placeRatings.reduce((sum, r) => sum + r.value_rating, 0) / totalRatings
        : 0;

      const userRating = user
        ? placeRatings.find((r) => r.user_id === user.id)
        : null;

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
        total_ratings: totalRatings,
        google_rating: place.google_rating ? Number(place.google_rating) : null,
        google_total_ratings: place.google_total_ratings,
        user_rating: userRating
          ? {
              id: userRating.id,
              overall_rating: userRating.overall_rating,
              taste_rating: userRating.taste_rating,
              hygiene_rating: userRating.hygiene_rating,
              value_rating: userRating.value_rating,
              comment: userRating.comment,
            }
          : null,
      };
    });

    setFoodPlaces(enrichedPlaces);
    setLoading(false);
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
      // Update existing rating
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
      // Insert new rating
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

    return true;
  };

  // Subscribe to realtime updates
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
  }, [user]);

  return { foodPlaces, loading, submitRating, refetch: fetchFoodPlaces };
};
