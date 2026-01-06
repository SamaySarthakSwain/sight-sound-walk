import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TripHistory } from "@/hooks/useCabServices";
import { TrendingUp, TrendingDown, Minus, MapPin, Clock, Calendar } from "lucide-react";
import { format } from "date-fns";

interface FareHistoryChartProps {
  trips: TripHistory[];
}

const FareHistoryChart = ({ trips }: FareHistoryChartProps) => {
  if (trips.length === 0) {
    return null;
  }

  // Calculate average fare
  const tripWithFares = trips.filter((t) => t.estimated_fare);
  const avgFare =
    tripWithFares.length > 0
      ? tripWithFares.reduce((sum, t) => sum + (t.estimated_fare || 0), 0) /
        tripWithFares.length
      : 0;

  // Get fare trend
  const lastTwoTrips = tripWithFares.slice(0, 2);
  const fareChange =
    lastTwoTrips.length === 2
      ? (lastTwoTrips[0].estimated_fare || 0) - (lastTwoTrips[1].estimated_fare || 0)
      : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="w-5 h-5 text-primary" />
          Fare History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-muted rounded-lg">
            <p className="text-2xl font-bold text-primary">₹{Math.round(avgFare)}</p>
            <p className="text-xs text-muted-foreground">Avg. Fare</p>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <p className="text-2xl font-bold">{trips.length}</p>
            <p className="text-xs text-muted-foreground">Total Trips</p>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-center gap-1">
              {fareChange > 0 ? (
                <TrendingUp className="w-5 h-5 text-red-500" />
              ) : fareChange < 0 ? (
                <TrendingDown className="w-5 h-5 text-green-500" />
              ) : (
                <Minus className="w-5 h-5" />
              )}
              <p
                className={`text-2xl font-bold ${
                  fareChange > 0 ? "text-red-500" : fareChange < 0 ? "text-green-500" : ""
                }`}
              >
                {fareChange !== 0 ? `₹${Math.abs(fareChange)}` : "-"}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">Trend</p>
          </div>
        </div>

        {/* Recent Trips */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Recent Trips</p>
          {trips.slice(0, 5).map((trip) => (
            <div
              key={trip.id}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="truncate">
                    {trip.start_location} → {trip.end_location}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(trip.created_at), "MMM d, yyyy")}
                  </span>
                  {trip.distance_km && (
                    <span>{trip.distance_km.toFixed(1)} km</span>
                  )}
                  {trip.duration_mins && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {trip.duration_mins} min
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-semibold">
                  ₹{trip.estimated_fare || trip.actual_fare || "-"}
                </p>
                {trip.passengers > 1 && (
                  <p className="text-xs text-muted-foreground">
                    {trip.passengers} passengers
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FareHistoryChart;
