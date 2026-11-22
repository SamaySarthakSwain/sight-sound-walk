import { useEffect, useState, useMemo } from "react";
import { useMonuments, Monument } from "@/hooks/useMonuments";
import { useCity } from "@/contexts/CityContext";
import { 
  Landmark, Volume2, Search, X, Sparkles, Shuffle, 
  Heart, Waves, Trees, Mountain, ShieldCheck, Compass, CheckCircle2,
  Camera, Zap
} from "lucide-react";
import MonumentFlashCard from "@/components/MonumentFlashCard";
import { FlashSkeletonGrid } from "@/components/MonumentCardSkeleton";
import { getMonumentImage, resetImageCounters } from "@/data/monumentImages";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import { toast } from "sonner";

// Categorical buckets for high-level pill filters
const CATEGORY_TABS = [
  { id: "all", label: "All Sites", icon: Landmark },
  { id: "temples", label: "Temples & Sacred", icon: Sparkles, match: ["Temple", "Stupa", "Monastery"] },
  { id: "beaches", label: "Beaches & Coast", icon: Waves, match: ["Beach"] },
  { id: "waterfalls", label: "Waterfalls", icon: Zap, match: ["Waterfall"] },
  { id: "nature", label: "Nature & Wildlife", icon: Trees, match: ["Sanctuary", "Park", "Lake", "Natural Wonder"] },
  { id: "caves_forts", label: "Forts & Caves", icon: Mountain, match: ["Fort", "Cave", "Hill", "Hill Station"] },
  { id: "culture", label: "Culture & Museums", icon: Compass, match: ["Museum", "Cultural Site"] },
  { id: "favorites", label: "My Saved", icon: Heart, match: [] },
];

const DatabaseMonuments = () => {
  const { monuments, loading, error } = useMonuments();
  const { selectedCity } = useCity();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryTab, setSelectedCategoryTab] = useState("all");
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [randomPick, setRandomPick] = useState<Monument | null>(null);

  const cityDisplayName = selectedCity.split(",")[0] || "Odisha";

  // Load saved monument IDs from localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("saved_monuments") || "[]");
      setSavedIds(saved);
    } catch {
      setSavedIds([]);
    }
  }, []);

  // Listen for storage events so saved items stay in sync across components
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = JSON.parse(localStorage.getItem("saved_monuments") || "[]");
        setSavedIds(saved);
      } catch {
        // Ignore
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    resetImageCounters();
  }, [monuments]);

  // Filter monuments based on search & active category tab
  const filteredMonuments = useMemo(() => {
    let result = monuments;

    // Filter by category tab
    if (selectedCategoryTab === "favorites") {
      result = result.filter((m) => savedIds.includes(m.id));
    } else if (selectedCategoryTab !== "all") {
      const activeTab = CATEGORY_TABS.find((t) => t.id === selectedCategoryTab);
      if (activeTab && activeTab.match) {
        result = result.filter((m) => activeTab.match.includes(m.category));
      }
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q) ||
          m.location.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q)
      );
    }

    return result;
  }, [monuments, selectedCategoryTab, searchQuery, savedIds]);

  // Group by specific category
  const groupedMonuments = useMemo(() => {
    return filteredMonuments.reduce((acc, monument) => {
      const category = monument.category || "Heritage";
      if (!acc[category]) acc[category] = [];
      acc[category].push(monument);
      return acc;
    }, {} as Record<string, typeof monuments>);
  }, [filteredMonuments]);

  // Handler for Random Pick / Surprise Me
  const handleSurpriseMe = () => {
    if (!monuments || monuments.length === 0) return;
    const pool = filteredMonuments.length > 0 ? filteredMonuments : monuments;
    const randomIndex = Math.floor(Math.random() * pool.length);
    const chosen = pool[randomIndex];
    setRandomPick(chosen);
    toast.success(`🎲 Discovered: ${chosen.title}!`, {
      description: `Located in ${chosen.location} (${chosen.category})`,
    });

    // Scroll to the element if present
    setTimeout(() => {
      const el = document.getElementById(`monument-${chosen.id}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("ring-4", "ring-primary", "rounded-3xl", "transition-all", "duration-500");
        setTimeout(() => {
          el.classList.remove("ring-4", "ring-primary");
        }, 3000);
      }
    }, 100);
  };

  // SKELETON UI FOR ZERO-FLICKER / SMOOTH LOADING
  if (loading) {
    return (
      <section id="Flash" className="py-12 md:py-20 bg-background relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-10 space-y-4 max-w-2xl mx-auto">
            <div className="h-10 sm:h-12 w-3/4 mx-auto rounded-2xl bg-muted/50 animate-pulse" />
            <div className="h-5 w-1/2 mx-auto rounded-xl bg-muted/30 animate-pulse" />
            <div className="h-12 w-full max-w-md mx-auto rounded-full bg-muted/40 animate-pulse" />
            <div className="flex justify-center gap-2 pt-2">
              <div className="h-8 w-24 rounded-full bg-muted/40 animate-pulse" />
              <div className="h-8 w-28 rounded-full bg-muted/40 animate-pulse" />
              <div className="h-8 w-24 rounded-full bg-muted/40 animate-pulse" />
            </div>
          </div>
          <FlashSkeletonGrid count={6} />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center max-w-md">
          <div className="p-8 rounded-3xl glass-card border border-destructive/20 shadow-xl space-y-4">
            <p className="text-destructive font-semibold">{error}</p>
            <p className="text-sm text-muted-foreground">Showing verified local offline heritage database.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="Flash" className="py-10 md:py-16 bg-background relative">
      <div className="container mx-auto px-4 max-w-7xl">
        <ScrollReveal>
          <div className="text-center mb-8 md:mb-12 space-y-3 md:space-y-4">
            {/* Real-time Status Pills */}
            <div className="inline-flex flex-wrap items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md mb-2">
              <span className="flex items-center gap-1.5 text-xs font-medium text-primary">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                100% Real Photography
              </span>
              <span className="text-primary/40">•</span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-primary">
                <Volume2 className="w-3.5 h-3.5 text-primary" />
                AI Audio Narration
              </span>
              <span className="text-primary/40">•</span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-primary">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Instant Zero-Lag Load
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
              Explore{" "}
              <span className="bg-gradient-to-r from-primary via-amber-500 to-orange-500 bg-clip-text text-transparent">
                {cityDisplayName}'s Living Heritage
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
              Immerse yourself in {monuments.length} verified architectural marvels, ancient temples, pristine beaches, and natural wonders with interactive 3D audio cards.
            </p>

            {/* Search and Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xl mx-auto mt-6">
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name, deity, dynasty, beach, or town..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 rounded-full glass-input h-12 text-sm sm:text-base shadow-lg border-primary/20 focus:border-primary"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                    title="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Surprise Me Button */}
              <Button
                onClick={handleSurpriseMe}
                variant="outline"
                className="h-12 px-5 rounded-full shrink-0 border-primary/30 hover:bg-primary/10 hover:border-primary gap-2 font-medium shadow-md transition-all active:scale-95"
                title="Discover a random monument"
              >
                <Shuffle className="w-4 h-4 text-primary animate-spin-slow" />
                <span className="hidden sm:inline">Surprise Me</span>
                <span className="sm:hidden">Random</span>
              </Button>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center justify-start sm:justify-center gap-1.5 md:gap-2 overflow-x-auto py-3 px-1 no-scrollbar text-xs sm:text-sm">
              {CATEGORY_TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = selectedCategoryTab === tab.id;
                const count = tab.id === "all"
                  ? monuments.length
                  : tab.id === "favorites"
                  ? savedIds.length
                  : monuments.filter((m) => tab.match?.includes(m.category)).length;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedCategoryTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all duration-200 border text-xs sm:text-sm font-medium ${
                      isActive
                        ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/25 scale-105"
                        : "bg-muted/40 hover:bg-muted/70 text-muted-foreground hover:text-foreground border-white/10"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-primary-foreground" : "text-primary"}`} />
                    <span>{tab.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? "bg-black/20 text-white" : "bg-muted text-muted-foreground"
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        {/* Empty Search / Filter State */}
        {filteredMonuments.length === 0 && (
          <div className="text-center py-16 px-4">
            <div className="w-16 h-16 rounded-3xl bg-muted/50 border border-white/10 flex items-center justify-center mx-auto mb-4 text-muted-foreground shadow-lg">
              {selectedCategoryTab === "favorites" ? (
                <Heart className="w-8 h-8 text-rose-500" />
              ) : (
                <Search className="w-8 h-8" />
              )}
            </div>
            <h3 className="text-lg font-bold mb-1">
              {selectedCategoryTab === "favorites" 
                ? "No saved monuments yet" 
                : "No matching monuments found"}
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
              {selectedCategoryTab === "favorites"
                ? "Click the heart icon on any monument flashcard to save it to your personal favorites collection!"
                : `We couldn't find any results for "${searchQuery}". Try searching for Konark, Puri, Beach, or Lingaraj.`}
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategoryTab("all");
              }}
              variant="outline"
              className="rounded-full px-6 border-primary/30 hover:border-primary"
            >
              Reset All Filters
            </Button>
          </div>
        )}

        {/* Grouped Monument Sections */}
        {Object.entries(groupedMonuments).map(([category, categoryMonuments]) => (
          <div key={category} className="mb-12 md:mb-16">
            <ScrollReveal>
              <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-6 rounded-full bg-gradient-to-b from-primary to-amber-500 inline-block" />
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
                    {category}s
                  </h2>
                  <Badge variant="secondary" className="rounded-full text-xs font-semibold px-2.5 py-0.5">
                    {categoryMonuments.length}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  Interactive 3D Flashcards
                </span>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {categoryMonuments.map((monument, i) => (
                <div key={monument.id} id={`monument-${monument.id}`}>
                  <ScrollReveal delay={Math.min(i * 60, 240)}>
                    <MonumentFlashCard
                      monument={monument}
                      imageUrl={getMonumentImage(monument)}
                    />
                  </ScrollReveal>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DatabaseMonuments;