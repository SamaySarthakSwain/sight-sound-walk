import { useEffect } from "react";
import { toast } from "sonner";
import { Landmark } from "lucide-react";
import { useMonuments } from "@/hooks/useMonuments";
import { useGeofencing } from "@/hooks/useGeofencing";
import { useVisitHistory } from "@/hooks/useVisitHistory";
import { useAuth } from "@/hooks/useAuth";

const ProactiveNudgeTrigger = () => {
    const { data: monuments } = useMonuments();
    const { nearbyMonument } = useGeofencing(monuments || []);
    const { trackVisit } = useVisitHistory();
    const { user } = useAuth();

    useEffect(() => {
        if (nearbyMonument && user) {
            console.log("📍 Nearby monument detected, recording visit:", nearbyMonument.title);

            // Track the visit for gamification
            trackVisit({
                place_name: nearbyMonument.title,
                place_category: nearbyMonument.category,
                place_image: nearbyMonument.image_url,
            });

            toast.info(`You're near ${nearbyMonument.title}!`, {
                description: "Tap the AI Guide to hear a quick story.",
                icon: <Landmark className="w-4 h-4 text-primary" />,
                action: {
                    label: "Listen",
                    onClick: () => {
                        // Navigation or triggering voice interaction would happen here
                        window.location.href = "/assistant";
                    },
                },
                duration: 8000,
            });
        }
    }, [nearbyMonument, user, trackVisit]);

    return null;
};

export default ProactiveNudgeTrigger;
