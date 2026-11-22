import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Music, Sparkles, ChevronDown, ChevronUp, Sliders, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface SoundscapeTheme {
  id: string;
  name: string;
  location: string;
  bellFreq: number; // Hz
  waveInterval: number; // seconds
}

const THEMES: SoundscapeTheme[] = [
  { id: "konark", name: "Konark Dawn Bells", location: "Sun Temple, Puri", bellFreq: 261.63, waveInterval: 4.5 },
  { id: "puri", name: "Puri Sacred Waves", location: "Golden Beach", bellFreq: 329.63, waveInterval: 3.2 },
  { id: "dhauli", name: "Dhauli Peace Chime", location: "Shanti Stupa", bellFreq: 440.00, waveInterval: 6.0 },
];

export const AmbientSoundscapeWidget = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<SoundscapeTheme>(THEMES[0]);
  const [expanded, setExpanded] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [dismissed, setDismissed] = useState(false);

  // Web Audio Context refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const bellTimerRef = useRef<number | null>(null);
  const waveTimerRef = useRef<number | null>(null);

  // Initialize Web Audio Context on first interaction
  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return null;
      const ctx = new AudioCtx();
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume, ctx.currentTime);
      masterGain.connect(ctx.destination);

      audioCtxRef.current = ctx;
      masterGainRef.current = masterGain;
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Synthesize a soothing resonant temple bell chime
  const playBell = (freq: number) => {
    const ctx = audioCtxRef.current;
    const master = masterGainRef.current;
    if (!ctx || !master) return;

    const osc = ctx.createOscillator();
    const bellGain = ctx.createGain();

    // Subtle overtone richness
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    const now = ctx.currentTime;
    bellGain.gain.setValueAtTime(0.001, now);
    bellGain.gain.exponentialRampToValueAtTime(0.35 * volume, now + 0.05);
    bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

    osc.connect(bellGain);
    bellGain.connect(master);

    osc.start(now);
    osc.stop(now + 4.0);
  };

  // Synthesize gentle ocean wave breeze (bandpass filtered white noise)
  const playOceanWave = () => {
    const ctx = audioCtxRef.current;
    const master = masterGainRef.current;
    if (!ctx || !master) return;

    const bufferSize = ctx.sampleRate * 3.5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(320, ctx.currentTime);
    filter.Q.setValueAtTime(1.8, ctx.currentTime);

    const waveGain = ctx.createGain();
    const now = ctx.currentTime;

    // Swell and recede
    waveGain.gain.setValueAtTime(0.0001, now);
    waveGain.gain.linearRampToValueAtTime(0.18 * volume, now + 1.8);
    waveGain.gain.linearRampToValueAtTime(0.0001, now + 3.4);

    noise.connect(filter);
    filter.connect(waveGain);
    waveGain.connect(master);

    noise.start(now);
    noise.stop(now + 3.5);
  };

  const toggleSound = () => {
    if (isPlaying) {
      if (bellTimerRef.current) clearInterval(bellTimerRef.current);
      if (waveTimerRef.current) clearInterval(waveTimerRef.current);
      setIsPlaying(false);
      toast.info("Ambient soundscape paused");
    } else {
      const ctx = initAudio();
      if (!ctx) {
        toast.error("Web Audio not supported in this browser");
        return;
      }
      setIsPlaying(true);
      toast.success(`Playing: ${selectedTheme.name}`, {
        description: `Binaural soundscape inspired by ${selectedTheme.location}`,
      });

      // Play immediate chime
      playBell(selectedTheme.bellFreq);
      playOceanWave();

      // Recurring periodic schedule
      bellTimerRef.current = window.setInterval(() => {
        playBell(selectedTheme.bellFreq);
      }, 5500);

      waveTimerRef.current = window.setInterval(() => {
        playOceanWave();
      }, selectedTheme.waveInterval * 1000);
    }
  };

  // Adjust volume
  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (bellTimerRef.current) clearInterval(bellTimerRef.current);
      if (waveTimerRef.current) clearInterval(waveTimerRef.current);
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  if (dismissed) {
    return (
      <div className="fixed bottom-20 left-4 z-40">
        <button
          onClick={() => setDismissed(false)}
          className="w-9 h-9 rounded-full glass-card border border-white/20 shadow-xl flex items-center justify-center text-muted-foreground hover:text-primary transition-all hover:scale-105 bg-slate-900/80 backdrop-blur-md"
          title="Open Heritage Audio"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-20 left-4 z-40">
      <div className="relative rounded-2xl glass-card border border-white/15 dark:border-white/10 shadow-2xl backdrop-blur-2xl p-2.5 transition-all duration-300 max-w-xs">
        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleSound}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              isPlaying
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105"
                : "bg-white/10 hover:bg-white/20 text-muted-foreground hover:text-foreground"
            }`}
            title={isPlaying ? "Pause Soundscape" : "Play Heritage Soundscape"}
          >
            {isPlaying ? (
              <Volume2 className="w-4 h-4 animate-pulse" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          <div className="cursor-pointer" onClick={() => setExpanded(!expanded)}>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-foreground truncate max-w-[120px]">
                {selectedTheme.name.split(" ")[0]} Ambient
              </span>
              {isPlaying && (
                <span className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 h-full bg-primary animate-[bounce_1s_infinite_100ms] rounded-full" />
                  <span className="w-0.5 h-3/4 bg-primary animate-[bounce_1s_infinite_300ms] rounded-full" />
                  <span className="w-0.5 h-1/2 bg-primary animate-[bounce_1s_infinite_200ms] rounded-full" />
                </span>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground font-mono">
              {isPlaying ? "Live Binaural Audio" : "Tap to listen"}
            </p>
          </div>

          <div className="flex items-center gap-0.5 ml-auto">
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1 text-muted-foreground hover:text-foreground transition-transform"
              title={expanded ? "Collapse" : "Expand settings"}
            >
              {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="p-1 text-muted-foreground/60 hover:text-foreground transition-colors"
              title="Minimize player"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Expanded Controls Drawer */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-white/10 space-y-2.5 text-xs">
            <div>
              <span className="text-[10px] font-mono uppercase text-muted-foreground block mb-1.5">
                Soundscape Atmosphere:
              </span>
              <div className="space-y-1">
                {THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => {
                      setSelectedTheme(theme);
                      if (isPlaying) {
                        playBell(theme.bellFreq);
                      }
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                      selectedTheme.id === theme.id
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : "hover:bg-white/5 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <p className="font-semibold">{theme.name}</p>
                    <p className="text-[9px] opacity-70">{theme.location}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Volume Slider */}
            <div>
              <div className="flex justify-between text-[10px] text-muted-foreground font-mono mb-1">
                <span>Volume</span>
                <span>{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.8"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AmbientSoundscapeWidget;