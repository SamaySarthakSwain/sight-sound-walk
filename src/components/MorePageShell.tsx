import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import Navigation from "@/components/Navigation";
import MoreSubNav from "@/components/MoreSubNav";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface MorePageShellProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  badge?: "Beta" | "Live" | "Coming soon";
  children: React.ReactNode;
}

const badgeStyles: Record<NonNullable<MorePageShellProps["badge"]>, string> = {
  Live: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  Beta: "bg-primary/15 text-primary border-primary/30",
  "Coming soon": "bg-muted/40 text-muted-foreground border-border/60",
};

export const MorePageShell = ({
  title,
  subtitle,
  icon: Icon = Sparkles,
  badge = "Beta",
  children,
}: MorePageShellProps) => (
  <div className="min-h-screen bg-background text-foreground">
    <Navigation />
    <MoreSubNav />
    <main className="container mx-auto px-4 pt-36 pb-28">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="mb-6 flex items-center gap-3">
          <Link
            to="/more"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10 transition"
            aria-label="Back to More"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/25">
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">{title}</h1>
              <span
                className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-full border ${badgeStyles[badge]}`}
              >
                {badge}
              </span>
            </div>
            {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
          </div>
        </div>
        {children}
      </motion.div>
    </main>
  </div>
);

export default MorePageShell;
