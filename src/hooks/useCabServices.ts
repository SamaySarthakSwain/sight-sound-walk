import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "./useAuth";

export interface CabService {
  id: string;
  name: string;
  logo_url: string | null;
  is_local: boolean;
  has_2_wheeler: boolean;
  has_3_wheeler: boolean;
  has_4_wheeler: boolean;
  base_fare_2w: number;
  per_km_2w: number;
  base_fare_3w: number;
  per_km_3w: number;
  base_fare_4w: number;
  per_km_4w: number;
  avg_wait_time_mins: number;
  eco_rating: number;
}

export interface VehicleType {
  id: string;
  cab_service_id: string;
  vehicle_type: string;
  vehicle_name: string;
  capacity: number;
  base_fare: number;
  per_km_rate: number;
  per_min_rate: number;
  is_eco_friendly: boolean;
}

export interface TripHistory {
  id: string;
  user_id: string;
  cab_service_id: string;
  vehicle_type_id: string;
  start_location: string;
  start_lat: number | null;
  start_lng: number | null;
  end_location: string;
  end_lat: number | null;
  end_lng: number | null;
  stops: { name: string; lat: number; lng: number }[];
  distance_km: number | null;
  duration_mins: number | null;
  estimated_fare: number | null;
  actual_fare: number | null;
  passengers: number;
  created_at: string;
}

export interface TripFeedback {
  id: string;
  trip_id: string;
  user_id: string;
  rating: number;
  driver_rating: number | null;
  vehicle_condition: number | null;
  punctuality: number | null;
  comment: string | null;
  would_recommend: boolean | null;
  created_at: string;
}

export interface FareEstimate {
  cabService: CabService;
  vehicleType: VehicleType;
  estimatedFare: number;
  estimatedDuration: number;
  waitTime: number;
  isEcoFriendly: boolean;
  farePerPerson?: number;
}

export const useCabServices = () => {
  return useQuery({
    queryKey: ["cab-services"],
    queryFn: async () => {
      return [
        {
          id: "1",
          name: "Ola Cabs",
          logo_url: null,
          is_local: false,
          has_2_wheeler: true,
          has_3_wheeler: true,
          has_4_wheeler: true,
          base_fare_2w: 20,
          per_km_2w: 6,
          base_fare_3w: 40,
          per_km_3w: 12,
          base_fare_4w: 70,
          per_km_4w: 16,
          avg_wait_time_mins: 4,
          eco_rating: 4.2
        },
        {
          id: "2",
          name: "Uber",
          logo_url: null,
          is_local: false,
          has_2_wheeler: true,
          has_3_wheeler: true,
          has_4_wheeler: true,
          base_fare_2w: 25,
          per_km_2w: 7,
          base_fare_3w: 45,
          per_km_3w: 13,
          base_fare_4w: 80,
          per_km_4w: 18,
          avg_wait_time_mins: 5,
          eco_rating: 4.0
        },
        {
          id: "3",
          name: "Rapido",
          logo_url: null,
          is_local: false,
          has_2_wheeler: true,
          has_3_wheeler: true,
          has_4_wheeler: false,
          base_fare_2w: 15,
          per_km_2w: 5,
          base_fare_3w: 35,
          per_km_3w: 10,
          base_fare_4w: 0,
          per_km_4w: 0,
          avg_wait_time_mins: 3,
          eco_rating: 4.5
        },
        {
          id: "4",
          name: "Mo E-Ride (Odisha Eco)",
          logo_url: null,
          is_local: true,
          has_2_wheeler: false,
          has_3_wheeler: true,
          has_4_wheeler: true,
          base_fare_2w: 0,
          per_km_2w: 0,
          base_fare_3w: 30,
          per_km_3w: 8,
          base_fare_4w: 60,
          per_km_4w: 12,
          avg_wait_time_mins: 6,
          eco_rating: 5.0
        }
      ] as CabService[];
    },
  });
};

export const useVehicleTypes = () => {
  return useQuery({
    queryKey: ["vehicle-types"],
    queryFn: async () => {
      const vehicles: VehicleType[] = [];
      const serviceIds = ["1", "2", "3", "4"];

      serviceIds.forEach((sid) => {
        // Bike
        if (sid !== "4") {
          vehicles.push({
            id: `${sid}-bike`,
            cab_service_id: sid,
            vehicle_type: "2_wheeler",
            vehicle_name: "Bike Taxi",
            capacity: 1,
            base_fare: 20,
            per_km_rate: 6,
            per_min_rate: 1,
            is_eco_friendly: false
          });
        }
        // Auto
        vehicles.push({
          id: `${sid}-auto`,
          cab_service_id: sid,
          vehicle_type: "3_wheeler",
          vehicle_name: sid === "4" ? "Electric Auto" : "Auto Rickshaw",
          capacity: 3,
          base_fare: 40,
          per_km_rate: 12,
          per_min_rate: 1.5,
          is_eco_friendly: sid === "4"
        });
        // Sedan
        if (sid !== "3") {
          vehicles.push({
            id: `${sid}-sedan`,
            cab_service_id: sid,
            vehicle_type: "4_wheeler",
            vehicle_name: sid === "4" ? "Mo Electric Cab" : "Sedan Prime",
            capacity: 4,
            base_fare: 70,
            per_km_rate: 16,
            per_min_rate: 2,
            is_eco_friendly: sid === "4"
          });
          // SUV
          vehicles.push({
            id: `${sid}-suv`,
            cab_service_id: sid,
            vehicle_type: "4_wheeler",
            vehicle_name: "SUV XL",
            capacity: 6,
            base_fare: 100,
            per_km_rate: 22,
            per_min_rate: 2.5,
            is_eco_friendly: false
          });
        }
      });

      return vehicles;
    },
  });
};

export const useTripHistory = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["trip-history", user?.id],
    queryFn: async () => {
      if (!user) return [];
      return []; // Return empty trip history
    },
    enabled: !!user,
  });
};

export const useSaveTrip = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (trip: Omit<TripHistory, "id" | "user_id" | "created_at">) => {
      if (!user) throw new Error("Must be logged in to save trip");

      return { id: "1", ...trip };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trip-history"] });
    },
  });
};

export const useSaveFeedback = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (feedback: Omit<TripFeedback, "id" | "user_id" | "created_at">) => {
      if (!user) throw new Error("Must be logged in to submit feedback");

      return { id: "1", ...feedback };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trip-history"] });
    },
  });
};

export const calculateFareEstimates = (
  cabServices: CabService[],
  vehicleTypes: VehicleType[],
  distanceKm: number,
  durationMins: number,
  passengers: number = 1,
  aiBaseFare?: number
): FareEstimate[] => {
  const estimates: FareEstimate[] = [];

  cabServices.forEach((service) => {
    const serviceVehicles = vehicleTypes.filter(
      (v) => v.cab_service_id === service.id
    );

    serviceVehicles.forEach((vehicle) => {
      // Use realistic default Indian Rupee base rates for Odisha if DB values are inaccurate
      let baseFare = Number(vehicle.base_fare) || 0;
      let perKm = Number(vehicle.per_km_rate) || 0;
      let perMin = Number(vehicle.per_min_rate) || 0;

      if (vehicle.vehicle_type === '2_wheeler') {
        baseFare = 20;
        perKm = 6;
        perMin = 1;
      } else if (vehicle.vehicle_type === '3_wheeler') {
        baseFare = 40;
        perKm = 12;
        perMin = 1.5;
      } else if (vehicle.vehicle_type === '4_wheeler') {
        if (vehicle.capacity > 4) {
          baseFare = 100;
          perKm = 22;
          perMin = 2.5;
        } else {
          baseFare = 70;
          perKm = 16;
          perMin = 2;
        }
      }

      // Slightly vary prices per service provider to reflect real app differences
      let serviceMultiplier = 1.0;
      const sName = service.name.toLowerCase();
      if (sName.includes('uber')) serviceMultiplier = 1.15;
      else if (sName.includes('ola')) serviceMultiplier = 1.1;
      else if (sName.includes('rapido')) serviceMultiplier = 0.95;

      const distanceCost = perKm * distanceKm;
      const timeCost = perMin * durationMins;
      
      let estimatedFare = 0;
      if (aiBaseFare) {
         // Apply AI base fare calibrated per vehicle type
         let vehicleMultiplier = 1.0;
         if (vehicle.vehicle_type === '2_wheeler') vehicleMultiplier = 0.4;
         if (vehicle.vehicle_type === '3_wheeler') vehicleMultiplier = 0.6;
         if (vehicle.capacity > 4) vehicleMultiplier = 1.4;
         estimatedFare = Math.round((aiBaseFare * vehicleMultiplier) * serviceMultiplier);
      } else {
         estimatedFare = Math.round((baseFare + distanceCost + timeCost) * serviceMultiplier);
      }

      if (estimatedFare > 0) {
        estimates.push({
          cabService: service,
          vehicleType: vehicle,
          estimatedFare,
          estimatedDuration: durationMins,
          waitTime: service.avg_wait_time_mins,
          isEcoFriendly: vehicle.is_eco_friendly,
          farePerPerson: passengers > 1 ? Math.ceil(estimatedFare / passengers) : undefined,
        });
      }
    });
  });

  return estimates.sort((a, b) => a.estimatedFare - b.estimatedFare);
};
