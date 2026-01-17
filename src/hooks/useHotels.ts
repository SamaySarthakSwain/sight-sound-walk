import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCity } from '@/contexts/CityContext';

export interface Hotel {
  id: string;
  name: string;
  description: string | null;
  location: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  star_rating: number | null;
  google_rating: number | null;
  google_total_ratings: number | null;
  image_url: string | null;
  amenities: string[] | null;
  price_per_night_min: number | null;
  price_per_night_max: number | null;
  available_rooms: number | null;
  total_rooms: number | null;
  contact_phone: string | null;
}

export const useHotels = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedCity } = useCity();

  const fetchHotels = async () => {
    try {
      setLoading(true);
      
      // Get the city name for filtering
      const cityName = selectedCity.split(",")[0].toLowerCase().trim();
      
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .order('star_rating', { ascending: false });

      if (error) throw error;
      
      // Filter hotels based on selected city
      let filteredHotels = data || [];
      
      if (cityName === "berhampur" || cityName === "brahmapur") {
        filteredHotels = (data || []).filter((h) => {
          const loc = h.location.toLowerCase();
          return (
            loc.includes("berhampur") ||
            loc.includes("brahmapur") ||
            loc.includes("gopalpur") ||
            loc.includes("taptapani") ||
            loc.includes("chilika") ||
            loc.includes("rambha") ||
            loc.includes("satpada") ||
            loc.includes("barkul")
          );
        });
      } else if (cityName === "bhubaneswar" || cityName === "bbsr") {
        filteredHotels = (data || []).filter((h) => {
          const loc = h.location.toLowerCase();
          return loc.includes("bhubaneswar") || loc.includes("bbsr");
        });
      } else if (cityName === "puri") {
        filteredHotels = (data || []).filter((h) => {
          const loc = h.location.toLowerCase();
          return loc.includes("puri") || loc.includes("konark");
        });
      } else if (cityName === "cuttack") {
        filteredHotels = (data || []).filter((h) => {
          const loc = h.location.toLowerCase();
          return loc.includes("cuttack");
        });
      }
      // For other cities, show all hotels
      
      setHotels(filteredHotels);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch hotels');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, [selectedCity]);

  return { hotels, loading, error, refetch: fetchHotels };
};
