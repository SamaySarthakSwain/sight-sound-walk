import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCity } from "@/contexts/CityContext";

export interface Monument {
  id: string;
  title: string;
  description: string;
  location: string;
  state: string;
  category: string;
  image_url: string | null;
  latitude: number | null;
  longitude: number | null;
  facts: string[] | null;
  is_featured: boolean | null;
  distance_from_berhampur: string | null;
  region: string | null;
}

export const useMonuments = () => {
  const [monuments, setMonuments] = useState<Monument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedCity } = useCity();

  const fetchMonuments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get the city name for filtering
      const cityName = selectedCity.split(",")[0].toLowerCase().trim();
      
      // Fetch all monuments from database
      const { data, error: fetchError } = await supabase
        .from("monuments")
        .select("*")
        .order("is_featured", { ascending: false });

      if (fetchError) throw fetchError;

      // Filter monuments based on selected city
      let filteredMonuments = data || [];
      
      if (cityName === "berhampur" || cityName === "brahmapur") {
        // For Berhampur, show monuments in Berhampur area and nearby Ganjam district
        filteredMonuments = (data || []).filter((m) => {
          const loc = m.location.toLowerCase();
          return (
            loc.includes("berhampur") ||
            loc.includes("brahmapur") ||
            loc.includes("ganjam") ||
            loc.includes("gopalpur") ||
            loc.includes("taptapani") ||
            loc.includes("chilika") ||
            loc.includes("gajapati") ||
            loc.includes("aryapalli") ||
            loc.includes("palkadia") ||
            loc.includes("ramaguda") ||
            loc.includes("buguda") ||
            loc.includes("aska") ||
            loc.includes("khallikote") ||
            loc.includes("chhatrapur") ||
            loc.includes("purushottampur") ||
            m.region?.toLowerCase() === "berhampur"
          );
        });
      } else if (cityName === "bhubaneswar" || cityName === "bbsr") {
        filteredMonuments = (data || []).filter((m) => {
          const loc = m.location.toLowerCase();
          return (
            loc.includes("bhubaneswar") ||
            loc.includes("bbsr") ||
            loc.includes("konark") ||
            loc.includes("puri") ||
            m.region?.toLowerCase() === "bhubaneswar"
          );
        });
      } else if (cityName === "puri") {
        filteredMonuments = (data || []).filter((m) => {
          const loc = m.location.toLowerCase();
          return (
            loc.includes("puri") ||
            loc.includes("konark") ||
            loc.includes("chilika")
          );
        });
      } else if (cityName === "cuttack") {
        filteredMonuments = (data || []).filter((m) => {
          const loc = m.location.toLowerCase();
          return (
            loc.includes("cuttack") ||
            loc.includes("jajpur") ||
            loc.includes("angul")
          );
        });
      } else {
        // For other cities, show all Odisha monuments
        filteredMonuments = data || [];
      }

      setMonuments(filteredMonuments);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch monuments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonuments();
  }, [selectedCity]);

  return { monuments, loading, error, refetch: fetchMonuments };
};
