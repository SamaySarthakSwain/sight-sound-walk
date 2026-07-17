import { useEffect, useRef, useState } from "react";
import { Waves, Play, Pause } from "lucide-react";
import MorePageShell from "@/components/MorePageShell";

/** Simple procedural 3D audio demo using WebAudio PannerNode.
 *  Two oscillators represent temple bells and ocean waves; user rotates the listener. */
const SpatialAudio = () => {
  const ctxRef = useRef<AudioContext | null>(null);
  const bellsRef = useRef<PannerNode | null>(null);
  const wavesRef = useRef<PannerNode | null>(null);
  const oscsRef = useRef<AudioNode[]>([]);
  const [playing, setPlaying] = useState(false);
  const [angle, setAngle] = useState(0);

  const start = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    const ctx: AudioContext = ctxRef.current ?? new AC();
    ctxRef.current = ctx;
    if (ctx.state === "suspended") ctx.resume();

    // Bells: warm plucked triangle
    const bellOsc = ctx.createOscillator();
    bellOsc.type = "triangle";
    bellOsc.frequency.value = 660;
    const bellGain = ctx.createGain();
    bellGain.gain.value = 0.08;
    const bellLfo = ctx.createOscillator();
    bellLfo.frequency.value = 0.5;
    const bellLfoGain = ctx.createGain();
    bellLfoGain.gain.value = 0.06;
    bellLfo.connect(bellLfoGain).connect(bellGain.gain);
    const bellPan = ctx.createPanner();
    bellPan.panningModel = "HRTF";
    bellPan.positionX.value = 3;
    bellPan.positionZ.value = -1;
    bellOsc.connect(bellGain).connect(bellPan).connect(ctx.destination);

    // Waves: filtered noise
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuf = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) d[i] = (Math.random() * 2 - 1) * 0.4;
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuf;
    noise.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 500;
    const waveGain = ctx.createGain();
    waveGain.gain.value = 0.35;
    const wavePan = ctx.createPanner();
    wavePan.panningModel = "HRTF";
    wavePan.positionX.value = -3;
    wavePan.positionZ.value = 1;
    noise.connect(lp).connect(waveGain).connect(wavePan).connect(ctx.destination);

    bellsRef.current = bellPan;
    wavesRef.current = wavePan;
    bellOsc.start();
    bellLfo.start();
    noise.start();
    oscsRef.current = [bellOsc, bellLfo, noise];
    setPlaying(true);
  };

  const stop = () => {
    oscsRef.current.forEach((o) => { try { (o as OscillatorNode).stop?.(); } catch { /* noop */ } });
    oscsRef.current = [];
    setPlaying(false);
  };

  useEffect(() => stop, []);

  const rotate = (deg: number) => {
    setAngle(deg);
    const ctx = ctxRef.current;
    if (!ctx) return;
    const rad = (deg * Math.PI) / 180;
    ctx.listener.forwardX?.setValueAtTime(Math.sin(rad), ctx.currentTime);
    ctx.listener.forwardZ?.setValueAtTime(-Math.cos(rad), ctx.currentTime);
  };

  return (
    <MorePageShell
      title="Spatial Audio"
      subtitle="Rotate the listener — hear bells and waves shift around you."
      icon={Waves}
      badge="Beta"
    >
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-8 backdrop-blur-xl">
          <div className="relative mx-auto aspect-square w-56">
            <div className="absolute inset-0 rounded-full border border-white/10" />
            <div className="absolute inset-6 rounded-full border border-primary/20" />
            <div
              className="absolute left-1/2 top-1/2 h-20 w-1 -translate-x-1/2 -translate-y-full rounded-full bg-primary origin-bottom transition-transform"
              style={{ transform: `translate(-50%, -100%) rotate(${angle}deg)` }}
            />
            <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 ring-2 ring-primary" />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-primary/70">🔔</div>
            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-primary/70">🌊</div>
          </div>

          <input
            type="range"
            min={-180}
            max={180}
            value={angle}
            onChange={(e) => rotate(Number(e.target.value))}
            className="w-full accent-primary"
          />

          <div className="mt-6 flex justify-center">
            <button
              onClick={playing ? stop : start}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
            >
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {playing ? "Stop" : "Start soundscape"}
            </button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground text-center">Use headphones for the full 3D effect.</p>
      </div>
    </MorePageShell>
  );
};

export default SpatialAudio;
