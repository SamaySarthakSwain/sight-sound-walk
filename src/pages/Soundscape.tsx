import { useState, useRef, useEffect, useCallback } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Volume2, VolumeX, Play, Pause, Waves, Music2, Wind, CloudRain, Hammer, Flame, Headphones } from "lucide-react";

interface SoundChannel {
  id: string; label: string; description: string;
  emoji: string; Icon: React.ElementType;
  color: string; frequency: number; waveType: OscillatorType;
  noiseType?: "white" | "pink" | "brown"; isNoise?: boolean;
}

const CHANNELS: SoundChannel[] = [
  { id: "ancient", label: "Ancient Echoes", description: "Chisels, stone, workers chanting — 1250 AD", emoji: "⚒️", Icon: Hammer, color: "from-amber-500/20 to-orange-500/20", frequency: 180, waveType: "sawtooth", isNoise: true, noiseType: "brown" },
  { id: "chants", label: "Sacred Chants", description: "Odissi flute, cymbal chimes, Vedic conch", emoji: "🪗", Icon: Music2, color: "from-purple-500/20 to-violet-500/20", frequency: 432, waveType: "sine" },
  { id: "coastal", label: "Coastal Nature", description: "Ocean waves on Konark's ancient shoreline", emoji: "🌊", Icon: Waves, color: "from-cyan-500/20 to-blue-500/20", frequency: 60, waveType: "sine", isNoise: true, noiseType: "pink" },
  { id: "monsoon", label: "Monsoon Rain", description: "Rain on ancient stone, distant thunder", emoji: "🌧️", Icon: CloudRain, color: "from-slate-500/20 to-indigo-500/20", frequency: 80, waveType: "sine", isNoise: true, noiseType: "white" },
  { id: "fire", label: "Temple Flames", description: "Sacred dhupa fires, flickering lamp flames", emoji: "🔥", Icon: Flame, color: "from-red-500/20 to-amber-500/20", frequency: 100, waveType: "triangle", isNoise: true, noiseType: "brown" },
  { id: "wind", label: "Sacred Wind", description: "Sea-breeze through stone corridors", emoji: "🍃", Icon: Wind, color: "from-green-500/20 to-teal-500/20", frequency: 220, waveType: "triangle", isNoise: true, noiseType: "pink" },
];

const PRESETS = [
  { name: "✨ All Silent", volumes: [0, 0, 0, 0, 0, 0] },
  { name: "⚒️ Construction Era", volumes: [80, 20, 10, 0, 30, 10] },
  { name: "🕌 Puja Time", volumes: [0, 90, 10, 0, 60, 20] },
  { name: "🌊 Coastal Dawn", volumes: [0, 30, 80, 20, 0, 60] },
  { name: "⛈️ Monsoon Night", volumes: [10, 0, 40, 90, 0, 40] },
  { name: "🌅 Full Immersion", volumes: [40, 60, 50, 20, 40, 50] },
];

function createNoiseBuffer(ctx: AudioContext, type: "white" | "pink" | "brown"): AudioBuffer {
  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = buffer.getChannelData(0);
  if (type === "white") {
    for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;
  } else if (type === "pink") {
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const w = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759;
      b2 = 0.96900 * b2 + w * 0.1538520; b3 = 0.86650 * b3 + w * 0.3104856;
      b4 = 0.55000 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + w * 0.5362) * 0.11;
    }
  } else {
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const w = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * w) / 1.02; lastOut = output[i]; output[i] *= 3.5;
    }
  }
  return buffer;
}

const Soundscape = () => {
  const [volumes, setVolumes] = useState<number[]>(CHANNELS.map(() => 0));
  const [masterVolume, setMasterVolume] = useState(75);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [showPresets, setShowPresets] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodesRef = useRef<GainNode[]>([]);
  const masterGainRef = useRef<GainNode | null>(null);
  const sourceNodesRef = useRef<(AudioBufferSourceNode | OscillatorNode)[]>([]);

  const stopAll = useCallback(() => {
    sourceNodesRef.current.forEach(n => { try { n.stop(); } catch { /* already stopped */ } });
    sourceNodesRef.current = []; gainNodesRef.current = []; masterGainRef.current = null;
  }, []);

  const startAudio = useCallback(() => {
    if (!audioCtxRef.current || audioCtxRef.current.state === "closed") audioCtxRef.current = new AudioContext();
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") ctx.resume();
    stopAll();
    const master = ctx.createGain();
    master.gain.value = masterVolume / 100;
    master.connect(ctx.destination);
    masterGainRef.current = master;
    CHANNELS.forEach((ch, i) => {
      const gainNode = ctx.createGain();
      gainNode.gain.value = volumes[i] / 100;
      gainNode.connect(master);
      gainNodesRef.current[i] = gainNode;
      if (ch.isNoise && ch.noiseType) {
        const src = ctx.createBufferSource();
        src.buffer = createNoiseBuffer(ctx, ch.noiseType);
        src.loop = true;
        src.connect(gainNode); src.start();
        sourceNodesRef.current[i] = src;
      } else {
        const osc = ctx.createOscillator();
        osc.type = ch.waveType; osc.frequency.value = ch.frequency;
        const g = ctx.createGain(); g.gain.value = 0.2;
        osc.connect(g); g.connect(gainNode); osc.start();
        sourceNodesRef.current[i] = osc;
      }
    });
  }, [stopAll, volumes, masterVolume]);

  useEffect(() => {
    if (isPlaying) gainNodesRef.current.forEach((g, i) => {
      if (g && audioCtxRef.current) g.gain.setTargetAtTime(volumes[i] / 100, audioCtxRef.current.currentTime, 0.1);
    });
  }, [volumes, isPlaying]);

  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current)
      masterGainRef.current.gain.setTargetAtTime(masterVolume / 100, audioCtxRef.current.currentTime, 0.1);
  }, [masterVolume]);

  const togglePlayback = () => {
    if (isPlaying) { stopAll(); setIsPlaying(false); }
    else { startAudio(); setIsPlaying(true); }
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setVolumes(preset.volumes); setActivePreset(preset.name); setShowPresets(false);
    if (isPlaying) preset.volumes.forEach((v, i) => {
      if (gainNodesRef.current[i] && audioCtxRef.current)
        gainNodesRef.current[i].gain.setTargetAtTime(v / 100, audioCtxRef.current.currentTime, 0.3);
    });
  };

  const setChannelVolume = (index: number, value: number[]) => {
    const newVols = [...volumes]; newVols[index] = value[0]; setVolumes(newVols); setActivePreset(null);
  };

  const totalActive = volumes.filter(v => v > 0).length;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="relative pt-20 pb-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 pt-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-sm text-amber-400 mb-6 font-medium">
            <Headphones className="w-4 h-4" />Heritage Soundscapes
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-600 bg-clip-text text-transparent">Hear History</span>
            <br /><span className="text-foreground/90">Come Alive</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-base md:text-lg leading-relaxed">
            Blend immersive ambient soundscapes from ancient Odisha. Layer sounds from the construction era, sacred rituals, coastal winds, and monsoon rains.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button id="soundscape-play-btn" onClick={togglePlayback}
              className={`relative flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${isPlaying ? "bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30" : "glass-button rounded-2xl text-white"}`}>
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isPlaying ? "Pause Soundscape" : "Begin Soundwalk"}
              {isPlaying && <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" /><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" /></span>}
            </button>
            <div className="flex items-center gap-3 glass-panel rounded-2xl px-5 py-3 min-w-[200px]">
              {masterVolume === 0 ? <VolumeX className="w-4 h-4 text-muted-foreground" /> : <Volume2 className="w-4 h-4 text-primary" />}
              <Slider min={0} max={100} step={1} value={[masterVolume]} onValueChange={v => setMasterVolume(v[0])} className="flex-1" />
              <span className="text-xs text-muted-foreground w-8 text-right">{masterVolume}%</span>
            </div>
          </div>
          {isPlaying && (
            <div className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              {totalActive} channel{totalActive !== 1 ? "s" : ""} active{activePreset && <span className="text-primary ml-1">· {activePreset}</span>}
            </div>
          )}
        </div>
      </div>

      {/* Presets */}
      <div className="container mx-auto px-4 mb-6">
        <div className="relative inline-block">
          <Button variant="outline" className="gap-2 glass-panel border-white/10" onClick={() => setShowPresets(!showPresets)}>
            🎼 Quick Presets ▾
          </Button>
          {showPresets && (
            <div className="absolute top-12 left-0 z-20 glass-panel rounded-2xl p-3 grid grid-cols-2 gap-2 min-w-[280px] border border-white/10">
              {PRESETS.map(p => (
                <button key={p.name} onClick={() => applyPreset(p)}
                  className={`text-left px-3 py-2 rounded-xl text-sm transition-all duration-200 ${activePreset === p.name ? "bg-primary/20 text-primary border border-primary/30" : "hover:bg-white/5 text-foreground/70 hover:text-foreground"}`}>
                  {p.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Channels Grid */}
      <div className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CHANNELS.map((channel, i) => {
            const vol = volumes[i]; const isActive = vol > 0 && isPlaying;
            return (
              <div key={channel.id} className={`relative glass-card rounded-2xl p-5 transition-all duration-500 glow-card ${isActive ? "border-white/20" : "border-white/5"}`}>
                {isActive && <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${channel.color} opacity-60 transition-opacity duration-500`} />}
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all duration-300 ${isActive ? "bg-primary/20" : "bg-white/5 text-muted-foreground"}`}>{channel.emoji}</div>
                      <div>
                        <h3 className="font-semibold text-sm">{channel.label}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5 max-w-[140px] leading-snug">{channel.description}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-mono font-bold px-2 py-1 rounded-lg ${vol > 0 ? "bg-primary/20 text-primary" : "bg-white/5 text-muted-foreground"}`}>{vol}</span>
                  </div>
                  {isActive && (
                    <div className="flex items-end gap-0.5 h-5 mb-3">
                      {Array.from({ length: 10 }).map((_, b) => (
                        <div key={b} className="flex-1 bg-primary/60 rounded-full animate-pulse" style={{ height: `${30 + Math.random() * 70}%`, animationDelay: `${b * 0.1}s` }} />
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <button onClick={() => setChannelVolume(i, [vol > 0 ? 0 : 65])} className="text-muted-foreground hover:text-primary transition-colors">
                      {vol === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <Slider min={0} max={100} step={1} value={[vol]} onValueChange={v => setChannelVolume(i, v)} className="flex-1" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-10 text-center glass-panel rounded-2xl p-6 max-w-xl mx-auto">
          <Headphones className="w-8 h-8 text-primary mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Best with Stereo Headphones</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">All audio is synthesized in real-time using the Web Audio API — no downloads needed. Each channel uses procedural noise generation and oscillators to create authentic atmospheric depth.</p>
        </div>
      </div>
    </div>
  );
};

export default Soundscape;
