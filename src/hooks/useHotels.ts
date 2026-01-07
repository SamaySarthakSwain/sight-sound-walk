import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .order('star_rating', { ascending: false });

      if (error) throw error;
      setHotels(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch hotels');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  return { hotels, loading, error, refetch: fetchHotels };
};
