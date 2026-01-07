import { useState, useCallback, useMemo } from "react";
import { useLoadScript } from "@react-google-maps/api";
import Navigation from "@/components/Navigation";
import CabMapSelector from "@/components/CabMapSelector";
import CabComparisonCard from "@/components/CabComparisonCard";
import VehicleTypeFilter from "@/components/VehicleTypeFilter";
import FareHistoryChart from "@/components/FareHistoryChart";
import TripFeedbackForm from "@/components/TripFeedbackForm";
import { HotelCard } from "@/components/HotelCard";
import { HotelFilters } from "@/components/HotelFilters";
import { useHotels } from "@/hooks/useHotels";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  useCabServices,
  useVehicleTypes,
  useTripHistory,
  useSaveTrip,
  calculateFareEstimates,
  FareEstimate,
  TripHistory,
} from "@/hooks/useCabServices";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Car,
  Sparkles,
  Users,
  Leaf,
  Clock,
  TrendingDown,
  MapPin,
  Route,
  History,
  MessageSquare,
  Building2,
  Search,
  SlidersHorizontal,
  Star,
} from "lucide-react";

const libraries: ("places" | "geometry" | "drawing")[] = ["places", "geometry"];

interface RouteInfo {
  start: { lat: number; lng: number; name: string };
  end: { lat: number; lng: number; name: string };
  stops: { lat: number; lng: number; name: string }[];
  distanceKm: number;
  durationMins: number;
}

const Cabs = () => {
  const { user } = useAuth();
  const { data: cabServices, isLoading: loadingServices } = useCabServices();
  const { data: vehicleTypes, isLoading: loadingVehicles } = useVehicleTypes();
  const { data: tripHistory } = useTripHistory();
  const saveTrip = useSaveTrip();
  const { hotels, loading: loadingHotels } = useHotels();

  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [estimates, setEstimates] = useState<FareEstimate[]>([]);
  const [vehicleFilter, setVehicleFilter] = useState<string | null>(null);
  const [passengers, setPassengers] = useState(1);
  const [preferences, setPreferences] = useState({
    prioritizePrice: true,
    prioritizeTime: false,
    prioritizeEco: false,
  });
  const [aiRecommendation, setAiRecommendation] = useState<{
    recommendedIndex: number;
    reason: string;
    tips: string[];
    ecoChoice: number | null;
  } | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<TripHistory | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Hotel filters state
  const [hotelSearch, setHotelSearch] = useState("");
  const [starFilter, setStarFilter] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 30000]);
  const [amenityFilter, setAmenityFilter] = useState<string[]>([]);

  const maxHotelPrice = useMemo(() => {
    return Math.max(...hotels.map((h) => h.price_per_night_max || 0), 30000);
  }, [hotels]);

  const filteredHotels = useMemo(() => {
    return hotels.filter((hotel) => {
      if (
        hotelSearch &&
        !hotel.name.toLowerCase().includes(hotelSearch.toLowerCase()) &&
        !hotel.address?.toLowerCase().includes(hotelSearch.toLowerCase())
      ) {
        return false;
      }
      if (starFilter.length > 0 && hotel.star_rating && !starFilter.includes(hotel.star_rating)) {
        return false;
      }
      if (hotel.price_per_night_min && hotel.price_per_night_min < priceRange[0]) {
        return false;
      }
      if (hotel.price_per_night_min && hotel.price_per_night_min > priceRange[1]) {
        return false;
      }
      if (amenityFilter.length > 0) {
        const hotelAmenities = hotel.amenities || [];
        if (!amenityFilter.some((a) => hotelAmenities.includes(a))) {
          return false;
        }
      }
      return true;
    });
  }, [hotels, hotelSearch, starFilter, priceRange, amenityFilter]);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBs1TWwX2FkIWnVliKvTWxNK_mOedq5e5c",
    libraries,
  });

  const handleRouteCalculated = useCallback(
    (
      start: { lat: number; lng: number; name: string },
      end: { lat: number; lng: number; name: string },
      stops: { lat: number; lng: number; name: string }[],
      distanceKm: number,
      durationMins: number
    ) => {
      setRouteInfo({ start, end, stops, distanceKm, durationMins });

      if (cabServices && vehicleTypes) {
        const newEstimates = calculateFareEstimates(
          cabServices,
          vehicleTypes,
          distanceKm,
          durationMins,
          passengers
        );
        setEstimates(newEstimates);
        setAiRecommendation(null);
      }
    },
    [cabServices, vehicleTypes, passengers]
  );

  // Recalculate when passengers change
  const recalculateEstimates = useCallback(() => {
    if (routeInfo && cabServices && vehicleTypes) {
      const newEstimates = calculateFareEstimates(
        cabServices,
        vehicleTypes,
        routeInfo.distanceKm,
        routeInfo.durationMins,
        passengers
      );
      setEstimates(newEstimates);
    }
  }, [routeInfo, cabServices, vehicleTypes, passengers]);

  const filteredEstimates = useMemo(() => {
    if (!vehicleFilter) return estimates;
    return estimates.filter((e) => e.vehicleType.vehicle_type === vehicleFilter);
  }, [estimates, vehicleFilter]);

  const getAiSuggestion = async () => {
    if (filteredEstimates.length === 0) return;

    setIsLoadingAi(true);
    try {
      const { data, error } = await supabase.functions.invoke("suggest-cab-fare", {
        body: {
          estimates: filteredEstimates.map((e) => ({
            serviceName: e.cabService.name,
            vehicleType: e.vehicleType.vehicle_name,
            fare: e.estimatedFare,
            waitTime: e.waitTime,
            isEcoFriendly: e.isEcoFriendly,
            capacity: e.vehicleType.capacity,
          })),
          passengers,
          preferences,
        },
      });

      if (error) throw error;
      setAiRecommendation(data);
      toast.success("AI recommendation ready!");
    } catch (error) {
      console.error("AI suggestion error:", error);
      toast.error("Could not get AI suggestion");
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleSelectRide = async (estimate: FareEstimate) => {
    if (!user) {
      toast.error("Please login to book a ride");
      return;
    }

    if (!routeInfo) return;

    try {
      const savedTrip = await saveTrip.mutateAsync({
        cab_service_id: estimate.cabService.id,
        vehicle_type_id: estimate.vehicleType.id,
        start_location: routeInfo.start.name,
        start_lat: routeInfo.start.lat,
        start_lng: routeInfo.start.lng,
        end_location: routeInfo.end.name,
        end_lat: routeInfo.end.lat,
        end_lng: routeInfo.end.lng,
        stops: routeInfo.stops,
        distance_km: routeInfo.distanceKm,
        duration_mins: routeInfo.durationMins,
        estimated_fare: estimate.estimatedFare,
        actual_fare: null,
        passengers,
      });

      toast.success("Ride saved! You can provide feedback after your trip.");
      setSelectedTrip(savedTrip as TripHistory);
      setShowFeedback(true);
    } catch (error) {
      toast.error("Failed to save ride");
    }
  };

  if (loadError) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 container mx-auto px-4">
          <p className="text-destructive">Error loading maps. Please refresh.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
              <Car className="w-8 h-8 text-primary" />
              Cab Comparison
            </h1>
            <p className="text-muted-foreground">
              Compare fares across Ola, Uber, Rapido, and local services
            </p>
          </div>

          <Tabs defaultValue="compare" className="space-y-6">
            <TabsList className="grid w-full max-w-2xl grid-cols-4">
              <TabsTrigger value="compare" className="gap-2">
                <Route className="w-4 h-4" />
                Compare
              </TabsTrigger>
              <TabsTrigger value="map" className="gap-2">
                <MapPin className="w-4 h-4" />
                Map Select
              </TabsTrigger>
              <TabsTrigger value="hotels" className="gap-2">
                <Building2 className="w-4 h-4" />
                Hotels
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-2">
                <History className="w-4 h-4" />
                History
              </TabsTrigger>
            </TabsList>

            {/* Quick Compare Tab */}
            <TabsContent value="compare" className="space-y-6">
              {/* Route Input */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Route className="w-5 h-5 text-primary" />
                    Quick Route Entry
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Distance (km)</Label>
                      <Input
                        type="number"
                        placeholder="e.g., 10"
                        onChange={(e) => {
                          const km = parseFloat(e.target.value) || 0;
                          if (km > 0) {
                            const estimatedMins = Math.round(km * 3);
                            setRouteInfo({
                              start: { lat: 0, lng: 0, name: "Start" },
                              end: { lat: 0, lng: 0, name: "End" },
                              stops: [],
                              distanceKm: km,
                              durationMins: estimatedMins,
                            });
                            if (cabServices && vehicleTypes) {
                              const newEstimates = calculateFareEstimates(
                                cabServices,
                                vehicleTypes,
                                km,
                                estimatedMins,
                                passengers
                              );
                              setEstimates(newEstimates);
                              setAiRecommendation(null);
                            }
                          }
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Passengers</Label>
                      <Select
                        value={passengers.toString()}
                        onValueChange={(v) => {
                          setPassengers(parseInt(v));
                          setTimeout(recalculateEstimates, 0);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6].map((n) => (
                            <SelectItem key={n} value={n.toString()}>
                              {n} {n === 1 ? "passenger" : "passengers"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Duration (est.)</Label>
                      <Input
                        type="text"
                        value={routeInfo ? `~${routeInfo.durationMins} min` : "-"}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                  </div>

                  {/* Preferences */}
                  <div className="flex flex-wrap gap-4 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <Switch
                        id="price"
                        checked={preferences.prioritizePrice}
                        onCheckedChange={(v) =>
                          setPreferences((p) => ({ ...p, prioritizePrice: v }))
                        }
                      />
                      <Label htmlFor="price" className="flex items-center gap-1 cursor-pointer">
                        <TrendingDown className="w-4 h-4" />
                        Lowest Price
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="time"
                        checked={preferences.prioritizeTime}
                        onCheckedChange={(v) =>
                          setPreferences((p) => ({ ...p, prioritizeTime: v }))
                        }
                      />
                      <Label htmlFor="time" className="flex items-center gap-1 cursor-pointer">
                        <Clock className="w-4 h-4" />
                        Fastest Pickup
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="eco"
                        checked={preferences.prioritizeEco}
                        onCheckedChange={(v) =>
                          setPreferences((p) => ({ ...p, prioritizeEco: v }))
                        }
                      />
                      <Label htmlFor="eco" className="flex items-center gap-1 cursor-pointer">
                        <Leaf className="w-4 h-4" />
                        Eco-Friendly
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Vehicle Type Filter */}
              {estimates.length > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <VehicleTypeFilter
                    selectedType={vehicleFilter}
                    onTypeChange={setVehicleFilter}
                  />
                  <Button
                    onClick={getAiSuggestion}
                    disabled={isLoadingAi}
                    className="gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    {isLoadingAi ? "Analyzing..." : "Get AI Suggestion"}
                  </Button>
                </div>
              )}

              {/* AI Recommendation */}
              {aiRecommendation && (
                <Card className="border-primary bg-primary/5">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">AI Recommendation</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {aiRecommendation.reason}
                        </p>
                        {aiRecommendation.tips.length > 0 && (
                          <div className="text-sm">
                            <p className="font-medium mb-1">Money-saving tips:</p>
                            <ul className="list-disc list-inside text-muted-foreground">
                              {aiRecommendation.tips.map((tip, i) => (
                                <li key={i}>{tip}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Fare Estimates */}
              {loadingServices || loadingVehicles ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-32" />
                  ))}
                </div>
              ) : filteredEstimates.length > 0 ? (
                <div className="space-y-4">
                  {filteredEstimates.map((estimate, index) => (
                    <CabComparisonCard
                      key={`${estimate.cabService.id}-${estimate.vehicleType.id}`}
                      estimate={estimate}
                      isRecommended={aiRecommendation?.recommendedIndex === index}
                      isCheapest={index === 0}
                      isEcoChoice={
                        aiRecommendation?.ecoChoice === index ||
                        (!aiRecommendation && estimate.isEcoFriendly && index === filteredEstimates.findIndex((e) => e.isEcoFriendly))
                      }
                      onSelect={() => handleSelectRide(estimate)}
                    />
                  ))}
                </div>
              ) : routeInfo ? (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    No cab services available for this route.
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Enter the distance to compare cab fares</p>
                  </CardContent>
                </Card>
              )}

              {/* Group Split Info */}
              {passengers > 1 && estimates.length > 0 && (
                <Card className="bg-accent/10">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">Group Ride Splitting</p>
                        <p className="text-sm text-muted-foreground">
                          With {passengers} passengers, the cheapest option is{" "}
                          <strong>₹{Math.ceil(estimates[0]?.estimatedFare / passengers)}/person</strong>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Map Select Tab */}
            <TabsContent value="map" className="space-y-6">
              {!isLoaded ? (
                <Skeleton className="h-[500px]" />
              ) : (
                <CabMapSelector onRouteCalculated={handleRouteCalculated} />
              )}

              {/* Show estimates if route calculated from map */}
              {routeInfo && estimates.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Available Rides</h2>
                    <VehicleTypeFilter
                      selectedType={vehicleFilter}
                      onTypeChange={setVehicleFilter}
                    />
                  </div>
                  {filteredEstimates.slice(0, 5).map((estimate, index) => (
                    <CabComparisonCard
                      key={`${estimate.cabService.id}-${estimate.vehicleType.id}`}
                      estimate={estimate}
                      isCheapest={index === 0}
                      isEcoChoice={estimate.isEcoFriendly}
                      onSelect={() => handleSelectRide(estimate)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Hotels Tab */}
            <TabsContent value="hotels" className="space-y-6">
              {/* Hotel Search & Filter Header */}
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Building2 className="w-6 h-6 text-primary" />
                    Hotels in Bhubaneswar
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Find the perfect stay with real Google ratings
                  </p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search hotels..."
                      value={hotelSearch}
                      onChange={(e) => setHotelSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="icon" className="md:hidden">
                        <SlidersHorizontal className="h-4 w-4" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-80">
                      <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                        <SheetDescription>
                          Narrow down your hotel search
                        </SheetDescription>
                      </SheetHeader>
                      <div className="mt-4">
                        <HotelFilters
                          starFilter={starFilter}
                          setStarFilter={setStarFilter}
                          priceRange={priceRange}
                          setPriceRange={setPriceRange}
                          amenityFilter={amenityFilter}
                          setAmenityFilter={setAmenityFilter}
                          maxPrice={maxHotelPrice}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>

              {/* Hotel Content with Sidebar */}
              <div className="flex gap-6">
                {/* Sidebar Filters - Desktop */}
                <aside className="hidden md:block w-64 flex-shrink-0">
                  <HotelFilters
                    starFilter={starFilter}
                    setStarFilter={setStarFilter}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    amenityFilter={amenityFilter}
                    setAmenityFilter={setAmenityFilter}
                    maxPrice={maxHotelPrice}
                  />
                </aside>

                {/* Hotels Grid */}
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-4">
                    Showing {filteredHotels.length} of {hotels.length} hotels
                  </p>

                  {loadingHotels ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="space-y-3">
                          <Skeleton className="h-48 w-full rounded-lg" />
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                      ))}
                    </div>
                  ) : filteredHotels.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No hotels found</h3>
                        <p className="text-muted-foreground">
                          Try adjusting your filters or search query
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {filteredHotels.map((hotel) => (
                        <HotelCard key={hotel.id} hotel={hotel} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="space-y-6">
              {!user ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <History className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Please login to view your trip history
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <FareHistoryChart trips={tripHistory || []} />

                  {tripHistory && tripHistory.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MessageSquare className="w-5 h-5 text-primary" />
                          Provide Feedback
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Select a recent trip to provide feedback:
                        </p>
                        <div className="space-y-2">
                          {tripHistory.slice(0, 3).map((trip) => (
                            <Button
                              key={trip.id}
                              variant="outline"
                              className="w-full justify-start"
                              onClick={() => {
                                setSelectedTrip(trip);
                                setShowFeedback(true);
                              }}
                            >
                              <MapPin className="w-4 h-4 mr-2" />
                              {trip.start_location} → {trip.end_location}
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Feedback Dialog */}
      <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Trip Feedback</DialogTitle>
          </DialogHeader>
          {selectedTrip && (
            <TripFeedbackForm
              trip={selectedTrip}
              onSubmit={() => {
                setShowFeedback(false);
                setSelectedTrip(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cabs;
