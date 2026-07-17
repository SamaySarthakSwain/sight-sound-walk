import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Navigation from "@/components/Navigation";
import { MORE_FEATURES, CATEGORY_LABELS, type MoreFeature } from "@/data/moreFeatures";

const statusStyles: Record<MoreFeature["status"], string> = {
  live: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  beta: "bg-primary/15 text-primary border-primary/30",
  soon: "bg-muted/40 text-muted-foreground border-border/60",
};

const statusLabel: Record<MoreFeature["status"], string> = {
  live: "Live",
  beta: "Beta",
  soon: "Coming soon",
};

const FeatureCard = ({ feature, index }: { feature: MoreFeature; index: number }) => {
  const Icon = feature.icon;
  const isSoon = feature.status === "soon";
  const className = `group relative block h-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-5 backdrop-blur-xl transition-all ${
    isSoon
      ? "cursor-default opacity-70"
      : "hover:border-primary/40 hover:from-primary/[0.08] hover:shadow-[0_0_40px_-10px] hover:shadow-primary/40 hover:-translate-y-0.5"
  }`;
  const inner = (
    <>
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/25">
          <Icon className="h-5 w-5" />
        </div>
        <span
          className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-full border ${statusStyles[feature.status]}`}
        >
          {statusLabel[feature.status]}
        </span>
      </div>
      <h3 className="mt-4 text-base font-semibold text-foreground">{feature.label}</h3>
      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
    </>
  );
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.4), duration: 0.35, ease: "easeOut" }}
    >
      {isSoon ? (
        <div className={className}>{inner}</div>
      ) : (
        <Link to={feature.path} className={className}>{inner}</Link>
      )}
    </motion.div>
  );
};

const MoreHub = () => {
  const grouped = (Object.keys(CATEGORY_LABELS) as (keyof typeof CATEGORY_LABELS)[]).map(
    (cat) => ({
      key: cat,
      label: CATEGORY_LABELS[cat],
      items: MORE_FEATURES.filter((f) => f.category === cat),
    }),
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-28 md:pt-28">
        <div className="mb-8 flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10 transition"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">More Experiences</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Advanced tools built for exploring Odisha — AI guides, immersive tours, on-device intelligence.
            </p>
          </div>
        </div>

        <div className="space-y-10">
          {grouped.map((group) => (
            <section key={group.key}>
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {group.label}
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((feature, i) => (
                  <FeatureCard key={feature.id} feature={feature} index={i} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MoreHub;
