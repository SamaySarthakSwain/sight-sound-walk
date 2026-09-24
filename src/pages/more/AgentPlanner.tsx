import { useState } from "react";
import { getApiUrl } from "@/lib/apiConfig";
import { Bot, Loader2, Sparkles } from "lucide-react";
import MorePageShell from "@/components/MorePageShell";
import { useCity } from "@/contexts/CityContext";

const PRESETS = [
  "2 days in Bhubaneswar & Puri, temples + beach",
  "3 days heritage triangle avoiding rain",
  "1 day nature — Chilika dolphins + Mangalajodi",
  "Weekend food & artisan crawl in Cuttack",
];

const AgentPlanner = () => {
  const { selectedCity } = useCity();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<string>("");

  const run = async (p: string) => {
    if (!p.trim() || loading) return;
    setLoading(true);
    setItinerary("");
    try {
      const response = await fetch(getApiUrl("/api/ai/planner"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          query: p, 
          userPreferences: { city: selectedCity?.split(",")[0] || "Bhubaneswar" } 
        }),
      });
      
      if (!response.ok) throw new Error("Failed to reach planner");
      
      const data = await response.json();
      
      // Our backend returns a structured JSON Object. We format it nicely.
      const formatted = `### ${data.title}\n\n${data.description}\n\n**Budget:** ${data.budget}\n\n` + 
        data.days.map((d: any) => `#### Day ${d.day}: ${d.title}\n${d.activities.join("\n")}`).join("\n\n");
      
      setItinerary(formatted || "No itinerary returned.");
    } catch {
      setItinerary("Couldn't reach the planner just now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MorePageShell
      title="Agent Itinerary Planner"
      subtitle="A team of planning agents combining weather, routes, and fares."
      icon={Bot}
      badge="Beta"
    >
      <div className="mx-auto max-w-3xl space-y-5">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-5 backdrop-blur-xl">
          <label className="text-xs uppercase tracking-wider text-muted-foreground">What kind of trip?</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            placeholder="e.g. 3 days from Puri, heritage + beach, avoid crowds"
            className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p}
                onClick={() => { setPrompt(p); run(p); }}
                className="text-xs px-3 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition"
              >
                {p}
              </button>
            ))}
          </div>
          <button
            onClick={() => run(prompt)}
            disabled={loading || !prompt.trim()}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "Planning…" : "Plan my trip"}
          </button>
        </div>

        {itinerary && (
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-5 backdrop-blur-xl">
            <div className="whitespace-pre-wrap text-sm leading-relaxed">{itinerary}</div>
          </div>
        )}
      </div>
    </MorePageShell>
  );
};

export default AgentPlanner;
