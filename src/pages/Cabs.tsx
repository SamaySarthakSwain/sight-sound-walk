import { useState, useMemo } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  useCabServices,
  useVehicleTypes,
  calculateFareEstimates,
  FareEstimate,
} from "@/hooks/useCabServices";
import {
  Car,
  Bike,
  Users,
  MapPin,
  Plus,
  X,
  Navigation as NavIcon,
  Star,
  Clock,
  Leaf,
  TrendingDown,
  Bus,
} from "lucide-react";

const Cabs = () => {
  const { data: cabServices, isLoading: loadingServices } = useCabServices();
  const { data: vehicleTypes, isLoading: loadingVehicles } = useVehicleTypes();

  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [stops, setStops] = useState<string[]>([]);
  const [passengers, setPassengers] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [estimates, setEstimates] = useState<FareEstimate[]>([]);

  // Mock distance calculation based on locations (in real app, use Google Maps API)
  const calculateMockDistance = () => {
    // Simulated distance based on start/end for demo
    const baseDistance = 5 + Math.random() * 15; // 5-20 km
    const stopsExtra = stops.filter(s => s.trim()).length * 2; // 2km per stop
    return baseDistance + stopsExtra;
  };

  const handleAddStop = () => {
    if (stops.length < 5) {
      setStops([...stops, ""]);
    }
  };

  const handleRemoveStop = (index: number) => {
    setStops(stops.filter((_, i) => i !== index));
  };

  const handleStopChange = (index: number, value: string) => {
    const newStops = [...stops];
    newStops[index] = value;
    setStops(newStops);
  };

  const handleGo = () => {
    if (!startLocation.trim() || !endLocation.trim()) {
      return;
    }

    const distanceKm = calculateMockDistance();
    const durationMins = Math.round(distanceKm * 3); // ~3 min per km

    if (cabServices && vehicleTypes) {
      const newEstimates = calculateFareEstimates(
        cabServices,
        vehicleTypes,
        distanceKm,
        durationMins,
        passengers
      );
      setEstimates(newEstimates);
      setShowResults(true);
    }
  };

  // Group estimates by vehicle type
  const groupedEstimates = useMemo(() => {
    const groups: Record<string, FareEstimate[]> = {
      "2_wheeler": [],
      "3_wheeler": [],
      "4_wheeler": [],
    };

    estimates.forEach((est) => {
      const type = est.vehicleType.vehicle_type;
      if (groups[type]) {
        groups[type].push(est);
      }
    });

    // Sort each group by fare
    Object.keys(groups).forEach((key) => {
      groups[key].sort((a, b) => a.estimatedFare - b.estimatedFare);
    });

    return groups;
  }, [estimates]);

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case "2_wheeler":
        return <Bike className="w-5 h-5" />;
      case "3_wheeler":
        return <Car className="w-5 h-5" />;
      case "4_wheeler":
        return <Car className="w-6 h-6" />;
      default:
        return <Bus className="w-5 h-5" />;
    }
  };

  const getVehicleLabel = (type: string) => {
    switch (type) {
      case "2_wheeler":
        return "2 Wheelers (Bike)";
      case "3_wheeler":
        return "3 Wheelers (Auto)";
      case "4_wheeler":
        return "4 Wheelers (Cab)";
      default:
        return type;
    }
  };

  // Generate mock driver rating
  const getDriverRating = () => {
    return (4 + Math.random() * 0.9).toFixed(1);
  };

  const isLoading = loadingServices || loadingVehicles;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center justify-center gap-3">
              <Car className="w-8 h-8 text-primary" />
              Compare Cab Fares
            </h1>
            <p className="text-muted-foreground">
              Compare prices across Ola, Uber, Rapido, and local services in Bhubaneswar
            </p>
          </div>

          {/* Route Input Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <NavIcon className="w-5 h-5 text-primary" />
                Enter Your Route
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Starting Point */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-green-500" />
                  Starting Point
                </Label>
                <Input
                  placeholder="e.g., Patia Square, Bhubaneswar"
                  value={startLocation}
                  onChange={(e) => setStartLocation(e.target.value)}
                />
              </div>

              {/* Stops */}
              {stops.map((stop, index) => (
                <div key={index} className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-yellow-500" />
                    Stop {index + 1}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder={`e.g., Stop ${index + 1} location`}
                      value={stop}
                      onChange={(e) => handleStopChange(index, e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveStop(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {/* Add Stop Button */}
              {stops.length < 5 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddStop}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Stop
                </Button>
              )}

              {/* Ending Point */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-500" />
                  Destination
                </Label>
                <Input
                  placeholder="e.g., Kalinga Stadium, Bhubaneswar"
                  value={endLocation}
                  onChange={(e) => setEndLocation(e.target.value)}
                />
              </div>

              {/* Passengers */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Number of Passengers
                </Label>
                <Select
                  value={passengers.toString()}
                  onValueChange={(v) => setPassengers(parseInt(v))}
                >
                  <SelectTrigger className="w-full md:w-48">
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

              {/* Go Button */}
              <Button
                onClick={handleGo}
                disabled={!startLocation.trim() || !endLocation.trim() || isLoading}
                className="w-full mt-4 py-6 text-lg font-semibold"
                size="lg"
              >
                {isLoading ? "Loading services..." : "Go - Compare Fares"}
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          {showResults && estimates.length > 0 && (
            <div className="space-y-6">
              {/* Route Summary */}
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <Badge variant="secondary" className="gap-1">
                      <MapPin className="w-3 h-3" />
                      {startLocation}
                    </Badge>
                    {stops.filter(s => s.trim()).map((stop, i) => (
                      <span key={i} className="flex items-center gap-1">
                        →
                        <Badge variant="outline" className="gap-1">
                          {stop}
                        </Badge>
                      </span>
                    ))}
                    <span>→</span>
                    <Badge variant="secondary" className="gap-1">
                      <MapPin className="w-3 h-3" />
                      {endLocation}
                    </Badge>
                    <span className="ml-auto text-muted-foreground">
                      {passengers} passenger{passengers > 1 ? "s" : ""}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Vehicle Type Tabs */}
              <Tabs defaultValue="all" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="2_wheeler" className="gap-1">
                    <Bike className="w-4 h-4" />
                    Bike
                  </TabsTrigger>
                  <TabsTrigger value="3_wheeler" className="gap-1">
                    <Car className="w-4 h-4" />
                    Auto
                  </TabsTrigger>
                  <TabsTrigger value="4_wheeler" className="gap-1">
                    <Car className="w-4 h-4" />
                    Cab
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-6">
                  {Object.entries(groupedEstimates).map(([type, typeEstimates]) => (
                    typeEstimates.length > 0 && (
                      <div key={type} className="space-y-3">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          {getVehicleIcon(type)}
                          {getVehicleLabel(type)}
                        </h3>
                        <div className="grid gap-3">
                          {typeEstimates.map((estimate, index) => (
                            <FareCard
                              key={`${estimate.cabService.id}-${estimate.vehicleType.id}`}
                              estimate={estimate}
                              isCheapest={index === 0}
                              driverRating={getDriverRating()}
                            />
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                </TabsContent>

                {["2_wheeler", "3_wheeler", "4_wheeler"].map((type) => (
                  <TabsContent key={type} value={type} className="space-y-3">
                    {groupedEstimates[type]?.length > 0 ? (
                      groupedEstimates[type].map((estimate, index) => (
                        <FareCard
                          key={`${estimate.cabService.id}-${estimate.vehicleType.id}`}
                          estimate={estimate}
                          isCheapest={index === 0}
                          driverRating={getDriverRating()}
                        />
                      ))
                    ) : (
                      <Card className="p-8 text-center text-muted-foreground">
                        No {getVehicleLabel(type)} available for this route
                      </Card>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Fare Card Component
interface FareCardProps {
  estimate: FareEstimate;
  isCheapest: boolean;
  driverRating: string;
}

const FareCard = ({ estimate, isCheapest, driverRating }: FareCardProps) => {
  return (
    <Card className={`overflow-hidden transition-all hover:shadow-lg ${isCheapest ? "ring-2 ring-primary bg-primary/5" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Logo/Icon */}
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
              <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                <Car className="w-6 h-6 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold truncate">{estimate.cabService.name}</h4>
              {estimate.cabService.is_local && (
                <Badge variant="outline" className="text-xs">Local</Badge>
              )}
              {isCheapest && (
                <Badge className="bg-green-600 text-white text-xs gap-1">
                  <TrendingDown className="w-3 h-3" />
                  Cheapest
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{estimate.vehicleType.vehicle_name}</p>
            <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                {driverRating}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {estimate.vehicleType.capacity}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                ~{estimate.waitTime} min
              </span>
              {estimate.isEcoFriendly && (
                <span className="flex items-center gap-1 text-green-600">
                  <Leaf className="w-4 h-4" />
                  Eco
                </span>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="text-right flex-shrink-0">
            <div className="text-2xl font-bold text-primary">₹{estimate.estimatedFare}</div>
            {estimate.farePerPerson && estimate.farePerPerson !== estimate.estimatedFare && (
              <div className="text-sm text-muted-foreground">
                ₹{estimate.farePerPerson}/person
              </div>
            )}
            <div className="text-xs text-muted-foreground">
              ~{estimate.estimatedDuration} min
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Cabs;
