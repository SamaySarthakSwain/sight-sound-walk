import { useState, useEffect } from 'react';

import { useCity } from '@/contexts/CityContext';
import { fallbackHotels } from '@/data/fallbackHotels';

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
  // Optional Supabase fields to satisfy internal types
  contact_email?: string | null;
  website?: string | null;
  google_place_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export const useHotels = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedCity } = useCity();

  const fetchHotels = async () => {
    try {
      setLoading(true);
      
      const cityName = selectedCity.split(",")[0].toLowerCase().trim();
      
      let hotelData: Hotel[] = [];
      try {
        const res = await fetch("http://localhost:5000/api/hotels");
        if (res.ok) {
          hotelData = await res.json();
        } else {
          hotelData = fallbackHotels;
        }
      } catch (e) {
        hotelData = fallbackHotels;
      }

      
      let filteredHotels = hotelData;
      
      if (cityName === "berhampur" || cityName === "brahmapur") {
        filteredHotels = hotelData.filter((h) => {
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
        filteredHotels = hotelData.filter((h) => {
          const loc = h.location.toLowerCase();
          return loc.includes("bhubaneswar") || loc.includes("bbsr");
        });
      } else if (cityName === "puri") {
        filteredHotels = hotelData.filter((h) => {
          const loc = h.location.toLowerCase();
          return loc.includes("puri") || loc.includes("konark");
        });
      } else if (cityName === "cuttack") {
        filteredHotels = hotelData.filter((h) => {
          const loc = h.location.toLowerCase();
          return loc.includes("cuttack");
        });
      }
      
      setHotels(filteredHotels);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch hotels');
      setHotels(fallbackHotels);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, [selectedCity]);

  return { hotels, loading, error, refetch: fetchHotels };
};
