import { useState, useMemo } from "react";
import Navigation from "@/components/Navigation";
import ARModelCard from "@/components/ARModelCard";
import { arModels, arCategories } from "@/data/arModels";
import { Button } from "@/components/ui/button";
import { Box } from "lucide-react";

const ARExperience = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredModels = useMemo(
    () =>
      activeCategory === "All"
        ? arModels
        : arModels.filter((m) => m.categories.includes(activeCategory)),
    [activeCategory]
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section className="pt-20 pb-10 md:pt-28 md:pb-14 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Box className="h-4 w-4" />
            AR Experience
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Explore Monuments in 3D
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Interact with stunning 3D models of India's most iconic monuments. Rotate, zoom, and experience heritage like never before.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-14 md:top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-3 flex gap-2 overflow-x-auto scrollbar-none">
          {arCategories.map((cat) => (
            <Button
              key={cat}
              size="sm"
              variant={activeCategory === cat ? "default" : "outline"}
              onClick={() => setActiveCategory(cat)}
              className="shrink-0"
            >
              {cat}
            </Button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <main className="container mx-auto px-4 py-8">
        <p className="text-sm text-muted-foreground mb-6">
          Showing {filteredModels.length} monument{filteredModels.length !== 1 ? "s" : ""}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModels.map((model) => (
            <ARModelCard key={model.id} model={model} />
          ))}
        </div>

        {filteredModels.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No models found for this category.</p>
          </div>
        )}
      </main>

      {/* SEO / Accessibility footer text */}
      <section className="container mx-auto px-4 pb-12">
        <p className="text-xs text-muted-foreground/60 text-center max-w-2xl mx-auto">
          3D models are provided via Sketchfab under their respective licenses. AR viewing requires a WebXR-compatible browser. All models load on-demand for optimal performance.
        </p>
      </section>
    </div>
  );
};

export default ARExperience;
