import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export interface Achievement {
    id: string;
    title: string;
    description: string;
    badge_icon: string;
    category_requirement: string | null;
    count_requirement: number;
}

export interface UserAchievement {
    achievement_id: string;
    earned_at: string;
}

export const useAchievements = (user: User | null) => {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAchievements = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const { data: allAchievements } = await supabase
                    .from("achievements")
                    .select("*");

                const { data: earned } = await supabase
                    .from("user_achievements")
                    .select("achievement_id, earned_at")
                    .eq("user_id", user.id);

                setAchievements(allAchievements || []);
                setUserAchievements(earned || []);
            } catch (error) {
                console.error("Error fetching achievements:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAchievements();
    }, [user]);

    return { achievements, userAchievements, loading };
};
