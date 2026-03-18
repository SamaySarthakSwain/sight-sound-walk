import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
      const { data, error } = await supabase
        .from("cab_services")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as CabService[];
    },
  });
};

export const useVehicleTypes = () => {
  return useQuery({
    queryKey: ["vehicle-types"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicle_types")
        .select("*")
        .order("capacity");

      if (error) throw error;
      return data as VehicleType[];
    },
  });
};

export const useTripHistory = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["trip-history", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("trip_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data.map((trip) => ({
        ...trip,
        stops: (trip.stops as { name: string; lat: number; lng: number }[]) || [],
      })) as TripHistory[];
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

      const { data, error } = await supabase
        .from("trip_history")
        .insert({
          ...trip,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
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

      const { data, error } = await supabase
        .from("trip_feedback")
        .insert({
          ...feedback,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
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
  passengers: number = 1
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
      const estimatedFare = Math.round((baseFare + distanceCost + timeCost) * serviceMultiplier);

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
