import { useState } from "react";
import Navigation from "@/components/Navigation";
import MoreSubNav from "@/components/MoreSubNav";
import { Slider } from "@/components/ui/slider";
import { Sun, Clock, Info, BookOpen, Compass, ArrowRight } from "lucide-react";

// ── Constants ──────────────────────────────────────────────────────────────────
const SPOKES = 8; // 8 major spokes representing the 8 Praharas of a 24-hour cycle (4 during the day)
const PRAHARAS = [
  { name: "Pratah", time: "6:00 AM - 9:00 AM", desc: "Dawn & Morning prayers" },
  { name: "Sangava", time: "9:00 AM - 12:00 PM", desc: "Mid-morning work & study" },
  { name: "Madhyahna", time: "12:00 PM - 3:00 PM", desc: "Solar Noon & rest" },
  { name: "Aparahna", time: "3:00 PM - 6:00 PM", desc: "Late afternoon & returns" }
];

const PRESETS = [
  { label: "🌅 Dawn (6:00 AM)", value: 0 },
  { label: "📿 Morning Puja (9:00 AM)", value: 180 },
  { label: "☀️ Solar Noon (12:00 PM)", value: 360 },
  { label: "☕ Afternoon (3:00 PM)", value: 540 },
  { label: "🌇 Sunset (6:00 PM)", value: 720 }
];

function getTimeFromSlider(value: number) {
  // value: 0–720 representing minutes from 6:00 AM to 6:00 PM
  const totalMin = 6 * 60 + value;
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h > 12 ? h - 12 : h;
  return { hours: h, minutes: m, display: `${h12}:${m.toString().padStart(2, "0")} ${ampm}` };
}

function getShadowAngle(sliderValue: number) {
  // Solar noon (12:00) = 0 degrees (vertical shadow pointing down)
  // 6AM = -90° (shadow pointing west/right)
  // 6PM = +90° (shadow pointing east/left)
  const progress = (sliderValue / 720) * 180 - 90; // -90 to +90
  return progress;
}

// ── SVG Wheel ─────────────────────────────────────────────────────────────────
const KonarkWheel = ({ shadowAngle, timeValue }: { shadowAngle: number; timeValue: number }) => {
  const cx = 200, cy = 200, r = 140, hubR = 26;
  const spokeLength = r - hubR - 10;

  return (
    <svg viewBox="0 0 400 400" className="w-full max-w-[380px] mx-auto select-none filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
      <defs>
        {/* Outer glow */}
        <filter id="outerGlow">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        {/* Shadow blur */}
        <filter id="shadowBlur">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        {/* Stone texture gradient */}
        <radialGradient id="stoneGrad" cx="45%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#d4a978" />
          <stop offset="65%" stopColor="#9a6e45" />
          <stop offset="100%" stopColor="#5a3d22" />
        </radialGradient>
        <radialGradient id="hubGrad" cx="35%" cy="30%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="40%" stopColor="#b45309" />
          <stop offset="100%" stopColor="#78350f" />
        </radialGradient>
      </defs>

      {/* Ground shadow */}
      <ellipse cx={cx} cy={cy + 155} rx={145} ry={12} fill="rgba(0,0,0,0.4)" filter="url(#shadowBlur)" />

      {/* Rim divisions: 30 small dots/beads between spokes */}
      <circle cx={cx} cy={cy} r={r + 14} fill="none" stroke="#c49a5e" strokeWidth="2" opacity="0.3" />
      <circle cx={cx} cy={cy} r={r} fill="url(#stoneGrad)" stroke="#c49a5e" strokeWidth="4" />
      
      {/* Outer rim decorative beads */}
      {Array.from({ length: 60 }).map((_, i) => {
        const angle = (i / 60) * 360;
        const rad = (angle - 90) * Math.PI / 180;
        const bx = cx + (r - 6) * Math.cos(rad);
        const by = cy + (r - 6) * Math.sin(rad);
        const isSpokeAlign = i % 7.5 === 0;
        return (
          <circle 
            key={`bead-${i}`} 
            cx={bx} 
            cy={by} 
            r={isSpokeAlign ? 3.5 : 2} 
            fill={isSpokeAlign ? "#f59e0b" : "#c49a5e"} 
            opacity={isSpokeAlign ? 0.9 : 0.5} 
          />
        );
      })}

      {/* Major & Minor Spokes */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * 360 - 90;
        const rad = angle * Math.PI / 180;
        const x1 = cx + hubR * Math.cos(rad);
        const y1 = cy + hubR * Math.sin(rad);
        const x2 = cx + (r - 10) * Math.cos(rad);
        const y2 = cy + (r - 10) * Math.sin(rad);
        const isMajor = i % 2 === 0;
        
        return (
          <g key={`spoke-group-${i}`} opacity={isMajor ? 0.95 : 0.65}>
            {/* Structural spoke line */}
            <line 
              x1={x1} y1={y1} x2={x2} y2={y2} 
              stroke={isMajor ? "#fbbf24" : "#c49a5e"} 
              strokeWidth={isMajor ? 4.5 : 2} 
            />
            {/* Spoke carvings/decoration */}
            {isMajor && (
              <circle cx={cx + (r - 45) * Math.cos(rad)} cy={cy + (r - 45) * Math.sin(rad)} r="6" fill="#78350f" stroke="#fbbf24" strokeWidth="1" />
            )}
          </g>
        );
      })}

      {/* ── Shadow Cast by central Gnomon ── */}
      {(() => {
        const t = timeValue / 720; // 0–1
        // Shadow is longer in the morning and evening, shortest at Solar Noon
        const shadowLen = r - 15 - 45 * Math.abs(Math.sin((t - 0.5) * Math.PI));
        
        // At Konark, the sun is in the south, casting shadows north.
        // 6:00 AM sun in East casts shadow directly West (+90 deg offset)
        const shadowRad = (shadowAngle + 90) * Math.PI / 180;
        const sx = cx + shadowLen * Math.cos(shadowRad);
        const sy = cy + shadowLen * Math.sin(shadowRad);

        return (
          <g>
            {/* Blurry base shadow */}
            <line 
              x1={cx} y1={cy} x2={sx} y2={sy} 
              stroke="rgba(0,0,0,0.7)" 
              strokeWidth="9" 
              strokeLinecap="round" 
              filter="url(#shadowBlur)" 
            />
            {/* Sharp core shadow */}
            <line 
              x1={cx} y1={cy} x2={sx} y2={sy} 
              stroke="rgba(30,20,10,0.8)" 
              strokeWidth="4" 
              strokeLinecap="round" 
            />
            {/* Highlight pointer dot where shadow crosses rim */}
            <circle cx={sx} cy={sy} r="4" fill="#f59e0b" filter="url(#outerGlow)" />
          </g>
        );
      })()}

      {/* Central Hub representing Sun God */}
      <circle cx={cx} cy={cy} r={hubR} fill="url(#hubGrad)" stroke="#f59e0b" strokeWidth="2.5" />
      <circle cx={cx} cy={cy} r={hubR - 6} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <circle cx={cx} cy={cy} r={6} fill="#120d09" />

      {/* Actual physical Gnomon rod casting the shadow */}
      <line x1={cx} y1={cy} x2={cx} y2={cy - 36} stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" filter="url(#outerGlow)" />
      <circle cx={cx} cy={cy - 36} r="3" fill="#ffffff" />
    </svg>
  );
};

// ── Page ───────────────────────────────────────────────────────────────────────
const SundialSimulator = () => {
  const [sliderValue, setSliderValue] = useState(180); // Default 9:00 AM
  const [activeTab, setActiveTab] = useState<"calc" | "guide">("calc");

  const time = getTimeFromSlider(sliderValue);
  const shadowAngle = getShadowAngle(sliderValue);

  // Math breakdown for the bead counting explanation
  // 6:00 AM = 0 offset. Each major spoke represents 3 hours (180 mins).
  // Total 4 spokes cover the daylight hours: Spoke 0 (6 AM), Spoke 1 (9 AM), Spoke 2 (12 PM), Spoke 3 (3 PM), Spoke 4 (6 PM)
  const nearestSpokeIdx = Math.floor(sliderValue / 180);
  const nextSpokeIdx = nearestSpokeIdx + 1;
  const minutesPastSpoke = sliderValue % 180;
  
  // Outer rim has 30 beads between major spokes. 180 minutes / 30 beads = 6 minutes per bead!
  const beadsCounted = Math.round(minutesPastSpoke / 6);
  
  const currentSpokeTime = nearestSpokeIdx * 3 + 6; // 6 AM + index * 3
  const currentSpokeLabel = currentSpokeTime > 12 ? `${currentSpokeTime - 12}:00 PM` : currentSpokeTime === 12 ? "12:00 PM" : `${currentSpokeTime}:00 AM`;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative">
      {/* Beautiful Sun Temple Background */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1582293041079-7814c2b120db?auto=format&fit=crop&q=80&w=2000')" }}
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
            <Sun className="w-4 h-4" /> Solar Astronomy Simulation
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-amber-600 to-orange-500 dark:from-amber-200 dark:via-orange-400 dark:to-amber-500 bg-clip-text text-transparent">Konark Solar Sundial Simulator</span>
            <br /><span className="text-foreground/90 text-3xl md:text-4xl font-light">Interactive Shadow Calculations of the Sun Temple</span>
          </h1>
          <p className="text-foreground/70 dark:text-amber-100/60 max-w-2xl mx-auto text-base leading-relaxed font-light">
            The chariot wheels of Konark are not just decorations — they are highly precise astronomical calendars. Adjust the sun's position to see how ancient priests calculated time using shadows and beads.
          </p>
        </div>
      </div>

      {/* Main dashboard */}
      <div className="container mx-auto px-4 mt-6">
        <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto items-start">
          
          {/* Left panel: Wheel view */}
          <div className="lg:col-span-2 bg-white/70 dark:bg-black/40 border border-border/50 dark:border-[#c49a5e]/15 rounded-3xl p-6 backdrop-blur-md text-center shadow-xl dark:shadow-none">
            <h3 className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400 mb-4 flex items-center justify-center gap-2">
              <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: "12s" }} /> Interactive Sundial Wheel
            </h3>
            
            <div className="my-4">
              <KonarkWheel shadowAngle={shadowAngle} timeValue={sliderValue} />
            </div>

            {/* Quick Presets */}
            <div className="mt-6 space-y-2.5">
              <div className="text-left text-[11px] text-foreground/50 dark:text-amber-100/40 uppercase tracking-wider font-bold">Quick Solar Presets</div>
              <div className="grid grid-cols-2 gap-2">
                {PRESETS.map(preset => (
                  <button
                    key={preset.label}
                    onClick={() => setSliderValue(preset.value)}
                    className={`text-xs py-2.5 px-3 rounded-xl font-medium transition-all ${
                      sliderValue === preset.value
                        ? "bg-amber-100 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/30 text-amber-700 dark:text-amber-300"
                        : "bg-black/5 dark:bg-black/20 border border-black/5 dark:border-white/5 text-foreground/60 dark:text-amber-100/50 hover:text-foreground dark:hover:text-white"
                    }`}
                  >
                    {preset.label.split(" (")[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel: Details & Tabs */}
          <div className="lg:col-span-3 bg-white/70 dark:bg-black/40 border border-border/50 dark:border-[#c49a5e]/15 rounded-3xl overflow-hidden backdrop-blur-md shadow-xl dark:shadow-none">
            
            {/* Tabs */}
            <div className="flex border-b border-border/50 dark:border-[#c49a5e]/10 bg-black/5 dark:bg-black/20">
              <button
                onClick={() => setActiveTab("calc")}
                className={`flex-1 py-4 text-sm font-semibold border-b-2 transition-all flex items-center justify-center gap-2 ${
                  activeTab === "calc" 
                    ? "border-amber-500 dark:border-amber-400 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-400/5" 
                    : "border-transparent text-foreground/50 dark:text-amber-100/40 hover:text-foreground dark:hover:text-amber-100"
                }`}
              >
                <Clock className="w-4 h-4" /> Live Reading Calculator
              </button>
              <button
                onClick={() => setActiveTab("guide")}
                className={`flex-1 py-4 text-sm font-semibold border-b-2 transition-all flex items-center justify-center gap-2 ${
                  activeTab === "guide" 
                    ? "border-amber-500 dark:border-amber-400 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-400/5" 
                    : "border-transparent text-foreground/50 dark:text-amber-100/40 hover:text-foreground dark:hover:text-amber-100"
                }`}
              >
                <BookOpen className="w-4 h-4" /> How to Read Guide
              </button>
            </div>

            <div className="p-6 space-y-6">
              
              {activeTab === "calc" ? (
                <>
                  {/* Digital read-out */}
                  <div className="bg-black/5 dark:bg-black/30 border border-black/10 dark:border-white/5 rounded-2xl p-6 text-center relative overflow-hidden">
                    <div className="absolute top-2 right-2 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                    </div>
                    
                    <div className="text-5xl md:text-6xl font-black font-mono bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-300 dark:to-orange-400 bg-clip-text text-transparent">
                      {time.display}
                    </div>
                    <p className="text-[10px] text-foreground/50 dark:text-amber-100/40 uppercase tracking-widest font-bold mt-2">Simulated Solar Time</p>
                    
                    <div className="mt-4 inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/20 px-4 py-1.5 rounded-full text-xs font-semibold text-amber-700 dark:text-amber-300">
                      🌅 Current Prahara: {PRAHARAS[nearestSpokeIdx]?.name || "Sayahna"}
                    </div>
                  </div>

                  {/* Calculations breakdown */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest">Dynamic Time Reading Math</h4>
                    
                    <div className="grid gap-3 text-sm">
                      
                      <div className="bg-black/5 dark:bg-black/30 border border-black/10 dark:border-white/5 rounded-2xl p-4 flex items-center justify-between">
                        <div>
                          <h5 className="font-bold text-foreground">Nearest Major Spoke</h5>
                          <p className="text-xs text-foreground/60 dark:text-amber-100/50 mt-0.5">Spoke {nearestSpokeIdx + 1} representing base time</p>
                        </div>
                        <span className="font-mono font-bold text-amber-700 dark:text-amber-300 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 px-3 py-1 rounded-xl">
                          {currentSpokeLabel}
                        </span>
                      </div>

                      <div className="bg-black/5 dark:bg-black/30 border border-black/10 dark:border-white/5 rounded-2xl p-4 flex items-center justify-between">
                        <div>
                          <h5 className="font-bold text-foreground">Bead Index Alignment</h5>
                          <p className="text-xs text-foreground/60 dark:text-amber-100/50 mt-0.5">Counting {beadsCounted} beads past Spoke {nearestSpokeIdx + 1}</p>
                        </div>
                        <span className="font-mono font-bold text-amber-700 dark:text-amber-300 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 px-3 py-1 rounded-xl">
                          {beadsCounted} Beads
                        </span>
                      </div>

                      <div className="bg-amber-50 dark:bg-[#c49a5e]/5 border border-amber-200 dark:border-[#c49a5e]/25 rounded-2xl p-4">
                        <h5 className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider mb-2">Bead Formula Calculation</h5>
                        <div className="flex flex-col gap-2 font-mono text-xs text-foreground/80 dark:text-amber-100/80">
                          <div className="flex justify-between border-b border-black/10 dark:border-white/5 pb-1.5">
                            <span>1 Major division (3 hrs)</span>
                            <span>= 30 Beads</span>
                          </div>
                          <div className="flex justify-between border-b border-black/10 dark:border-white/5 pb-1.5">
                            <span>1 Bead unit value</span>
                            <span>= 6 Minutes (180 mins / 30 beads)</span>
                          </div>
                          <div className="flex justify-between text-foreground font-bold pt-1">
                            <span>Final Reading: {currentSpokeLabel} + ({beadsCounted} beads × 6 mins)</span>
                            <span className="text-amber-600 dark:text-amber-400">= {time.display}</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Slider Control */}
                  <div className="bg-black/5 dark:bg-black/30 border border-black/10 dark:border-white/5 rounded-2xl p-5">
                    <div className="flex items-center justify-between text-xs text-foreground/50 dark:text-amber-100/40 font-bold uppercase tracking-wider mb-3">
                      <span>Sunrise (6:00 AM)</span>
                      <span className="text-amber-600 dark:text-amber-400 font-mono font-black">{time.display}</span>
                      <span>Sunset (6:00 PM)</span>
                    </div>
                    
                    <Slider
                      id="sundial-slider"
                      min={0}
                      max={720}
                      step={6} // Stepping by 6 mins aligns perfectly with the bead markers
                      value={[sliderValue]}
                      onValueChange={v => setSliderValue(v[0])}
                      className="my-3 accent-amber-500"
                    />
                    
                    <p className="text-[10px] text-center text-foreground/50 dark:text-amber-100/30 leading-snug">
                      *Note: Each step shifts the slider by exactly 6 minutes, aligning the shadow with the next bead on the temple wheel.
                    </p>
                  </div>
                </>
              ) : (
                <div className="space-y-5 text-sm leading-relaxed font-light text-foreground/80 dark:text-amber-100/70">
                  <div className="border-b border-border/50 dark:border-[#c49a5e]/10 pb-3 flex items-center justify-between">
                    <h3 className="font-bold text-amber-700 dark:text-amber-400">Reading the Sundial of Surya Temple</h3>
                    <span className="text-xs text-foreground/50 dark:text-amber-100/40">Step-by-Step Guide</span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/20 flex items-center justify-center font-bold text-amber-600 dark:text-amber-400 shrink-0">1</div>
                      <div>
                        <h4 className="font-bold text-foreground text-base">Find the Shadow</h4>
                        <p className="text-xs text-foreground/70 dark:text-amber-100/50 mt-1">Look at the shadow cast by the central gnomon. The wheel is designed horizontally on the temple plinth, functioning with the sun's altitude angle.</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/20 flex items-center justify-center font-bold text-amber-600 dark:text-amber-400 shrink-0">2</div>
                      <div>
                        <h4 className="font-bold text-foreground text-base">Identify the Major Spoke</h4>
                        <p className="text-xs text-foreground/70 dark:text-amber-100/50 mt-1">There are 8 major spokes on the wheel. Each major spoke represents a 3-hour period (Prahara) starting from Sunrise (6:00 AM). Find the last spoke the shadow has passed clockwise.</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/20 flex items-center justify-center font-bold text-amber-600 dark:text-amber-400 shrink-0">3</div>
                      <div>
                        <h4 className="font-bold text-foreground text-base">Count the Beads</h4>
                        <p className="text-xs text-foreground/70 dark:text-amber-100/50 mt-1">The outer rim features 30 beads between each major spoke. Each bead signifies exactly 6 minutes. Count the beads starting from the base major spoke to the shadow tip.</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/20 flex items-center justify-center font-bold text-amber-600 dark:text-amber-400 shrink-0">4</div>
                      <div>
                        <h4 className="font-bold text-foreground text-base">Add the Minutes</h4>
                        <p className="text-xs text-foreground/70 dark:text-amber-100/50 mt-1">Multiply the bead count by 6 and add it to the base spoke's time. This delivers a solar time accurate to the minute, used by Vedic priests for millennia.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 dark:bg-[#c49a5e]/5 border border-amber-200 dark:border-[#c49a5e]/25 rounded-2xl p-5 mt-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-1.5">
                      <Info className="w-4 h-4" /> Historical Astronomy Note
                    </h4>
                    <p className="text-xs text-foreground/70 dark:text-amber-100/60 leading-relaxed font-light">
                      The Konark temple is shaped like a giant solar chariot with <strong>24 wheels</strong> representing the fortnights of the year, pulled by <strong>7 horses</strong> representing the days of the week. The precision of the carvings represents the apex of astronomical observation in 13th-century India.
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>

      {/* Praharas schedule reference grid */}
      <div className="container mx-auto px-4 mt-12 max-w-6xl relative z-10">
        <div className="bg-white/70 dark:bg-black/40 border border-border/50 dark:border-[#c49a5e]/15 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-xl dark:shadow-none">
          <h3 className="text-sm font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest mb-6 text-center">
            The 4 Day-Praharas (6:00 AM - 6:00 PM)
          </h3>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {PRAHARAS.map((p, i) => {
              const isActive = nearestSpokeIdx === i;
              return (
                <div 
                  key={p.name} 
                  className={`border rounded-2xl p-5 text-center transition-all duration-300 ${
                    isActive 
                      ? "border-amber-400 dark:border-amber-400 bg-amber-50 dark:bg-amber-400/5 shadow-[0_0_12px_rgba(245,158,11,0.1)] scale-[1.02]" 
                      : "border-black/10 dark:border-white/5 opacity-55 hover:opacity-75"
                  }`}
                >
                  <div className="text-3xl mb-2">{["🌅", "📿", "☀️", "🌇"][i]}</div>
                  <h4 className="font-bold text-foreground text-base">{p.name}</h4>
                  <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold font-mono mt-1">{p.time}</div>
                  <p className="text-[11px] text-foreground/50 dark:text-amber-100/40 mt-2 leading-relaxed font-light">
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default SundialSimulator;
