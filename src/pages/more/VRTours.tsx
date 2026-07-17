import { useState } from "react";
import { Compass, MapPin } from "lucide-react";
import MorePageShell from "@/components/MorePageShell";

const TOURS = [
  {
    id: "konark",
    name: "Konark Sun Temple",
    // Google Street View embed for the Konark temple area
    embed: "https://www.google.com/maps/embed?pb=!4v1700000000000!6m8!1m7!1sCAoSLEFGMVFpcE1jUE9wZlU2Sm1QVXNfWlV6NlNRVE1UalRvZXBzVmZUOGtCQ2Fx!2m2!1d19.8876!2d86.0942!3f0!4f0!5f0.7820865974627469",
    hint: "Walk around the chariot wheels and horses.",
  },
  {
    id: "jagannath",
    name: "Jagannath Temple approach, Puri",
    embed: "https://www.google.com/maps/embed?pb=!4v1700000000000!6m8!1m7!1sCAoSLEFGMVFpcE00cnZBd2N2QjhCZnR3aGRoMGdsUWNqTmVsN0FMbHo3TDJ5UjNH!2m2!1d19.8048!2d85.8181!3f0!4f0!5f0.7820865974627469",
    hint: "Look up at the towering shikhara.",
  },
  {
    id: "lingaraj",
    name: "Lingaraj Temple, Bhubaneswar",
    embed: "https://www.google.com/maps/embed?pb=!4v1700000000000!6m8!1m7!1sCAoSLEFGMVFpcE9tRTBGSFA3WWx6a09HcU1kV19TR1JMSHFmM2FaVnRFTUx4TzZq!2m2!1d20.2382!2d85.8347!3f0!4f0!5f0.7820865974627469",
    hint: "Kalinga architecture in its purest form.",
  },
];

const VRTours = () => {
  const [active, setActive] = useState(TOURS[0]);
  return (
    <MorePageShell
      title="360° VR Tours"
      subtitle="Pre-visit walk-throughs of Odisha's icons."
      icon={Compass}
      badge="Beta"
    >
      <div className="mx-auto max-w-5xl space-y-4">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-black shadow-[0_0_60px_-20px] shadow-primary/30">
          <iframe
            key={active.id}
            title={active.name}
            src={active.embed}
            width="100%"
            height="480"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            className="block w-full"
          />
        </div>
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" /> {active.name} — {active.hint}
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {TOURS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t)}
              className={`rounded-2xl border p-4 text-left transition ${
                active.id === t.id
                  ? "border-primary/50 bg-primary/10"
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              }`}
            >
              <div className="text-sm font-semibold">{t.name}</div>
              <div className="text-xs text-muted-foreground mt-1">{t.hint}</div>
            </button>
          ))}
        </div>
      </div>
    </MorePageShell>
  );
};

export default VRTours;
