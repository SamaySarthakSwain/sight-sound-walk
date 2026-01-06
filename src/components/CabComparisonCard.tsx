import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FareEstimate } from "@/hooks/useCabServices";
import { Car, Bike, Clock, Users, Leaf, Crown, TrendingDown } from "lucide-react";

interface CabComparisonCardProps {
  estimate: FareEstimate;
  isRecommended?: boolean;
  isCheapest?: boolean;
  isEcoChoice?: boolean;
  onSelect?: () => void;
}

const CabComparisonCard = ({
  estimate,
  isRecommended,
  isCheapest,
  isEcoChoice,
  onSelect,
}: CabComparisonCardProps) => {
  const getVehicleIcon = () => {
    switch (estimate.vehicleType.vehicle_type) {
      case "2_wheeler":
        return <Bike className="w-8 h-8" />;
      case "3_wheeler":
        return <Car className="w-8 h-8" />;
      default:
        return <Car className="w-8 h-8" />;
    }
  };

  return (
    <Card
      className={`relative overflow-hidden transition-all hover:shadow-lg ${
        isRecommended ? "ring-2 ring-primary" : ""
      } ${isCheapest ? "bg-accent/10" : ""}`}
    >
      {(isRecommended || isCheapest || isEcoChoice) && (
        <div className="absolute top-0 right-0 flex gap-1 p-2">
          {isRecommended && (
            <Badge className="bg-primary text-primary-foreground flex items-center gap-1">
              <Crown className="w-3 h-3" />
              AI Pick
            </Badge>
          )}
          {isCheapest && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              Cheapest
            </Badge>
          )}
          {isEcoChoice && (
            <Badge className="bg-green-600 text-white flex items-center gap-1">
              <Leaf className="w-3 h-3" />
              Eco
            </Badge>
          )}
        </div>
      )}

      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Service Logo/Icon */}
          <div className="flex-shrink-0">
            {estimate.cabService.logo_url ? (
              <img
                src={estimate.cabService.logo_url}
                alt={estimate.cabService.name}
                className="w-12 h-12 object-contain rounded"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="w-12 h-12 bg-muted rounded flex items-center justify-center text-muted-foreground">
                {getVehicleIcon()}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg truncate">
                {estimate.cabService.name}
              </h3>
              {estimate.cabService.is_local && (
                <Badge variant="outline" className="text-xs">
                  Local
                </Badge>
              )}
            </div>

            <p className="text-sm text-muted-foreground mb-2">
              {estimate.vehicleType.vehicle_name}
            </p>

            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {estimate.vehicleType.capacity} seat{estimate.vehicleType.capacity > 1 ? "s" : ""}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                ~{estimate.waitTime} min wait
              </span>
              {estimate.isEcoFriendly && (
                <span className="flex items-center gap-1 text-green-600">
                  <Leaf className="w-4 h-4" />
                  Eco-friendly
                </span>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="text-right flex-shrink-0">
            <div className="text-2xl font-bold text-primary">
              ₹{estimate.estimatedFare}
            </div>
            {estimate.farePerPerson && (
              <div className="text-sm text-muted-foreground">
                ₹{estimate.farePerPerson}/person
              </div>
            )}
            <div className="text-xs text-muted-foreground mt-1">
              ~{estimate.estimatedDuration} min
            </div>
          </div>
        </div>

        {onSelect && (
          <Button onClick={onSelect} className="w-full mt-4">
            Select This Ride
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default CabComparisonCard;
