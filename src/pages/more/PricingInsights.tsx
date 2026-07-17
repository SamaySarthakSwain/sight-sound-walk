import { TrendingUp, TrendingDown } from "lucide-react";
import MorePageShell from "@/components/MorePageShell";

const ROWS = [
  { label: "Cab: Bhubaneswar → Puri", value: "₹1,850", trend: "down", note: "5% below weekly average" },
  { label: "Hotel: Puri beachfront (3★)", value: "₹3,200 / night", trend: "up", note: "Rath Yatra demand rising" },
  { label: "Cab: Airport → Konark", value: "₹2,400", trend: "down", note: "Off-peak weekday" },
  { label: "Hotel: Bhubaneswar city (4★)", value: "₹4,100 / night", trend: "up", note: "Conference week" },
];

const PricingInsights = () => (
  <MorePageShell title="Pricing Insights" subtitle="Fare and demand trends across cabs, hotels, and festival dates." icon={TrendingUp} badge="Beta">
    <div className="mx-auto max-w-2xl space-y-3">
      {ROWS.map((r) => {
        const Icon = r.trend === "up" ? TrendingUp : TrendingDown;
        const color = r.trend === "up" ? "text-rose-400" : "text-emerald-400";
        return (
          <div key={r.label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
            <div>
              <div className="text-sm font-semibold">{r.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{r.note}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold">{r.value}</span>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
          </div>
        );
      })}
      <p className="text-xs text-muted-foreground text-center pt-2">Live pricing models are being trained on recent trip data.</p>
    </div>
  </MorePageShell>
);

export default PricingInsights;
