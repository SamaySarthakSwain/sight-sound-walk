import Navigation from "@/components/Navigation";
import MoreSubNav from "@/components/MoreSubNav";
import { useState } from "react";
import { MapPin, ExternalLink, Palette, Shirt, Gem, Scissors, Sparkles, Calendar, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ArtisanVillage {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
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
  products: { name: string; price: string; imageDesc: string }[];
}

const VILLAGES: ArtisanVillage[] = [
  {
    id: "raghurajpur",
    name: "Raghurajpur Heritage Village",
    location: "Puri District, Odisha",
    lat: 19.9285,
    lng: 85.8312,
    craft: "Pattachitra Paintings",
    craftHindi: "Pattachitra",
    description: "The entire village of ~130 families are hereditary artists — every wall, every door is a canvas. UNESCO-recognized, it is India's only living heritage artist village, keeping 5,000-year-old scroll painting traditions alive.",
    history: "Dating back 5,000 years, Pattachitra (from Sanskrit: patta = cloth, chitra = picture) depicts scenes from Mahabharata and Ramayana using natural pigments made from conch shells, stone, and lampblack.",
    emoji: "🎨",
    Icon: Palette,
    color: "from-orange-500/20 to-rose-500/20",
    accentColor: "text-orange-400",
    tags: ["UNESCO", "5000 Years Old", "Gotipua Dance", "Palm Leaf Etching"],
    mapUrl: "https://maps.google.com/?q=Raghurajpur,Puri,Odisha",
    bestFor: "Pattachitra scrolls, palm leaf engravings, Gotipua dance performances",
    products: [
      { name: "Traditional Palm Leaf Engraving (Tala Pata Chitra)", price: "₹2,500+", imageDesc: "Intricate etching on dried palm leaves showing Lord Jagannath" },
      { name: "Sanskrit Shloka Pattachitra Cloth Scroll", price: "₹4,000+", imageDesc: "Hand-painted cloth canvas using natural stone mineral colors" },
      { name: "Hand-painted Wooden Heritage Toy Set", price: "₹800+", imageDesc: "Vibrant wooden toys representing regional folk characters" },
    ],
  },
  {
    id: "pipili",
    name: "Pipili Applique Village",
    location: "Puri–Bhubaneswar Highway, Odisha",
    lat: 20.1661,
    lng: 85.5776,
    craft: "Chandua Applique Work",
    craftHindi: "Chandua",
    description: "Neon-bright fabric cutwork canopies, parasols, and garden umbrellas adorn every shop on Pipili's mile-long market street. The craft originated as sacred temple decorations for Lord Jagannath.",
    history: "Chandua applique evolved over 700 years to create the iconic rath canopies for the Puri Rath Yatra chariot procession. Motifs include fish, elephants, peacocks, and lotus flowers.",
    emoji: "🪡",
    Icon: Scissors,
    color: "from-pink-500/20 to-violet-500/20",
    accentColor: "text-pink-400",
    tags: ["Rath Yatra Craft", "Temple Art", "Vibrant Colors", "700+ Years"],
    mapUrl: "https://maps.google.com/?q=Pipili,Odisha",
    bestFor: "Decorative canopies, wall hangings, lamp shades, garden umbrellas",
    products: [
      { name: "Vibrant Chandua Wall Hanging", price: "₹1,200+", imageDesc: "Stitched patchwork depicting sun motifs and temple arches" },
      { name: "Embroidered Garden Umbrella", price: "₹2,200+", imageDesc: "Large multi-colored canvas parasol with mirrorwork inserts" },
      { name: "Handcrafted Applique Tote Bag", price: "₹450+", imageDesc: "Sturdy cotton bag with geometric borders and elephant patterns" },
    ],
  },
  {
    id: "cuttack",
    name: "Cuttack Silver Filigree",
    location: "Cuttack City, Odisha",
    lat: 20.4625,
    lng: 85.8828,
    craft: "Tarakasi Silver Filigree",
    craftHindi: "Tarakasi",
    description: "Cuttack's artisans craft breathtaking jewelry from ultra-fine silver wires thinner than human hair, creating lacework of astonishing intricacy — necklaces, temple deities, and miniature monuments.",
    history: "Tarakasi (tara = wire, kasi = art) has been practiced in Cuttack for over 500 years. Recognized with a GI tag, each piece takes weeks to create using silver wire drawn to 0.02mm diameter.",
    emoji: "💎",
    Icon: Gem,
    color: "from-slate-400/20 to-blue-500/20",
    accentColor: "text-blue-300",
    tags: ["GI Tagged", "Silver Wire Art", "500+ Years", "Durga Puja Ornaments"],
    mapUrl: "https://maps.google.com/?q=Tarakasi,Cuttack,Odisha",
    bestFor: "Silver jewelry, Durga Puja ornaments, miniature temple replicas",
    products: [
      { name: "Tarakasi Peacock Filigree Brooch", price: "₹1,800+", imageDesc: "Pure sterling silver filigree pin shaped as a peacock" },
      { name: "Intricate Silver Lace Necklace", price: "₹5,500+", imageDesc: "A delicate web of hand-welded 92.5 silver wirework" },
      { name: "Miniature Konark Wheel Model", price: "₹3,500+", imageDesc: "Tiny replica of the famous temple wheel in filigree" },
    ],
  },
  {
    id: "sambalpur",
    name: "Maniabandha & Sambalpur",
    location: "Sambalpur, Western Odisha",
    lat: 21.4669,
    lng: 83.9812,
    craft: "Sambalpuri Ikat Weaving",
    craftHindi: "Bandha",
    description: "Traditional Ikat (bandha) tie-dye weaving produces Odisha's most celebrated textile — sarees where designs emerge from the loom as pre-dyed threads align in geometric precision.",
    history: "Sambalpuri weaving dates to the medieval Chauhan dynasty. Each saree can take 3–6 months to create. The iconic 'fish', 'temple', and 'shankha-chakra' motifs are protected by GI certificate.",
    emoji: "🧵",
    Icon: Shirt,
    color: "from-red-500/20 to-amber-500/20",
    accentColor: "text-amber-400",
    tags: ["GI Tagged", "Ikat Weaving", "Medieval Era", "Silk & Cotton"],
    mapUrl: "https://maps.google.com/?q=Maniabandha,Sambalpur,Odisha",
    bestFor: "Sambalpuri sarees, Ikat fabric, traditional shawls and dupattas",
    products: [
      { name: "Pure Silk Sambalpuri Ikat Saree", price: "₹8,500 - ₹25,000", imageDesc: "Double ikat silk saree featuring classic temple borders" },
      { name: "Maniabandha Cotton Dress Material", price: "₹1,500+", imageDesc: "Breathable ikat cotton fabric in geometric earth tones" },
      { name: "Traditional Handwoven Ikat Stole", price: "₹950+", imageDesc: "Lightweight cotton dupatta with fish and shell motifs" },
    ],
  },
];

const ITINERARY = [
  {
    day: "Day 1: Bhubaneswar to Pipili",
    highlights: "Embark from temple city. Visit the colorful applique highway of Pipili. Shop for Chandua craft lights and umbrellas.",
    travelTime: "45 mins drive",
    villageId: "pipili",
  },
  {
    day: "Day 2: Raghurajpur & Puri Coast",
    highlights: "Explore Raghurajpur. Meet master painters at their porches. Watch palm leaf etching and a live Gotipua dance performance.",
    travelTime: "30 mins drive from Pipili",
    villageId: "raghurajpur",
  },
  {
    day: "Day 3: Cuttack & Maniabandha Loops",
    highlights: "Travel to Cuttack to witness the mesmerizing silver filigree workshops. Extend your trip to Western Odisha weavers.",
    travelTime: "2 hours drive from Puri",
    villageId: "cuttack",
  },
];

const ArtisanTrail = () => {
  const [selected, setSelected] = useState<ArtisanVillage | null>(VILLAGES[0]);
  const [activeTab, setActiveTab] = useState<"details" | "products">("details");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative">
      {/* Beautiful Artisan Trail Background */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600100397608-f010f41bc7f5?auto=format&fit=crop&q=80&w=2070')" }}
      />
      {/* Gradient Overlay for Readability */}
      <div className="fixed inset-0 z-0 bg-white/85 dark:bg-[#0d0905]/90 backdrop-blur-[2px] transition-all duration-700" />
      
      <div className="relative z-10 pb-20">
      <Navigation />
      <MoreSubNav />

      {/* Hero */}
      <div className="relative pt-36 pb-8 overflow-hidden">
        <div className="absolute inset-0 bg-radial-at-t from-transparent dark:from-[#c49a5e]/10 via-transparent dark:via-[#0d0905]/50 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 pt-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-sm text-amber-600 dark:text-amber-400 mb-6 font-medium">
            <Palette className="w-4 h-4" /> Sustainable Craft Trails
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-amber-600 to-orange-500 dark:from-amber-200 dark:via-orange-400 dark:to-rose-400 bg-clip-text text-transparent">Artisan & Handloom Trails</span>
            <br /><span className="text-foreground/90 text-3xl md:text-4xl font-light">Supporting Living Heritage Villages</span>
          </h1>
          <p className="text-foreground/70 dark:text-amber-100/60 max-w-2xl mx-auto text-base leading-relaxed font-light">
            Odisha's cultural identity is deeply woven into its villages. Discover local art colonies, locate authentic family workshops, and buy directly from master craftsmen.
          </p>
        </div>
      </div>

      {/* Main layout */}
      <div className="container mx-auto px-4 mt-6">
        <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
          
          {/* Left panel: Interactive Route & Villages list */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/70 dark:bg-black/40 border border-border/50 dark:border-[#c49a5e]/15 rounded-3xl p-5 backdrop-blur-md shadow-xl dark:shadow-none">
              <h3 className="text-sm font-bold text-amber-700 dark:text-amber-400/80 uppercase tracking-wider mb-4 flex items-center gap-2">
                🗺️ Interactive Trail Route
              </h3>
              
              {/* Visual SVG Map Connecting points */}
              <div className="relative h-44 bg-black/5 dark:bg-black/50 border border-black/10 dark:border-white/5 rounded-2xl p-4 flex items-center justify-center overflow-hidden mb-5">
                <svg viewBox="0 0 300 150" className="w-full h-full opacity-90">
                  {/* Dotted route lines */}
                  <path d="M 50 110 L 110 90 L 190 70 L 250 50" fill="none" stroke="#c49a5e" strokeWidth="2" strokeDasharray="5 5" className="animate-[dash_4s_linear_infinite]" />
                  <path d="M 110 90 L 140 120" fill="none" stroke="#c49a5e" strokeWidth="2" strokeDasharray="5 5" />
                  
                  {/* Bhubaneswar Start */}
                  <circle cx="50" cy="110" r="5" fill="#f59e0b" />
                  <text x="50" y="125" textAnchor="middle" fontSize="8" fill="currentColor" className="text-foreground dark:text-[#f7efe6]" fontWeight="bold">Bhubaneswar</text>

                  {/* Pipili Node */}
                  <g className="cursor-pointer" onClick={() => setSelected(VILLAGES[1])}>
                    <circle cx="110" cy="90" r="7" fill={selected?.id === "pipili" ? "#ec4899" : "#c49a5e"} className="transition-all duration-300" />
                    <text x="110" y="80" textAnchor="middle" fontSize="8" fill={selected?.id === "pipili" ? "#ec4899" : "currentColor"} className={selected?.id === "pipili" ? "" : "text-foreground dark:text-[#f7efe6]"}>Pipili</text>
                  </g>

                  {/* Raghurajpur Node */}
                  <g className="cursor-pointer" onClick={() => setSelected(VILLAGES[0])}>
                    <circle cx="140" cy="120" r="7" fill={selected?.id === "raghurajpur" ? "#f97316" : "#c49a5e"} className="transition-all duration-300" />
                    <text x="140" y="135" textAnchor="middle" fontSize="8" fill={selected?.id === "raghurajpur" ? "#f97316" : "currentColor"} className={selected?.id === "raghurajpur" ? "" : "text-foreground dark:text-[#f7efe6]"}>Raghurajpur</text>
                  </g>

                  {/* Cuttack Node */}
                  <g className="cursor-pointer" onClick={() => setSelected(VILLAGES[2])}>
                    <circle cx="190" cy="70" r="7" fill={selected?.id === "cuttack" ? "#3b82f6" : "#c49a5e"} className="transition-all duration-300" />
                    <text x="190" y="60" textAnchor="middle" fontSize="8" fill={selected?.id === "cuttack" ? "#3b82f6" : "currentColor"} className={selected?.id === "cuttack" ? "" : "text-foreground dark:text-[#f7efe6]"}>Cuttack</text>
                  </g>

                  {/* Sambalpur Node */}
                  <g className="cursor-pointer" onClick={() => setSelected(VILLAGES[3])}>
                    <circle cx="250" cy="50" r="7" fill={selected?.id === "sambalpur" ? "#eab308" : "#c49a5e"} className="transition-all duration-300" />
                    <text x="250" y="40" textAnchor="middle" fontSize="8" fill={selected?.id === "sambalpur" ? "#eab308" : "currentColor"} className={selected?.id === "sambalpur" ? "" : "text-foreground dark:text-[#f7efe6]"}>Sambalpur</text>
                  </g>
                </svg>
              </div>

              {/* Village list buttons */}
              <div className="space-y-3">
                {VILLAGES.map(village => (
                  <button
                    key={village.id}
                    id={`village-${village.id}`}
                    onClick={() => {
                      setSelected(village);
                      setActiveTab("details");
                    }}
                    className={`w-full text-left bg-black/5 dark:bg-black/30 border rounded-2xl p-4 transition-all duration-300 ${
                      selected?.id === village.id 
                        ? "border-amber-500/40 bg-amber-500/10 dark:bg-amber-500/5 shadow-md" 
                        : "border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br ${village.color} shrink-0`}>
                        {village.emoji}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className={`font-bold text-sm leading-tight transition-colors ${selected?.id === village.id ? "text-amber-600 dark:text-amber-400" : "text-foreground dark:text-amber-100"}`}>{village.name}</h3>
                        <p className="text-xs text-foreground/50 dark:text-amber-100/50 mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />{village.location}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel: Detail Showcase */}
          <div className="lg:col-span-3">
            {selected && (
              <div className="bg-white/70 dark:bg-black/40 border border-border/50 dark:border-[#c49a5e]/15 rounded-3xl overflow-hidden backdrop-blur-md shadow-xl dark:shadow-none">
                {/* Banner */}
                <div className={`h-28 bg-gradient-to-br ${selected.color} flex items-center justify-between px-8 relative`}>
                  <div className="text-6xl filter drop-shadow-lg">{selected.emoji}</div>
                  <div className="flex flex-wrap gap-1.5 max-w-[200px] justify-end">
                    {selected.tags.map(tag => (
                      <span key={tag} className="text-[10px] px-2.5 py-0.5 bg-black/40 border border-white/20 rounded-full text-white/90 font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex border-b border-border/50 dark:border-[#c49a5e]/10 bg-black/5 dark:bg-black/20">
                  <button
                    onClick={() => setActiveTab("details")}
                    className={`flex-1 py-4 text-sm font-semibold border-b-2 transition-all ${
                      activeTab === "details" 
                        ? "border-amber-500 dark:border-amber-400 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-400/5" 
                        : "border-transparent text-foreground/50 dark:text-amber-100/40 hover:text-foreground dark:hover:text-amber-100"
                    }`}
                  >
                    🎨 Craft Details
                  </button>
                  <button
                    onClick={() => setActiveTab("products")}
                    className={`flex-1 py-4 text-sm font-semibold border-b-2 transition-all flex items-center justify-center gap-2 ${
                      activeTab === "products" 
                        ? "border-amber-500 dark:border-amber-400 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-400/5" 
                        : "border-transparent text-foreground/50 dark:text-amber-100/40 hover:text-foreground dark:hover:text-amber-100"
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" /> Showcase Catalog
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {activeTab === "details" ? (
                    <>
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div>
                          <h2 className="text-2xl font-bold text-foreground">{selected.name}</h2>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm font-bold text-amber-700 dark:text-amber-400">{selected.craft}</span>
                            <span className="text-xs text-foreground/40 dark:text-amber-100/30">({selected.craftHindi})</span>
                          </div>
                          <p className="text-xs text-foreground/50 dark:text-amber-100/50 flex items-center gap-1 mt-1.5">
                            <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-500/80" />{selected.location}
                          </p>
                        </div>
                        <a href={selected.mapUrl} target="_blank" rel="noopener noreferrer" className="shrink-0">
                          <Button variant="outline" className="gap-2 bg-amber-50 dark:bg-amber-500/10 border-amber-300 dark:border-amber-500/30 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-500/20 rounded-xl shadow-sm dark:shadow-none">
                            <ExternalLink className="w-4 h-4" /> Get Directions
                          </Button>
                        </a>
                      </div>

                      <div className="space-y-4">
                        <div className="leading-relaxed text-foreground/70 dark:text-amber-100/70 text-sm font-light">
                          {selected.description}
                        </div>

                        {/* History */}
                        <div className="bg-black/5 dark:bg-black/30 border border-black/10 dark:border-white/5 rounded-2xl p-5">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-2">Historical Significance</h4>
                          <p className="text-sm text-foreground/80 dark:text-amber-100/70 leading-relaxed font-light">{selected.history}</p>
                        </div>

                        {/* Best For */}
                        <div className="bg-amber-50 dark:bg-[#c49a5e]/5 border border-amber-200 dark:border-[#c49a5e]/25 rounded-2xl p-5 flex items-start gap-3">
                          <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 mb-1">Authentic Purchases</h4>
                            <p className="text-sm text-foreground/80 dark:text-amber-100/80 font-light">{selected.bestFor}</p>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-5">
                      <div className="flex items-center justify-between border-b border-border/50 dark:border-[#c49a5e]/10 pb-3">
                        <h3 className="font-bold text-amber-700 dark:text-amber-400">Local Craft Offerings</h3>
                        <span className="text-xs text-foreground/50 dark:text-amber-100/50">Direct purchase supports community families</span>
                      </div>
                      
                      <div className="grid gap-4">
                        {selected.products.map((product, idx) => (
                          <div key={idx} className="bg-black/5 dark:bg-black/30 border border-black/10 dark:border-white/5 rounded-2xl p-4 flex items-center justify-between gap-4 hover:border-amber-200 dark:hover:border-[#c49a5e]/20 transition-all">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 text-lg">
                                📦
                              </div>
                              <div>
                                <h4 className="font-bold text-sm text-foreground dark:text-amber-100">{product.name}</h4>
                                <p className="text-xs text-foreground/50 dark:text-amber-100/50 mt-0.5">{product.imageDesc}</p>
                              </div>
                            </div>
                            <span className="font-mono text-sm font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-400/10 border border-amber-300 dark:border-amber-400/20 px-3 py-1 rounded-xl">
                              {product.price}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="p-4 bg-amber-50 dark:bg-amber-400/5 border border-amber-200 dark:border-amber-400/10 rounded-2xl text-center text-xs text-foreground/60 dark:text-amber-100/50 leading-relaxed font-light">
                        💡 <strong>Sustainable Tourism Tip:</strong> Prices vary depending on materials and weeks of handmade labor. Carry cash when visiting villages, as digital payments are supported but cash is preferred.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Suggested Itinerary Planner */}
      <div className="container mx-auto px-4 mt-12 max-w-6xl relative z-10">
        <div className="bg-white/70 dark:bg-black/40 border border-border/50 dark:border-[#c49a5e]/15 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-xl dark:shadow-none">
          <h3 className="text-xl font-bold text-center mb-6 text-amber-700 dark:text-amber-300 flex items-center justify-center gap-2">
            <Calendar className="w-5 h-5" /> Suggested 3-Day Sustainable Artisan Trail
          </h3>
          
          <div className="grid md:grid-cols-3 gap-5 relative">
            {ITINERARY.map((itinerary, i) => (
              <div 
                key={i} 
                className={`relative bg-black/5 dark:bg-black/50 border rounded-2xl p-5 cursor-pointer transition-all duration-300 ${
                  selectedDay === i 
                    ? "border-amber-500 dark:border-amber-400 bg-amber-100 dark:bg-amber-400/5 shadow-[0_0_15px_rgba(245,158,11,0.08)] scale-[1.02]" 
                    : "border-black/10 dark:border-white/5 hover:border-amber-200 dark:hover:border-white/10"
                }`}
                onClick={() => {
                  setSelectedDay(selectedDay === i ? null : i);
                  const vill = VILLAGES.find(v => v.id === itinerary.villageId);
                  if (vill) setSelected(vill);
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/20 px-3 py-1 rounded-full">
                    {itinerary.day}
                  </span>
                  <span className="text-[10px] text-foreground/50 dark:text-amber-100/40">{itinerary.travelTime}</span>
                </div>
                <p className="text-sm text-foreground/70 dark:text-amber-100/70 leading-relaxed font-light mb-3">
                  {itinerary.highlights}
                </p>
                <div className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-auto">
                  Focus on {VILLAGES.find(v => v.id === itinerary.villageId)?.craft} <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ArtisanTrail;
