import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface VisitData {
  place_name: string;
  place_category?: string;
  place_image?: string;
}

export const useVisitHistory = () => {
  const { user } = useAuth();

  const trackVisit = async (visitData: VisitData) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("visit_history")
        .insert({
          user_id: user.id,
          place_name: visitData.place_name,
          place_category: visitData.place_category,
          place_image: visitData.place_image,
        });

      if (error) {
        console.error("Error tracking visit:", error.message);
      }
    } catch (err) {
      console.error("Error tracking visit:", err);
    }
  };

  return { trackVisit };
};
