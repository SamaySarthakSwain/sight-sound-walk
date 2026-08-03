import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Utensils, Sparkles, Shield, Heart, ExternalLink } from "lucide-react";
import { FoodPlace } from "@/hooks/useFoodPlaces";
import FoodRatingForm from "./FoodRatingForm";

// Rich, diverse fallback image pools — every image is unique and beautiful
const streetFoodImages = [
  "https://images.unsplash.com/photo-1601050690597-df056fb1ce24?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1625398407796-82650a8c135f?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1558326567-98ae2405596b?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1605333396915-47ed6b68a00e?auto=format&fit=crop&q=80&w=800",
];

const restaurantImages = [
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1550966842-28c464efd60c?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=800",
];

const cafeImages = [
  "https://images.unsplash.com/photo-1559305616-3f99cd43e353?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1554118811-1e2d86a3d6a9?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1521017432531-fbd92d744264?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&q=80&w=800",
];

const foodHubImages = [
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800",
];

// Deterministic hash from place name so each place always gets the same unique image
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
};

// Get a unique fallback image based on category + place name
const getFoodFallbackImage = (place: FoodPlace) => {
  const cat = (place.category || "").toLowerCase();
  const hash = hashString(place.name + place.id);

  if (place.is_food_street || cat.includes("street")) {
    return streetFoodImages[hash % streetFoodImages.length];
  }
  if (cat.includes("cafe")) {
    return cafeImages[hash % cafeImages.length];
  }
  if (cat.includes("food_hub") || cat.includes("hub")) {
    return foodHubImages[hash % foodHubImages.length];
  }
  return restaurantImages[hash % restaurantImages.length];
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
