import Navigation from "@/components/Navigation";
import { useState } from "react";
import { MapPin, ExternalLink, Palette, Shirt, Gem, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ArtisanVillage {
  id: string;
  name: string;
  location: string;
  lat: number; lng: number;
  craft: string;
  craftHindi: string;
  description: string;
  history: string;
  emoji: string;
  Icon: React.ElementType;
  color: string;
  accentColor: string;
  tags: string[];
  mapUrl: string;
  bestFor: string;
}

const VILLAGES: ArtisanVillage[] = [
  {
    id: "raghurajpur", name: "Raghurajpur Heritage Village", location: "Puri District, Odisha",
    lat: 19.9285, lng: 85.8312, craft: "Pattachitra Paintings", craftHindi: "Pattachitra",
    description: "The entire village of ~130 families are hereditary artists — every wall, every door is a canvas. UNESCO-recognized, it is India's only living heritage artist village.",
    history: "Dating back 5,000 years, Pattachitra (from Sanskrit: patta = cloth, chitra = picture) depicts scenes from Mahabharata and Ramayana using natural pigments made from conch shells, stone, and lampblack.",
    emoji: "🎨", Icon: Palette, color: "from-orange-500/20 to-rose-500/20", accentColor: "text-orange-400",
    tags: ["UNESCO", "5000 Years Old", "Gotipua Dance", "Palm Leaf Etching"],
    mapUrl: "https://maps.google.com/?q=Raghurajpur,Puri,Odisha",
    bestFor: "Pattachitra scrolls, palm leaf engravings, Gotipua dance performances",
  },
  {
    id: "pipili", name: "Pipili Applique Village", location: "Puri–Bhubaneswar Highway, Odisha",
    lat: 20.1661, lng: 85.5776, craft: "Chandua Applique Work", craftHindi: "Chandua",
    description: "Neon-bright fabric cutwork canopies, parasols, and garden umbrellas adorn every shop on Pipili's mile-long market street. The craft originated as temple decorations for Lord Jagannath.",
    history: "Chandua applique evolved over 700 years to create the iconic rath canopies for the Puri Rath Yatra chariot procession. Motifs include fish, elephants, peacocks, and lotus flowers.",
    emoji: "🪡", Icon: Scissors, color: "from-pink-500/20 to-violet-500/20", accentColor: "text-pink-400",
    tags: ["Rath Yatra Craft", "Temple Art", "Vibrant Colors", "700+ Years"],
    mapUrl: "https://maps.google.com/?q=Pipili,Odisha",
    bestFor: "Decorative canopies, wall hangings, lamp shades, garden umbrellas",
  },
  {
    id: "cuttack", name: "Cuttack Silver Filigree", location: "Cuttack City, Odisha",
    lat: 20.4625, lng: 85.8828, craft: "Tarakasi Silver Filigree", craftHindi: "Tarakasi",
    description: "Cuttack's artisans craft breathtaking jewelry from ultra-fine silver wires thinner than human hair, creating lacework of astonishing intricacy — necklaces, temple deities, and miniature monuments.",
    history: "Tarakasi (tara = wire, kasi = art) has been practiced in Cuttack for over 500 years. Recognized with a GI tag, each piece takes weeks to create using silver wire drawn to 0.02mm diameter.",
    emoji: "💎", Icon: Gem, color: "from-slate-400/20 to-blue-500/20", accentColor: "text-blue-300",
    tags: ["GI Tagged", "Silver Wire Art", "500+ Years", "Durga Puja Ornaments"],
    mapUrl: "https://maps.google.com/?q=Tarakasi,Cuttack,Odisha",
    bestFor: "Silver jewelry, Durga Puja ornaments, miniature temple replicas",
  },
  {
    id: "sambalpur", name: "Maniabandha & Sambalpur", location: "Sambalpur, Western Odisha",
    lat: 21.4669, lng: 83.9812, craft: "Sambalpuri Ikat Weaving", craftHindi: "Bandha",
    description: "Traditional Ikat (bandha) tie-dye weaving produces Odisha's most celebrated textile — sarees where designs emerge from the loom as pre-dyed threads align in geometric precision.",
    history: "Sambalpuri weaving dates to the medieval Chauhan dynasty. Each saree can take 3–6 months to create. The iconic 'fish', 'temple', and 'shankha-chakra' motifs are protected by GI certificate.",
    emoji: "🧵", Icon: Shirt, color: "from-red-500/20 to-amber-500/20", accentColor: "text-amber-400",
    tags: ["GI Tagged", "Ikat Weaving", "Medieval Era", "Silk & Cotton"],
    mapUrl: "https://maps.google.com/?q=Maniabandha,Sambalpur,Odisha",
    bestFor: "Sambalpuri sarees, Ikat fabric, traditional shawls and dupattas",
  },
];

const ArtisanTrail = () => {
  const [selected, setSelected] = useState<ArtisanVillage | null>(VILLAGES[0]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <div className="relative pt-20 pb-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/8 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 pt-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-sm text-amber-400 mb-6 font-medium">
            <MapPin className="w-4 h-4" /> Artisan & Handloom Heritage Trail
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">Discover Living</span>
            <br /><span className="text-foreground/90">Heritage Crafts</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base leading-relaxed">
            Go beyond monuments. Explore the living heritage villages of Odisha where master artisans practice millennia-old crafts passed down through generations. Each purchase directly supports these families.
          </p>
        </div>
      </div>

      {/* Main layout */}
      <div className="container mx-auto px-4 pb-20">
        <div className="grid lg:grid-cols-5 gap-6">

          {/* Village selector list */}
          <div className="lg:col-span-2 space-y-3">
            {VILLAGES.map(village => (
              <button key={village.id} id={`village-${village.id}`}
                onClick={() => setSelected(village)}
                onMouseEnter={() => setHoveredId(village.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`w-full text-left glass-card rounded-2xl p-4 transition-all duration-300 glow-card ${selected?.id === village.id ? "border-primary/30 bg-primary/5" : "border-white/5"}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl bg-gradient-to-br ${village.color} shrink-0`}>
                    {village.emoji}
                  </div>
                  <div className="min-w-0">
                    <h3 className={`font-bold text-sm leading-tight ${selected?.id === village.id ? "text-primary" : ""}`}>{village.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 shrink-0" />{village.location}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {village.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 bg-white/5 rounded-full text-muted-foreground">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-3">
            {selected && (
              <div className="glass-card rounded-3xl overflow-hidden">
                {/* Top banner */}
                <div className={`h-24 bg-gradient-to-br ${selected.color} flex items-center justify-center relative`}>
                  <div className="text-6xl">{selected.emoji}</div>
                  <div className="absolute top-4 right-4 flex gap-1">
                    {selected.tags.map(tag => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 bg-black/30 rounded-full text-white/80">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-bold">{selected.name}</h2>
                        <p className={`text-sm font-semibold ${selected.accentColor} mt-0.5`}>{selected.craft}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />{selected.location}
                        </p>
                      </div>
                      <a href={selected.mapUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="gap-1.5 shrink-0 glass-panel border-white/10">
                          <ExternalLink className="w-3.5 h-3.5" /> Directions
                        </Button>
                      </a>
                    </div>
                  </div>

                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed text-sm">{selected.description}</p>
                  </div>

                  {/* History */}
                  <div className="glass-panel rounded-xl p-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Historical Context</h4>
                    <p className="text-sm text-foreground/80 leading-relaxed">{selected.history}</p>
                  </div>

                  {/* Best for */}
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">Best Purchases</h4>
                    <p className="text-sm text-foreground/80">{selected.bestFor}</p>
                  </div>

                  {/* Map embed placeholder */}
                  <div className="bg-white/5 rounded-xl p-4 flex items-center justify-center h-32 border border-white/10">
                    <div className="text-center">
                      <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">
                        Lat: {selected.lat}°N · Lng: {selected.lng}°E
                      </p>
                      <a href={selected.mapUrl} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline mt-1 inline-block">
                        Open in Google Maps →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Trail route */}
        <div className="mt-10 glass-panel rounded-2xl p-6 max-w-3xl mx-auto">
          <h3 className="font-bold text-center mb-4">🗺️ Suggested 3-Day Artisan Trail Route</h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm">
            {["Bhubaneswar", "→ Pipili (45 min)", "→ Raghurajpur (30 min)", "→ Puri (20 min)", "→ Cuttack (2h)", "→ Sambalpur (3h)"].map((step, i) => (
              <span key={i} className={i === 0 ? "font-bold text-primary" : i % 2 === 0 ? "text-muted-foreground text-xs" : "text-foreground/80"}>
                {step}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtisanTrail;
