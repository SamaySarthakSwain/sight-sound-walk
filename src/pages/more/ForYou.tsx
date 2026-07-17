import { Heart, Sparkles } from "lucide-react";
import MorePageShell from "@/components/MorePageShell";
import { Link } from "react-router-dom";

const PICKS = [
  { name: "Konark Sun Temple", tag: "Because you viewed heritage sites", to: "/explore" },
  { name: "Chilika Lake Dolphins", tag: "Popular with travelers like you", to: "/explore" },
  { name: "Pattachitra Village, Raghurajpur", tag: "Matches your artisan interest", to: "/more/artisan-trail" },
  { name: "Rasagola Trail, Salepur", tag: "Trending food this week", to: "/food" },
];

const ForYou = () => (
  <MorePageShell title="For You" subtitle="Personalized picks based on your recent activity." icon={Heart} badge="Beta">
    <div className="mx-auto max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-4">
      {PICKS.map((p) => (
        <Link key={p.name} to={p.to} className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-5 hover:border-primary/40 hover:from-primary/[0.08] transition">
          <div className="flex items-center gap-2 text-xs text-primary"><Sparkles className="h-3.5 w-3.5" /> {p.tag}</div>
          <div className="mt-2 text-lg font-semibold">{p.name}</div>
        </Link>
      ))}
    </div>
  </MorePageShell>
);

export default ForYou;
