import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Clock, Brain, RefreshCw, AlertTriangle, ArrowUp, ArrowDown } from "lucide-react";
import { useTrafficDensity, type IntersectionDensity } from "@/hooks/useTrafficDensity";

const getDensityColor = (d: number) => {
  if (d > 85) return "hsl(var(--destructive))";
  if (d > 65) return "hsl(var(--accent))";
  if (d > 40) return "hsl(var(--primary))";
  return "hsl(var(--success))";
};

const TrendIcon = ({ trend }: { trend: string }) => {
  if (trend === "increasing") return <TrendingUp className="w-3.5 h-3.5 text-destructive" />;
  if (trend === "decreasing") return <TrendingDown className="w-3.5 h-3.5 text-green-400" />;
  return <Minus className="w-3.5 h-3.5 text-muted-foreground" />;
};

const TrafficPrediction = () => {
  const { densities, summary, loading, error, lastUpdated, refresh } = useTrafficDensity(30000);

  if (loading && densities.length === 0) {
    return (
      <div className="bg-card/30 backdrop-blur-xl border border-primary/10 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-4 h-4 text-primary animate-pulse" />
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Loading Traffic Data...</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-24 rounded-lg bg-background/30 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error && densities.length === 0) {
    return (
      <div className="bg-card/30 backdrop-blur-xl border border-destructive/20 rounded-2xl p-5">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-destructive" />
          <p className="text-sm text-destructive">{error}</p>
          <button onClick={refresh} className="ml-auto text-xs text-primary hover:underline">Retry</button>
        </div>
      </div>
    );
  }

  // Sort by current density descending
  const sorted = [...densities].sort((a, b) => b.currentDensity - a.currentDensity);
  const topCongested = sorted.slice(0, 10);
  const risingZones = densities.filter(d => d.trend === "increasing").sort((a, b) => b.prediction30m - a.prediction30m);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-5"
    >
      {/* Summary Header */}
      <div className="bg-card/30 backdrop-blur-xl border border-primary/20 rounded-2xl p-5">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20 border border-primary/30">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                Real-Time Traffic Density — Bhubaneswar
              </h3>
              <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                Server-sourced • Updated every 30s • Time-aware predictions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {summary && (
              <>
                <span className={`px-3 py-1 rounded-lg text-[10px] font-bold border ${
                  summary.isPeakHour
                    ? "bg-destructive/20 border-destructive/40 text-destructive"
                    : "bg-primary/20 border-primary/40 text-primary"
                }`}>
                  {summary.isPeakHour ? "🔴 PEAK HOUR" : "🟢 OFF-PEAK"} • {summary.istTime}
                </span>
                <span className="px-3 py-1 rounded-lg text-[10px] font-bold bg-background/50 border border-border/50 text-muted-foreground font-mono">
                  {summary.dayType.toUpperCase()}
                </span>
              </>
            )}
            <button
              onClick={refresh}
              className="p-2 rounded-lg bg-background/50 border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* City-wide stats */}
        {summary && (
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-background/30 border border-border/30">
              <p className="text-[10px] text-muted-foreground uppercase">City Avg Density</p>
              <p className="text-2xl font-black font-mono" style={{ color: getDensityColor(summary.avgCityDensity) }}>
                {summary.avgCityDensity}%
              </p>
            </div>
            <div className="p-3 rounded-lg bg-background/30 border border-border/30">
              <p className="text-[10px] text-muted-foreground uppercase">Critical Zones</p>
              <p className="text-2xl font-black font-mono text-destructive">{summary.criticalZones}</p>
            </div>
            <div className="p-3 rounded-lg bg-background/30 border border-border/30">
              <p className="text-[10px] text-muted-foreground uppercase">High Traffic</p>
              <p className="text-2xl font-black font-mono" style={{ color: "hsl(var(--accent))" }}>{summary.highZones}</p>
            </div>
          </div>
        )}
      </div>

      {/* Top Congested + Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Most Congested Now */}
        <div className="bg-card/30 backdrop-blur-xl border border-primary/10 rounded-2xl p-5">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
            Top 10 Congested Zones — Now
          </h4>
          <div className="space-y-2">
            {topCongested.map((d, i) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-3 p-2.5 rounded-lg bg-background/30 border border-border/20 hover:border-primary/30 transition-all"
              >
                <span className="text-[10px] font-mono font-bold text-muted-foreground w-5">{i + 1}</span>
                <div className="w-3 h-3 rounded-full shrink-0" style={{
                  backgroundColor: getDensityColor(d.currentDensity),
                  boxShadow: `0 0 8px ${getDensityColor(d.currentDensity)}`,
                }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-foreground truncate">{d.name}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">~{d.currentSpeed} km/h</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black font-mono" style={{ color: getDensityColor(d.currentDensity) }}>
                    {d.currentDensity}%
                  </p>
                  <div className="flex items-center gap-1 justify-end">
                    <TrendIcon trend={d.trend} />
                    <span className="text-[9px] text-muted-foreground">{d.trend}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Prediction Panel */}
        <div className="bg-card/30 backdrop-blur-xl border border-primary/10 rounded-2xl p-5">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-primary" />
            Traffic Predictions — Next 90 min
          </h4>
          <div className="space-y-2">
            {topCongested.map((d, i) => (
              <div
                key={d.id}
                className="p-2.5 rounded-lg bg-background/30 border border-border/20"
              >
                <p className="text-[11px] font-semibold text-foreground truncate mb-1.5">{d.name}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-0.5">
                      <span>Now</span>
                      <span>+30m</span>
                      <span>+60m</span>
                      <span>+90m</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold font-mono" style={{ color: getDensityColor(d.currentDensity) }}>
                        {d.currentDensity}%
                      </span>
                      {d.prediction30m > d.currentDensity
                        ? <ArrowUp className="w-2.5 h-2.5 text-destructive" />
                        : <ArrowDown className="w-2.5 h-2.5 text-green-400" />}
                      <span className="text-xs font-bold font-mono" style={{ color: getDensityColor(d.prediction30m) }}>
                        {d.prediction30m}%
                      </span>
                      {d.prediction60m > d.prediction30m
                        ? <ArrowUp className="w-2.5 h-2.5 text-destructive" />
                        : <ArrowDown className="w-2.5 h-2.5 text-green-400" />}
                      <span className="text-xs font-bold font-mono" style={{ color: getDensityColor(d.prediction60m) }}>
                        {d.prediction60m}%
                      </span>
                      {d.prediction90m > d.prediction60m
                        ? <ArrowUp className="w-2.5 h-2.5 text-destructive" />
                        : <ArrowDown className="w-2.5 h-2.5 text-green-400" />}
                      <span className="text-xs font-bold font-mono" style={{ color: getDensityColor(d.prediction90m) }}>
                        {d.prediction90m}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {lastUpdated && (
            <p className="text-[9px] text-muted-foreground text-center mt-3 font-mono">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>

      {/* Rising Zones Alert */}
      {risingZones.length > 0 && (
        <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-4">
          <h4 className="text-xs font-bold text-destructive uppercase tracking-wider mb-2 flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5" />
            Rising Congestion Zones ({risingZones.length})
          </h4>
          <div className="flex gap-2 flex-wrap">
            {risingZones.slice(0, 8).map((d) => (
              <span
                key={d.id}
                className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-destructive/10 border border-destructive/30 text-destructive"
              >
                {d.name}: {d.currentDensity}% → {d.prediction30m}%
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TrafficPrediction;
