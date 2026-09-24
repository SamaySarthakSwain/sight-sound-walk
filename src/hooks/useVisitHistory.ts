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
      const response = await fetch("http://localhost:5000/api/visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id || user.email, // using email as ID if google_id isn't in frontend state easily
          place_name: visitData.place_name,
          place_category: visitData.place_category,
          place_image: visitData.place_image,
        }),
      });

      if (!response.ok) {
        console.error("Error tracking visit: Server responded with", response.status);
        return;
      }

      toast.success(`Visited: ${visitData.place_name}`, { duration: 2000 });
    } catch (err) {
      console.error("Error in visit tracking:", err);
    }
  };

  return { trackVisit };
};
