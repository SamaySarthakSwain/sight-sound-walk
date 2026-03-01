import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Utensils, Sparkles, Shield, Heart, ExternalLink } from "lucide-react";
import { FoodPlace } from "@/hooks/useFoodPlaces";
import FoodRatingForm from "./FoodRatingForm";

// Import fallback images
import restaurantGeneric from "@/assets/restaurant-generic.jpg";
import streetFoodGeneric from "@/assets/street-food-generic.jpg";

// Get fallback image based on category
const getFoodFallbackImage = (place: FoodPlace) => {
  if (place.is_food_street || place.category?.toLowerCase().includes("street")) {
    return streetFoodGeneric;
  }
  return restaurantGeneric;
};

interface FoodPlaceCardProps {
  place: FoodPlace;
  onRate: (
    foodPlaceId: string,
    rating: {
      overall_rating: number;
      taste_rating: number;
      hygiene_rating: number;
      value_rating: number;
      comment?: string;
    }
  ) => Promise<boolean>;
  isLoggedIn: boolean;
}

const FoodPlaceCard = ({ place, onRate, isLoggedIn }: FoodPlaceCardProps) => {
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [ateHere, setAteHere] = useState(!!place.user_rating);

  const getBadges = () => {
    const badges = [];
    if (place.avg_overall >= 4 && place.total_ratings >= 3) {
      badges.push({ label: "Top Rated", icon: Sparkles, color: "bg-amber-500" });
    }
    if (place.avg_hygiene >= 4 && place.total_ratings >= 2) {
      badges.push({ label: "Clean & Safe", icon: Shield, color: "bg-emerald-500" });
    }
    if (place.total_ratings >= 5) {
      badges.push({ label: "Local Favorite", icon: Heart, color: "bg-rose-500" });
    }
    return badges;
  };

  const badges = getBadges();

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${star <= Math.round(rating)
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground"
              }`}
          />
        ))}
        <span className="ml-1 text-sm font-medium">
          {rating > 0 ? rating.toFixed(1) : "N/A"}
        </span>
      </div>
    );
  };

  const handleAteHere = () => {
    setAteHere(true);
    setShowRatingForm(true);
  };

  const handleSubmitRating = async (rating: {
    overall_rating: number;
    taste_rating: number;
    hygiene_rating: number;
    value_rating: number;
    comment?: string;
  }) => {
    const success = await onRate(place.id, rating);
    if (success) {
      setShowRatingForm(false);
    }
  };

  const imageUrl = place.image_url || getFoodFallbackImage(place);

  return (
    <Card className="overflow-hidden glass-card glass-card-hover">
      {/* Food Place Image */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={imageUrl}
          alt={place.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
        <Badge className="absolute top-3 right-3 bg-primary/90 text-primary-foreground text-xs">
          {place.is_food_street ? "Food Street" : place.category}
        </Badge>
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-lg">{place.name}</CardTitle>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <MapPin className="w-3.5 h-3.5" />
              {place.location}
            </div>
          </div>
        </div>
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {badges.map((badge) => (
              <Badge
                key={badge.label}
                className={`${badge.color} text-white text-xs gap-1`}
              >
                <badge.icon className="w-3 h-3" />
                {badge.label}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {place.description && (
          <p className="text-sm text-muted-foreground">{place.description}</p>
        )}

        {place.famous_dishes.length > 0 && (
          <div className="flex items-start gap-2">
            <Utensils className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <p className="text-sm">{place.famous_dishes.join(", ")}</p>
          </div>
        )}

        {(place.avg_price_min || place.avg_price_max) && (
          <p className="text-sm font-medium text-primary">
            ₹{place.avg_price_min || 0} - ₹{place.avg_price_max || 0}
          </p>
        )}

        {/* Google Rating */}
        {place.google_rating && (
          <div className="flex items-center gap-2 p-2 rounded-md glass-panel">
            <div className="flex items-center gap-1">
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
              <span className="text-xs font-medium">Google</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-sm font-semibold">{place.google_rating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">
                ({place.google_total_ratings} reviews)
              </span>
            </div>
          </div>
        )}

        {/* User Ratings */}
        <div className="pt-2 border-t">
          <p className="text-xs font-medium mb-2 text-muted-foreground">Community Ratings</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-xs text-muted-foreground">Overall</span>
              {renderStars(place.avg_overall)}
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Taste</span>
              {renderStars(place.avg_taste)}
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Hygiene</span>
              {renderStars(place.avg_hygiene)}
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Value</span>
              {renderStars(place.avg_value)}
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          {place.total_ratings} {place.total_ratings === 1 ? "rating" : "ratings"}
        </p>

        {isLoggedIn && (
          <div className="pt-2 border-t">
            {!ateHere && !place.user_rating ? (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={handleAteHere}
              >
                I ate here
              </Button>
            ) : showRatingForm ? (
              <FoodRatingForm
                existingRating={place.user_rating}
                onSubmit={handleSubmitRating}
                onCancel={() => setShowRatingForm(false)}
              />
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground text-center">
                  {place.user_rating ? "You rated this place" : "Ready to rate"}
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  onClick={() => setShowRatingForm(true)}
                >
                  {place.user_rating ? "Update Rating" : "Rate Now"}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FoodPlaceCard;
