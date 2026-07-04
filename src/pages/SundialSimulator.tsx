import { useState, useRef, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Slider } from "@/components/ui/slider";
import { Sun, Clock, Info } from "lucide-react";

// ── Constants ──────────────────────────────────────────────────────────────────
const SPOKES = 24; // 24 spokes = 24 hours of the day (2 rotations)
const PRAHARAS = ["Brahma Muhurta", "Pratah", "Sangava", "Madhyahna", "Aparahna", "Sayahna", "Pradosha", "Nisha"];
const TIME_LABELS = ["6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM"];

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
  // Solar noon (12:00) = 0 degrees; 6AM = -90°; 6PM = +90°
  const progress = (sliderValue / 720) * 180 - 90; // -90 to +90
  return progress;
}

function getPrahara(hours: number) {
  if (hours < 6) return PRAHARAS[7];
  if (hours < 7.5) return PRAHARAS[0];
  if (hours < 9) return PRAHARAS[1];
  if (hours < 10.5) return PRAHARAS[2];
  if (hours < 12) return PRAHARAS[3];
  if (hours < 13.5) return PRAHARAS[4];
  if (hours < 15) return PRAHARAS[5];
  if (hours < 16.5) return PRAHARAS[6];
  return PRAHARAS[7];
}

function getSunPosition(sliderValue: number) {
  // Sun arc from left (6AM) to right (6PM), peaks at top (noon)
  const t = sliderValue / 720; // 0 to 1
  const x = t * 100; // percentage across
  // Arc: y = sin(t*π) * 60, inverted (top = low y)
  const y = 80 - Math.sin(t * Math.PI) * 70;
  return { x, y };
}

// ── SVG Wheel ─────────────────────────────────────────────────────────────────
const KonarkWheel = ({ shadowAngle, timeValue }: { shadowAngle: number; timeValue: number }) => {
  const cx = 200, cy = 200, r = 150, hubR = 24;
  const spokeLength = r - hubR - 12;

  const isNoon = Math.abs(timeValue - 360) < 15;
  const isMorning = timeValue < 360;

  return (
    <svg viewBox="0 0 400 400" className="w-full max-w-[420px] mx-auto select-none">
      <defs>
        {/* Outer glow */}
        <filter id="outerGlow">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        {/* Shadow blur */}
        <filter id="shadowBlur">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        {/* Stone texture gradient */}
        <radialGradient id="stoneGrad" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#b5916a" />
          <stop offset="60%" stopColor="#8b6347" />
          <stop offset="100%" stopColor="#5c3d21" />
        </radialGradient>
        <radialGradient id="hubGrad" cx="30%" cy="30%">
          <stop offset="0%" stopColor="#d4a96a" />
          <stop offset="100%" stopColor="#7a4f2b" />
        </radialGradient>
        {/* Shadow gradient */}
        <linearGradient id="shadowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(0,0,0,0)" />
          <stop offset="30%" stopColor="rgba(0,0,0,0.7)" />
          <stop offset="70%" stopColor="rgba(0,0,0,0.7)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </linearGradient>
      </defs>

      {/* Ground plate */}
      <ellipse cx={cx} cy={cy + 155} rx={160} ry={16} fill="rgba(0,0,0,0.18)" filter="url(#shadowBlur)" />

      {/* Outer decorative ring segments */}
      {Array.from({ length: SPOKES }).map((_, i) => {
        const angle = (i / SPOKES) * 360;
        const rad = (angle - 90) * Math.PI / 180;
        const x1 = cx + (r - 2) * Math.cos(rad);
        const y1 = cy + (r - 2) * Math.sin(rad);
        const x2 = cx + (r + 10) * Math.cos(rad);
        const y2 = cy + (r + 10) * Math.sin(rad);
        return <line key={`tick-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#c49a5e" strokeWidth="2" opacity="0.6" />;
      })}

      {/* Main outer rim */}
      <circle cx={cx} cy={cy} r={r + 12} fill="none" stroke="#c49a5e" strokeWidth="6" opacity="0.4" />
      <circle cx={cx} cy={cy} r={r} fill="url(#stoneGrad)" stroke="#c49a5e" strokeWidth="4" />
      <circle cx={cx} cy={cy} r={r - 8} fill="none" stroke="#d4a96a" strokeWidth="1" opacity="0.4" />

      {/* Hour markings on rim */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * 360 - 90;
        const rad = angle * Math.PI / 180;
        const tx = cx + (r - 18) * Math.cos(rad);
        const ty = cy + (r - 18) * Math.sin(rad);
        const label = i === 0 ? "12" : `${i}`;
        return (
          <text key={`hr-${i}`} x={tx} y={ty} textAnchor="middle" dominantBaseline="middle"
            fontSize="9" fill="#f5deb3" opacity="0.7" fontFamily="serif">
            {label}
          </text>
        );
      })}

      {/* 24 Spokes */}
      {Array.from({ length: SPOKES }).map((_, i) => {
        const angle = (i / SPOKES) * 360 - 90;
        const rad = angle * Math.PI / 180;
        const x1 = cx + hubR * Math.cos(rad);
        const y1 = cy + hubR * Math.sin(rad);
        const x2 = cx + (hubR + spokeLength) * Math.cos(rad);
        const y2 = cy + (hubR + spokeLength) * Math.sin(rad);
        const isCardinal = i % 6 === 0;
        return (
          <line key={`spoke-${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={isCardinal ? "#f0c060" : "#c49a5e"}
            strokeWidth={isCardinal ? 3 : 1.5}
            opacity={isCardinal ? 0.9 : 0.55}
          />
        );
      })}

      {/* ── Shadow cast by gnomon ── */}
      {(() => {
        const t = timeValue / 720; // 0–1
        const shadowLen = 100 * (1 - 0.6 * Math.sin(t * Math.PI)); // longer at dawn/dusk
        const shadowRad = (shadowAngle - 90) * Math.PI / 180; // offset for orientation
        const sx = cx + shadowLen * Math.cos(shadowRad);
        const sy = cy + shadowLen * Math.sin(shadowRad);
        return (
          <g opacity="0.75">
            <line x1={cx} y1={cy} x2={sx} y2={sy}
              stroke="rgba(0,0,0,0.6)" strokeWidth="8" strokeLinecap="round"
              filter="url(#shadowBlur)" />
            <line x1={cx} y1={cy} x2={sx} y2={sy}
              stroke="rgba(30,30,30,0.5)" strokeWidth="4" strokeLinecap="round" />
            {/* Shadow tip indicator */}
            <circle cx={sx} cy={sy} r={4} fill="rgba(0,0,0,0.4)" filter="url(#shadowBlur)" />
            {/* Spoke highlight where shadow lands */}
            <circle cx={sx} cy={sy} r={5} fill="none" stroke="#f0c060" strokeWidth="1.5" opacity="0.8" />
          </g>
        );
      })()}

      {/* Hub */}
      <circle cx={cx} cy={cy} r={hubR} fill="url(#hubGrad)" stroke="#f0c060" strokeWidth="3" filter="url(#outerGlow)" />
      <circle cx={cx} cy={cy} r={8} fill="#f0c060" opacity="0.6" />

      {/* Gnomon (vertical rod casting shadow) */}
      <line x1={cx} y1={cy} x2={cx} y2={cy - 44} stroke="#f0c060" strokeWidth="3" strokeLinecap="round" filter="url(#outerGlow)" />
      <circle cx={cx} cy={cy - 44} r={4} fill="#fbbf24" filter="url(#outerGlow)" />

      {/* Sun position indicator */}
      {(() => {
        const sunPos = getSunPosition(timeValue);
        const sunX = 30 + sunPos.x * 3.4;
        const sunY = sunPos.y * 1.2;
        return (
          <g>
            {/* Arc path for sun */}
            <path d={`M 20 ${cy + 120} Q ${cx} ${cy - 180} ${380} ${cy + 120}`}
              fill="none" stroke="rgba(251,191,36,0.2)" strokeWidth="1" strokeDasharray="4 4" />
            {/* Sun circle */}
            <circle cx={sunX} cy={sunY} r={14}
              fill={isNoon ? "#fbbf24" : isMorning ? "#fb923c" : "#f97316"}
              filter="url(#outerGlow)" opacity="0.9" />
            {/* Sun rays */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => {
              const rad = deg * Math.PI / 180;
              return <line key={`ray-${deg}`} x1={sunX + 15 * Math.cos(rad)} y1={sunY + 15 * Math.sin(rad)}
                x2={sunX + 20 * Math.cos(rad)} y2={sunY + 20 * Math.sin(rad)}
                stroke="#fbbf24" strokeWidth="1.5" opacity="0.6" />;
            })}
          </g>
        );
      })()}

      {/* Prahara arc label */}
      <text x={cx} y={cy + r + 28} textAnchor="middle" fontSize="10" fill="#f5deb3" opacity="0.8" fontFamily="serif">
        ◦ Konark Sun Temple Sundial Wheel ◦
      </text>
    </svg>
  );
};

// ── Page ───────────────────────────────────────────────────────────────────────
const SundialSimulator = () => {
  const [sliderValue, setSliderValue] = useState(180); // Defaults to 9 AM
  const time = getTimeFromSlider(sliderValue);
  const shadowAngle = getShadowAngle(sliderValue);
  const prahara = getPrahara(time.hours + time.minutes / 60);
  const minuteAngle = Math.round(((sliderValue % 30) / 30) * 60);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="relative pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 pt-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-sm text-amber-400 mb-6 font-medium">
            <Sun className="w-4 h-4" /> Konark Solar Sundial Simulator
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight">
            <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent">Ancient Timekeeping</span>
            <br /><span className="text-foreground/80 text-3xl md:text-4xl">of the Sun Temple Wheels</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base leading-relaxed mb-8">
            The 24 spokes of each Konark wheel represent the 24 hours of the day. The gnomon (center rod) casts a shadow that ancient priests read to determine time accurate to the minute. Drag the slider to simulate.
          </p>
        </div>

        {/* Main simulation */}
        <div className="container mx-auto px-4 pb-16">
          <div className="grid lg:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">

            {/* Wheel visualization */}
            <div className="glass-card rounded-3xl p-6">
              <KonarkWheel shadowAngle={shadowAngle} timeValue={sliderValue} />
            </div>

            {/* Info panel */}
            <div className="space-y-4">
              {/* Time display */}
              <div className="glass-card rounded-2xl p-6 text-center">
                <div className="text-6xl font-bold font-mono bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent mb-1">
                  {time.display}
                </div>
                <div className="text-sm text-muted-foreground">Current Simulated Time</div>
                <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-sm font-medium">
                  <Sun className="w-4 h-4" />
                  {prahara} Prahara
                </div>
              </div>

              {/* Shadow reading */}
              <div className="glass-card rounded-2xl p-5">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" /> Shadow Reading
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-xl p-3">
                    <div className="text-xs text-muted-foreground mb-1">Shadow Angle</div>
                    <div className="text-xl font-bold text-primary">{Math.abs(Math.round(shadowAngle))}°</div>
                    <div className="text-xs text-muted-foreground">{shadowAngle < 0 ? "West" : "East"}</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <div className="text-xs text-muted-foreground mb-1">Minute Indicator</div>
                    <div className="text-xl font-bold text-amber-400">{minuteAngle}′</div>
                    <div className="text-xs text-muted-foreground">spoke divisions</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 col-span-2">
                    <div className="text-xs text-muted-foreground mb-1">Spoke Position</div>
                    <div className="text-sm font-medium">
                      Spoke {Math.round((Math.abs(shadowAngle) / 360) * SPOKES + 6) % SPOKES + 1} of {SPOKES}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">Each spoke = {Math.round(60 * 24 / SPOKES)} minutes</div>
                  </div>
                </div>
              </div>

              {/* Time slider */}
              <div className="glass-card rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">6:00 AM</span>
                  <span className="text-sm font-semibold text-primary">{time.display}</span>
                  <span className="text-sm text-muted-foreground">6:00 PM</span>
                </div>
                <Slider id="sundial-slider" min={0} max={720} step={1} value={[sliderValue]}
                  onValueChange={v => setSliderValue(v[0])} className="my-2" />
                <div className="flex justify-between mt-2">
                  {TIME_LABELS.map((l, i) => (
                    <span key={i} className={`text-[9px] ${i === 6 ? "text-amber-400 font-semibold" : "text-muted-foreground"}`}>{i === 6 ? "Noon" : ""}</span>
                  ))}
                </div>
              </div>

              {/* Did you know */}
              <div className="glass-card rounded-2xl p-4 border-l-2 border-amber-500/50">
                <div className="flex items-start gap-3">
                  <Info className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-amber-400 mb-1">Astronomical Fact</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      The Konark Sun Temple has <strong>12 pairs of wheels</strong> representing the 12 months. Each wheel has 8 major spokes (8 Praharas of 3 hours each) and 8 minor spokes, creating a 24-spoke sundial accurate to <strong>1.5 minutes</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Prahara reference */}
          <div className="max-w-5xl mx-auto mt-8">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 text-center">The 8 Praharas of the Day</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PRAHARAS.map((p, i) => {
                const startHour = 6 + i * 1.5;
                const endHour = startHour + 1.5;
                const isActive = (time.hours + time.minutes / 60) >= startHour && (time.hours + time.minutes / 60) < endHour;
                return (
                  <div key={p} className={`glass-card rounded-xl p-3 text-center transition-all duration-300 ${isActive ? "border-amber-500/40 bg-amber-500/10" : "opacity-60"}`}>
                    <div className="text-lg mb-1">{["🌙", "🌅", "🌄", "☀️", "🌤️", "🌇", "🌆", "🌃"][i]}</div>
                    <div className={`text-xs font-semibold ${isActive ? "text-amber-400" : "text-foreground/70"}`}>{p}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{startHour}:00 – {endHour}:00</div>
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
