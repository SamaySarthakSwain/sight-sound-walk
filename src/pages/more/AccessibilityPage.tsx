import { useEffect, useState } from "react";
import { Accessibility as AccessibilityIcon, Contrast, Volume2, Accessibility as Wheel } from "lucide-react";
import MorePageShell from "@/components/MorePageShell";

const AccessibilityPage = () => {
  const [highContrast, setHighContrast] = useState(() => localStorage.getItem("a11y-contrast") === "1");
  const [narrator, setNarrator] = useState(() => localStorage.getItem("a11y-narrator") === "1");
  const [wheelchair, setWheelchair] = useState(() => localStorage.getItem("a11y-wheelchair") === "1");

  useEffect(() => {
    document.documentElement.classList.toggle("a11y-high-contrast", highContrast);
    localStorage.setItem("a11y-contrast", highContrast ? "1" : "0");
  }, [highContrast]);
  useEffect(() => { localStorage.setItem("a11y-narrator", narrator ? "1" : "0"); }, [narrator]);
  useEffect(() => { localStorage.setItem("a11y-wheelchair", wheelchair ? "1" : "0"); }, [wheelchair]);

  const Toggle = ({ on, onChange, label, desc, Icon }: { on: boolean; onChange: (v: boolean) => void; label: string; desc: string; Icon: typeof Contrast }) => (
    <button
      onClick={() => onChange(!on)}
      className="w-full text-left rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 p-4 flex items-center gap-4 transition"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/25">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <div className="text-sm font-semibold">{label}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
      </div>
      <div className={`relative h-6 w-11 rounded-full transition ${on ? "bg-primary" : "bg-white/10"}`}>
        <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${on ? "left-5" : "left-0.5"}`} />
      </div>
    </button>
  );

  return (
    <MorePageShell title="Accessibility AI" subtitle="Make Lets Explore work for every traveler." icon={AccessibilityIcon} badge="Beta">
      <div className="mx-auto max-w-2xl space-y-3">
        <Toggle on={highContrast} onChange={setHighContrast} label="High contrast mode" desc="Increases contrast across the app." Icon={Contrast} />
        <Toggle on={narrator} onChange={setNarrator} label="Voice narrator" desc="Auto-narrate monument summaries with ElevenLabs." Icon={Volume2} />
        <Toggle on={wheelchair} onChange={setWheelchair} label="Wheelchair-friendly routes" desc="Filter itineraries to accessible paths only." Icon={Wheel} />
        <p className="text-xs text-muted-foreground pt-2">Sign-language avatar and live audio description are on the roadmap.</p>
      </div>
    </MorePageShell>
  );
};

export default AccessibilityPage;
