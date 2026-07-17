import { useState } from "react";
import { Box, RotateCcw } from "lucide-react";
import MorePageShell from "@/components/MorePageShell";

const MODELS = [
  { id: "konark-wheel", name: "Konark Chariot Wheel", emoji: "☸", tint: "from-amber-500/30 to-orange-600/10" },
  { id: "jagannath-shikhara", name: "Jagannath Shikhara", emoji: "🛕", tint: "from-rose-500/30 to-primary/10" },
  { id: "lingaraj-tower", name: "Lingaraj Tower", emoji: "🕌", tint: "from-emerald-500/30 to-cyan-600/10" },
];

const Monument3D = () => {
  const [active, setActive] = useState(MODELS[0]);
  const [rotation, setRotation] = useState({ x: -12, y: 0 });
  const [dragging, setDragging] = useState(false);

  return (
    <MorePageShell
      title="3D Monument Viewer"
      subtitle="Drag to orbit. Photorealistic Gaussian-splat reconstructions are in the pipeline."
      icon={Box}
      badge="Beta"
    >
      <div className="mx-auto max-w-3xl space-y-4">
        <div
          className={`relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${active.tint} backdrop-blur-xl select-none cursor-grab ${dragging ? "cursor-grabbing" : ""}`}
          onPointerDown={(e) => { setDragging(true); (e.target as HTMLElement).setPointerCapture(e.pointerId); }}
          onPointerUp={() => setDragging(false)}
          onPointerMove={(e) => {
            if (!dragging) return;
            setRotation((r) => ({ x: Math.max(-45, Math.min(45, r.x - e.movementY * 0.5)), y: r.y + e.movementX * 0.5 }));
          }}
          style={{ perspective: "1000px" }}
        >
          <div
            className="flex h-56 w-56 items-center justify-center rounded-3xl bg-white/5 text-8xl shadow-[0_20px_60px_-15px] shadow-primary/50 transition-transform"
            style={{
              transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
              transformStyle: "preserve-3d",
            }}
          >
            {active.emoji}
          </div>
          <button
            onClick={() => setRotation({ x: -12, y: 0 })}
            className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 backdrop-blur text-white hover:bg-black/60 transition"
            aria-label="Reset view"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {MODELS.map((m) => (
            <button
              key={m.id}
              onClick={() => { setActive(m); setRotation({ x: -12, y: 0 }); }}
              className={`rounded-2xl border p-4 text-left transition ${
                active.id === m.id ? "border-primary/50 bg-primary/10" : "border-white/10 bg-white/5 hover:bg-white/10"
              }`}
            >
              <div className="text-2xl">{m.emoji}</div>
              <div className="text-sm font-semibold mt-2">{m.name}</div>
            </button>
          ))}
        </div>
      </div>
    </MorePageShell>
  );
};

export default Monument3D;
