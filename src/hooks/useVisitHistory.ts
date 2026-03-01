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
      // 1. Record the visit
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

      // 2. Fetch all user visits to calculate stats
      const { data: visits, error: fetchError } = await supabase
        .from("visit_history")
        .select("place_name, place_category")
        .eq("user_id", user.id);

      if (fetchError || !visits) return;

      // Calculate unique visits
      const uniquePlaces = new Set(visits.map(v => v.place_name));
      const totalVisits = uniquePlaces.size;

      // Calculate category counts based on unique places to avoid farming
      const categoryCounts: Record<string, number> = {};
      const uniqueCategoryVisits = new Map<string, string>(); // place_name -> category

      visits.forEach(v => {
        // use lower case category if present to match requirements safely
        const cat = v.place_category?.toLowerCase();
        if (cat && !uniqueCategoryVisits.has(v.place_name)) {
          uniqueCategoryVisits.set(v.place_name, cat);
        }
      });

      uniqueCategoryVisits.forEach((category) => {
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });

      // 3. Fetch all achievements
      const { data: allAchievements } = await supabase
        .from("achievements")
        .select("*");

      // 4. Fetch user's existing achievements
      const { data: earnedAchievements } = await supabase
        .from("user_achievements")
        .select("achievement_id")
        .eq("user_id", user.id);

      if (!allAchievements || !earnedAchievements) return;

      const earnedIds = new Set(earnedAchievements.map(ea => ea.achievement_id));

      // 5. Check for newly unlocked achievements
      for (const achievement of allAchievements) {
        if (earnedIds.has(achievement.id)) continue;

        let isUnlocked = false;

        if (achievement.category_requirement) {
          // Check category specific count
          const reqCat = achievement.category_requirement.toLowerCase();
          const count = categoryCounts[reqCat] || 0;
          if (count >= achievement.count_requirement) {
            isUnlocked = true;
          }
        } else {
          // Check total visits count (fallback or general requirement)
          // Skip if it's explicitly for something else like voice vlogs ('Mic' badge)
          if (achievement.badge_icon !== "Mic" && totalVisits >= achievement.count_requirement) {
            isUnlocked = true;
          }
        }

        if (isUnlocked) {
          // Grant achievement
          const { error: grantError } = await supabase
            .from("user_achievements")
            .insert({
              user_id: user.id,
              achievement_id: achievement.id,
            });

          if (!grantError) {
            // Show toast
            toast("Achievement Unlocked!", {
              description: achievement.title,
              icon: "🏆",
              duration: 5000,
            });
            console.log(`Unlocked: ${achievement.title}`);
          }
        }
      }

    } catch (err) {
      console.error("Error in Badge Engine:", err);
    }
  };

  return { trackVisit };
};
