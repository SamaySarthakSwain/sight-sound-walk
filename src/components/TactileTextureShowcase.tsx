import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, X, Sparkles, Layers, Sliders, Check, Copy, ShieldCheck, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface MaterialArchetype {
  id: string;
  name: string;
  className: string;
  baseHex: string;
  sigma: number;
  useCase: string;
  tooth: string;
  description: string;
}

const MATERIAL_ARCHETYPES: MaterialArchetype[] = [
  {
    id: "photovoltaic",
    name: "Solar Photovoltaic Wafer",
    className: "tex-photovoltaic",
    baseHex: "#08201C",
    sigma: 3.8,
    useCase: "Clean-Tech Hardware & AI Core",
    tooth: "Anti-reflective Sub-micron Pyramid Tooth",
    description: "Monocrystalline silicon with anti-reflective passivated gridlines.",
  },
  {
    id: "washi",
    name: "Artisanal Cold-Pressed Washi",
    className: "tex-washi",
    baseHex: "#F7F9F5",
    sigma: 7.2,
    useCase: "Diplomas, Heritage & Day Mode Canvas",
    tooth: "Unbleached Cellulose Natural Fiber",
    description: "320gsm archival paper with natural unbleached tooth and tactile warmth.",
  },
  {
    id: "anodized",
    name: "Bead-Blasted Anodized Aluminum",
    className: "tex-anodized",
    baseHex: "#2B312D",
    sigma: 4.2,
    useCase: "Robotics, Devices & Night Mode Panels",
    tooth: "Non-directional Satin Bead-blast",
    description: "Satin metallic stippling with 1px chamfered edge highlight.",
  },
  {
    id: "frosted-glass",
    name: "Acid-Etched Smoked Obsidian Glass",
    className: "tex-frosted-glass",
    baseHex: "rgba(12,18,14,0.85)",
    sigma: 5.6,
    useCase: "Floating Docks & Command Glass",
    tooth: "Diffused Architectural Velvet Frost",
    description: "20mm architectural frosted glass with 20px Gaussian backdrop blur.",
  },
  {
    id: "perforated-felt",
    name: "Micro-Perforated Acoustic Wool Felt",
    className: "tex-perforated-felt",
    baseHex: "#0F421E",
    sigma: 6.8,
    useCase: "Audio Widgets & Soundscape Modules",
    tooth: "Acoustic 1.5mm Precision Stipples",
    description: "Laser-drilled micro-perforations delivering physical analog depth.",
  },
  {
    id: "terracotta",
    name: "Unglazed Terracotta & Diatomaceous Earth",
    className: "tex-terracotta",
    baseHex: "#852E10",
    sigma: 6.2,
    useCase: "Heritage Monuments & Cultural Quests",
    tooth: "Earthy Ceramic Clay Tooth",
    description: "Raw earthen ceramic with microscopic diatomaceous porosity.",
  },
  {
    id: "blueprint",
    name: "Technical Drafting Blueprint Vellum",
    className: "tex-blueprint",
    baseHex: "#0A1830",
    sigma: 5.0,
    useCase: "Engineering Schematics & Urban Corridors",
    tooth: "1mm Isometric Grid Vellum",
    description: "Precision cobalt/cyan technical vellum with 40px grid spacing.",
  },
];

const COLOR_FAMILIES = [
  {
    name: "Family 04: Cyan & Jade Teals",
    swatches: [
      { code: "T01", name: "Abyssal Marine", hex: "#062325", sigma: 6.4 },
      { code: "T02", name: "Deep Ocean", hex: "#0B383B", sigma: 6.2 },
      { code: "T03", name: "Marine Spruce", hex: "#104E52", sigma: 5.8 },
      { code: "T04", name: "Persian Jade Teal", hex: "#00B496", sigma: 5.9 },
      { code: "T05", name: "Aegean Turquoise", hex: "#188A91", sigma: 5.4 },
      { code: "T06", name: "Radiant Cyan", hex: "#1DB2BA", sigma: 4.8 },
      { code: "T07", name: "Caribbean Surf", hex: "#3BD0D8", sigma: 4.5 },
      { code: "T10", name: "Mist Crystal", hex: "#DDFAFE", sigma: 6.8 },
    ],
  },
  {
    name: "Family 05: Royal & Sky Blues",
    swatches: [
      { code: "B01", name: "Midnight Abyss", hex: "#081226", sigma: 6.6 },
      { code: "B02", name: "Oxford Deep Blue", hex: "#0C1E40", sigma: 6.4 },
      { code: "B03", name: "Executive Navy", hex: "#102C5C", sigma: 6.2 },
      { code: "B04", name: "Cobalt Royal Blue", hex: "#1656AD", sigma: 6.8 },
      { code: "B05", name: "French Ultramarine", hex: "#236BD6", sigma: 5.8 },
      { code: "B06", name: "Mediterranean Azure", hex: "#3885F2", sigma: 5.2 },
      { code: "B07", name: "Cornflower Blue", hex: "#5B9EF9", sigma: 4.8 },
      { code: "B10", name: "Arctic Cloud", hex: "#E4EFFE", sigma: 7.0 },
    ],
  },
  {
    name: "Family 08: Amber & Terracotta",
    swatches: [
      { code: "O01", name: "Espresso Rust", hex: "#381105", sigma: 6.8 },
      { code: "O03", name: "Spiced Terracotta", hex: "#852E10", sigma: 6.2 },
      { code: "O04", name: "Sedona Clay", hex: "#B24317", sigma: 5.8 },
      { code: "O05", name: "Autumn Maple", hex: "#D95C1E", sigma: 5.4 },
      { code: "O06", name: "Vibrant Tangelo", hex: "#F47321", sigma: 4.8 },
      { code: "O07", name: "Apricot Glow", hex: "#F7934B", sigma: 5.2 },
      { code: "O10", name: "Sunlit Linen", hex: "#FEEEDF", sigma: 7.2 },
    ],
  },
  {
    name: "Family 01: Neutrals & Monochromes",
    swatches: [
      { code: "N01", name: "Obsidian Carbon", hex: "#0A0D0B", sigma: 6.2 },
      { code: "N02", name: "Pitch Charcoal", hex: "#121613", sigma: 6.4 },
      { code: "N03", name: "Deep Carton", hex: "#1A1E1B", sigma: 6.6 },
      { code: "N04", name: "Dark Mineral Slate", hex: "#2B312D", sigma: 6.8 },
      { code: "N07", name: "Cool Platinum", hex: "#9BA59E", sigma: 7.2 },
      { code: "N09", name: "Ceramic Mist", hex: "#E5EBE6", sigma: 7.8 },
      { code: "N10", name: "Alabaster Pure White", hex: "#F8FAF8", sigma: 7.1 },
    ],
  },
];

const TactileTextureShowcase = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"archetypes" | "vault">("archetypes");
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();

  const handleCopy = (hex: string, name: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    toast.success(`Copied ${name} (${hex}) to clipboard!`);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <>
      {/* Floating Launcher Trigger */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-20 z-40 flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-card/90 border border-primary/40 text-foreground shadow-xl backdrop-blur-xl hover:border-primary transition-all group"
        title="REC NIST Clean-Tech Design System & Texture Engine"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
        <Palette className="w-4 h-4 text-primary" />
        <span className="text-xs font-mono font-bold tracking-wider hidden sm:inline">
          CLEAN-TECH PALETTE & NOISE
        </span>
      </motion.button>

      {/* Floating Inspector Modal / Panel */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-card border border-border rounded-2xl shadow-2xl flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-border bg-card/60 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                      REC NIST Clean-Tech Design System
                      <Badge variant="outline" className="text-[10px] border-emerald-500/40 text-emerald-500 font-mono">
                        Physical Matte Noise Active (σ 3.8-7.8)
                      </Badge>
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Tactile Material Archetypes, Zero-Plasticity CSS Blueprints & Color Vault
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Theme Quick Toggle */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="gap-1.5 text-xs font-mono"
                  >
                    {theme === "dark" ? (
                      <>
                        <Sun className="w-3.5 h-3.5 text-amber-500" />
                        <span>Day Mode (Washi σ 7.2)</span>
                      </>
                    ) : (
                      <>
                        <Moon className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Night Mode (Carbon σ 6.2)</span>
                      </>
                    )}
                  </Button>

                  <button
                    onClick={() => setOpen(false)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Tab Selector */}
              <div className="flex items-center gap-2 px-6 pt-4 border-b border-border bg-muted/30">
                <button
                  onClick={() => setActiveTab("archetypes")}
                  className={`pb-3 px-3 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 flex items-center gap-1.5 ${
                    activeTab === "archetypes"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  7 Tactile Material Archetypes (Vol. 1)
                </button>
                <button
                  onClick={() => setActiveTab("vault")}
                  className={`pb-3 px-3 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 flex items-center gap-1.5 ${
                    activeTab === "vault"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Palette className="w-3.5 h-3.5" />
                  Clean-Tech Color Vault (Vol. 2, 3, 4)
                </button>
              </div>

              {/* Scrollable Content Body */}
              <div className="p-6 overflow-y-auto space-y-6 max-h-[calc(90vh-140px)] scrollbar-thin">
                {activeTab === "archetypes" && (
                  <div className="space-y-4">
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-3.5 text-xs text-muted-foreground flex items-center gap-3">
                      <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                      <span>
                        <strong>Zero-Plasticity Standard:</strong> All materials maintain a physical analog tooth, multi-stop soft elevation shadows (<code className="font-mono text-[11px]">0 4px 18px rgba(0,0,0,0.06)</code>), and 1px chamfered highlights.
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {MATERIAL_ARCHETYPES.map((mat) => (
                        <div
                          key={mat.id}
                          className={`p-4 rounded-xl relative overflow-hidden transition-all duration-300 ${mat.className}`}
                        >
                          <div className="relative z-10 flex flex-col justify-between h-full space-y-2">
                            <div>
                              <div className="flex items-center justify-between">
                                <h3 className="font-bold text-sm text-white drop-shadow-sm">{mat.name}</h3>
                                <Badge variant="secondary" className="text-[10px] font-mono bg-black/40 text-white border-white/20">
                                  σ = {mat.sigma}
                                </Badge>
                              </div>
                              <p className="text-[11px] text-white/80 mt-1">{mat.description}</p>
                            </div>

                            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/70">
                              <span className="font-mono">{mat.tooth}</span>
                              <span className="font-mono bg-black/30 px-2 py-0.5 rounded text-white">{mat.baseHex}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "vault" && (
                  <div className="space-y-6">
                    {COLOR_FAMILIES.map((fam, idx) => (
                      <div key={idx} className="space-y-2.5">
                        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                          {fam.name}
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {fam.swatches.map((swatch) => (
                            <button
                              key={swatch.code}
                              onClick={() => handleCopy(swatch.hex, swatch.name)}
                              className="group p-2.5 rounded-xl border border-border bg-card/40 hover:bg-card hover:border-primary/50 transition-all text-left flex flex-col justify-between h-24 relative overflow-hidden"
                            >
                              <div className="flex items-center justify-between w-full">
                                <span
                                  className="w-4 h-4 rounded-md shadow-inner border border-white/20"
                                  style={{ backgroundColor: swatch.hex }}
                                />
                                <span className="text-[10px] font-mono text-muted-foreground group-hover:text-primary transition-colors">
                                  {copiedHex === swatch.hex ? <Check className="w-3 h-3 text-emerald-500" /> : swatch.code}
                                </span>
                              </div>

                              <div>
                                <p className="text-xs font-bold text-foreground leading-tight">{swatch.name}</p>
                                <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-0.5 font-mono">
                                  <span>{swatch.hex}</span>
                                  <span>σ = {swatch.sigma}</span>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TactileTextureShowcase;
