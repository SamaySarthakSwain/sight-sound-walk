import { useState, useEffect } from "react";
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

// Hardcoded achievements since the table doesn't exist yet
const defaultAchievements: Achievement[] = [
  { id: "1", title: "First Steps", description: "Visit your first monument", badge_icon: "MapPin", category_requirement: null, count_requirement: 1 },
  { id: "2", title: "Explorer", description: "Visit 5 monuments", badge_icon: "Map", category_requirement: null, count_requirement: 5 },
  { id: "3", title: "Temple Devotee", description: "Visit 3 temples", badge_icon: "Landmark", category_requirement: "temple", count_requirement: 3 },
  { id: "4", title: "History Buff", description: "Visit 10 monuments", badge_icon: "Trophy", category_requirement: null, count_requirement: 10 },
];

export const useAchievements = (user: User | null) => {
    const [achievements] = useState<Achievement[]>(defaultAchievements);
    const [userAchievements] = useState<UserAchievement[]>([]);
    const [loading] = useState(false);

    return { achievements, userAchievements, loading };
};
