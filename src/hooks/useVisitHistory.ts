import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

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
      const { error: visitError } = await supabase
        .from("visit_history")
        .insert({
          user_id: user.id,
          place_name: visitData.place_name,
          place_category: visitData.place_category,
          place_image: visitData.place_image,
        });

      if (visitError) {
        console.error("Error tracking visit:", visitError.message);
        return;
      }

      toast.success(`Visited: ${visitData.place_name}`, { duration: 2000 });
    } catch (err) {
      console.error("Error in visit tracking:", err);
    }
  };

  return { trackVisit };
};
