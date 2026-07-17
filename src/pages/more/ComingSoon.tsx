import { useParams } from "react-router-dom";
import { Clock } from "lucide-react";
import { MORE_FEATURES } from "@/data/moreFeatures";
import MorePageShell from "@/components/MorePageShell";

const COPY: Record<string, { what: string; when: string }> = {
  "offline-maps": {
    what: "Download entire regions of Odisha as compact vector tiles for zero-connectivity trips. Includes cached audio guides and monument metadata.",
    when: "Coming with the next PWA background-sync milestone.",
  },
  webxr: {
    what: "Preview your itinerary in mixed reality on Apple Vision Pro, Meta Quest, and WebXR-capable browsers. Walk your route to scale before you leave.",
    when: "Rolling out as WebXR gains wider device support.",
  },
  "nft-passport": {
    what: "Collect verifiable digital stamps for every heritage site you visit — a shareable, tamper-proof passport of your Odisha journey.",
    when: "Launching alongside the loyalty rewards program.",
  },
};

const ComingSoon = () => {
  const { id } = useParams<{ id: string }>();
  const feature = MORE_FEATURES.find((f) => f.id === id);
  const copy = (id && COPY[id]) || {
    what: "This experience is being crafted right now.",
    when: "Check back soon.",
  };

  return (
    <MorePageShell
      title={feature?.label ?? "Coming Soon"}
      subtitle={feature?.description}
      icon={feature?.icon}
      badge="Coming soon"
    >
      <div className="mx-auto max-w-2xl mt-6 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-8 backdrop-blur-xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/25">
          <Clock className="h-7 w-7" />
        </div>
        <h2 className="mt-6 text-xl font-semibold">What's coming</h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">{copy.what}</p>
        <div className="mt-6 inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-medium text-primary">
          {copy.when}
        </div>
      </div>
    </MorePageShell>
  );
};

export default ComingSoon;
