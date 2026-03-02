import React, { useEffect } from "react";
import { toast } from "sonner";
import { Landmark } from "lucide-react";
import { useMonuments } from "@/hooks/useMonuments";
import { useGeofencing } from "@/hooks/useGeofencing";
import { useVisitHistory } from "@/hooks/useVisitHistory";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const ProactiveNudgeTrigger = () => {
    const { user } = useAuth();
    // Only load monuments + geofencing if user is logged in
    const { monuments } = useMonuments();
    const { nearbyMonument } = useGeofencing(monuments || [], { enabled: !!user });
    const { trackVisit } = useVisitHistory();
    const navigate = useNavigate();

    useEffect(() => {
        if (!nearbyMonument || !user) return;

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
                onClick: () => navigate("/assistant", { state: { proactiveMonument: nearbyMonument } }),
            },
            duration: 8000,
        });
    }, [nearbyMonument, user]);

    return null;
};

export default React.memo(ProactiveNudgeTrigger);
