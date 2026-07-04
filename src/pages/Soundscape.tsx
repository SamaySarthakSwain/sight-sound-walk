import { useState, useRef, useEffect, useCallback } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Volume2, VolumeX, Play, Pause, Waves, Music2, Wind, CloudRain, Hammer, Flame, Headphones, Sparkles } from "lucide-react";

interface SoundChannel {
  id: string;
  label: string;
  description: string;
  emoji: string;
  Icon: React.ElementType;
  color: string;
  presetVolumes: number[];
}

const CHANNELS: SoundChannel[] = [
  { id: "ancient", label: "Ancient Echoes", description: "Stone carving chisels, hammers, and worker chants", emoji: "⚒️", Icon: Hammer, color: "from-amber-500/20 to-orange-500/20", presetVolumes: [0, 80, 10, 0, 30, 20] },
  { id: "chants", label: "Sacred Chants & Flute", description: "Echoing temple flute & slow meditative drone", emoji: "🪗", Icon: Music2, color: "from-purple-500/20 to-violet-500/20", presetVolumes: [0, 20, 95, 10, 0, 50] },
  { id: "coastal", label: "Coastal Nature", description: "Ocean waves rolling on Konark's ancient shoreline", emoji: "🌊", Icon: Waves, color: "from-cyan-500/20 to-blue-500/20", presetVolumes: [0, 10, 20, 85, 0, 60] },
  { id: "monsoon", label: "Monsoon Rain", description: "Rain pattering on stone with distant rumbling thunder", emoji: "🌧️", Icon: CloudRain, color: "from-slate-500/20 to-indigo-500/20", presetVolumes: [0, 0, 10, 30, 80, 40] },
  { id: "fire", label: "Temple Flames", description: "Sacred dhupa fires and crackling lamp flames", emoji: "🔥", Icon: Flame, color: "from-red-500/20 to-amber-500/20", presetVolumes: [0, 40, 60, 0, 0, 40] },
  { id: "wind", label: "Sacred Wind", description: "Sea-breeze whispering through stone corridors", emoji: "🍃", Icon: Wind, color: "from-green-500/20 to-teal-500/20", presetVolumes: [0, 10, 30, 60, 40, 80] },
];

const PRESETS = [
  { name: "✨ All Silent", volumes: [0, 0, 0, 0, 0, 0] },
  { name: "⚒️ Construction Era", volumes: [85, 20, 15, 0, 40, 20] },
  { name: "🕌 Puja & Meditation", volumes: [0, 90, 20, 0, 70, 30] },
  { name: "🌊 Coastal Dawn", volumes: [10, 40, 85, 20, 10, 70] },
  { name: "⛈️ Monsoon Night", volumes: [0, 10, 30, 90, 20, 50] },
  { name: "🌅 Complete Walk", volumes: [50, 75, 60, 30, 50, 60] },
];

// Helper to generate noise buffers
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
      output[i] = (lastOut + 0.02 * w) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // Compensate volume
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
  const [visualizerHeights, setVisualizerHeights] = useState<number[]>(CHANNELS.map(() => 0));

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodesRef = useRef<GainNode[]>([]);
  const masterGainRef = useRef<GainNode | null>(null);
  
  // Keep track of active synthesis resources for clean teardown
  const synthNodesRef = useRef<{ [key: string]: any[] }>({});
  const intervalsRef = useRef<any[]>([]);

  // Stop everything
  const stopAll = useCallback(() => {
    intervalsRef.current.forEach(i => clearInterval(i));
    intervalsRef.current = [];

    // Stop all audio nodes
    Object.keys(synthNodesRef.current).forEach(key => {
      synthNodesRef.current[key].forEach(node => {
        try {
          node.stop();
        } catch {}
        try {
          node.disconnect();
        } catch {}
      });
    });
    synthNodesRef.current = {};
    gainNodesRef.current = [];
    masterGainRef.current = null;
  }, []);

  // Initialize and schedule synthesizers
  const startAudio = useCallback(() => {
    if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    stopAll();

    // Create master gain
    const master = ctx.createGain();
    master.gain.value = masterVolume / 100;
    master.connect(ctx.destination);
    masterGainRef.current = master;

    // Create a reverb delay node simulating ancient stone temple acoustics
    const reverbDelay = ctx.createDelay();
    reverbDelay.delayTime.value = 0.6;
    const reverbFeedback = ctx.createGain();
    reverbFeedback.gain.value = 0.4;
    
    // Connect feedback loop
    reverbDelay.connect(reverbFeedback);
    reverbFeedback.connect(reverbDelay);
    reverbDelay.connect(master);

    // Initialize all 6 sound channels
    CHANNELS.forEach((ch, idx) => {
      const channelGain = ctx.createGain();
      channelGain.gain.value = volumes[idx] / 100;
      channelGain.connect(master);
      gainNodesRef.current[idx] = channelGain;

      synthNodesRef.current[ch.id] = [];

      // ── CHANNEL 1: ANCIENT ECHOES (⚒️ Hammers, Chisels, Worker Chants)
      if (ch.id === "ancient") {
        // Drone low chant
        const chantOsc = ctx.createOscillator();
        chantOsc.type = "sawtooth";
        chantOsc.frequency.value = 90; // Low frequency chant drone
        const chantFilter = ctx.createBiquadFilter();
        chantFilter.type = "lowpass";
        chantFilter.Q.value = 5;
        chantFilter.frequency.value = 160;

        const chantGain = ctx.createGain();
        chantGain.gain.value = 0.05; // soft drone

        chantOsc.connect(chantFilter);
        chantFilter.connect(chantGain);
        chantGain.connect(channelGain);
        chantOsc.start();
        synthNodesRef.current[ch.id].push(chantOsc);

        // Schedule random hammer hits on stone
        const triggerHammer = () => {
          if (!isPlaying && audioCtxRef.current?.state !== "running") return;
          const hitTime = ctx.currentTime;
          
          // Chisel ping
          const pingOsc = ctx.createOscillator();
          pingOsc.type = "sine";
          // Random frequency representing different size chisels
          pingOsc.frequency.setValueAtTime(1200 + Math.random() * 800, hitTime);
          
          const pingGain = ctx.createGain();
          pingGain.gain.setValueAtTime(0, hitTime);
          pingGain.gain.linearRampToValueAtTime(0.08, hitTime + 0.005);
          pingGain.gain.exponentialRampToValueAtTime(0.0001, hitTime + 0.06);

          // Wood hammer thud (lower frequency thud)
          const thudOsc = ctx.createOscillator();
          thudOsc.type = "triangle";
          thudOsc.frequency.setValueAtTime(100 + Math.random() * 50, hitTime);
          
          const thudGain = ctx.createGain();
          thudGain.gain.setValueAtTime(0, hitTime);
          thudGain.gain.linearRampToValueAtTime(0.12, hitTime + 0.01);
          thudGain.gain.exponentialRampToValueAtTime(0.0001, hitTime + 0.15);

          // Route through echoing delay to sound like a stone worksite
          pingOsc.connect(pingGain);
          pingGain.connect(channelGain);
          pingGain.connect(reverbDelay); // feed to echo

          thudOsc.connect(thudGain);
          thudGain.connect(channelGain);

          pingOsc.start(hitTime);
          thudOsc.start(hitTime);
          
          pingOsc.stop(hitTime + 0.2);
          thudOsc.stop(hitTime + 0.2);
        };

        const interval = setInterval(() => {
          if (volumes[idx] > 10 && Math.random() > 0.3) {
            triggerHammer();
          }
        }, 900);
        intervalsRef.current.push(interval);
      }

      // ── CHANNEL 2: SACRED CHANTS (🪗 Flute & Meditative Raga Sequence)
      else if (ch.id === "chants") {
        // Meditative drone base
        const drone1 = ctx.createOscillator();
        drone1.type = "sine";
        drone1.frequency.value = 136.1; // Om/Sadhana frequency
        const drone2 = ctx.createOscillator();
        drone2.type = "triangle";
        drone2.frequency.value = 272.2; // octave up
        
        const droneFilter = ctx.createBiquadFilter();
        droneFilter.type = "lowpass";
        droneFilter.frequency.value = 350;
        
        const droneGain = ctx.createGain();
        droneGain.gain.value = 0.15;

        drone1.connect(droneFilter);
        drone2.connect(droneFilter);
        droneFilter.connect(droneGain);
        droneGain.connect(channelGain);
        
        drone1.start();
        drone2.start();
        synthNodesRef.current[ch.id].push(drone1, drone2);

        // Flute raga step sequencer (Pentatonic scale: C, D, Eb, G, Bb)
        const notes = [261.63, 293.66, 311.13, 392.00, 466.16, 523.25, 587.33, 622.25]; // Raga Shivaranjani notes
        let lastFreq = notes[0];

        const playFluteNote = () => {
          if (!isPlaying && audioCtxRef.current?.state !== "running") return;
          const now = ctx.currentTime;
          
          // Pick a random note from the raga
          const targetFreq = notes[Math.floor(Math.random() * notes.length)];
          
          const fluteOsc = ctx.createOscillator();
          fluteOsc.type = "sine";
          
          // Portamento (sliding pitch)
          fluteOsc.frequency.setValueAtTime(lastFreq, now);
          fluteOsc.frequency.exponentialRampToValueAtTime(targetFreq, now + 0.3);
          lastFreq = targetFreq;

          // Add breathiness (modulating noise)
          const breathNoise = ctx.createBufferSource();
          breathNoise.buffer = createNoiseBuffer(ctx, "pink");
          const breathFilter = ctx.createBiquadFilter();
          breathFilter.type = "bandpass";
          breathFilter.frequency.setValueAtTime(targetFreq, now);
          breathFilter.Q.value = 12;
          const breathGain = ctx.createGain();
          breathGain.gain.setValueAtTime(0.015, now);

          // Vibrato (pitch modulation)
          const vibrato = ctx.createOscillator();
          vibrato.frequency.value = 5.5; // 5.5 Hz vibrato
          const vibratoGain = ctx.createGain();
          vibratoGain.gain.value = 3.5; // depth in Hz
          
          vibrato.connect(vibratoGain);
          vibratoGain.connect(fluteOsc.frequency);

          // Flute volume envelope (slow attack, long release)
          const fluteGain = ctx.createGain();
          fluteGain.gain.setValueAtTime(0, now);
          fluteGain.gain.linearRampToValueAtTime(0.18, now + 0.4);
          fluteGain.gain.setValueAtTime(0.18, now + 1.2);
          fluteGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

          // Connect nodes
          fluteOsc.connect(fluteGain);
          
          breathNoise.connect(breathFilter);
          breathFilter.connect(breathGain);
          breathGain.connect(fluteGain);

          fluteGain.connect(channelGain);
          fluteGain.connect(reverbDelay); // route to sacred echo

          vibrato.start(now);
          fluteOsc.start(now);
          breathNoise.start(now);

          vibrato.stop(now + 2.5);
          fluteOsc.stop(now + 2.5);
          breathNoise.stop(now + 2.5);
        };

        const interval = setInterval(() => {
          if (volumes[idx] > 10 && Math.random() > 0.4) {
            playFluteNote();
          }
        }, 2800);
        intervalsRef.current.push(interval);
      }

      // ── CHANNEL 3: COASTAL NATURE (🌊 Ocean Waves)
      else if (ch.id === "coastal") {
        // Pink noise source
        const waveSource = ctx.createBufferSource();
        waveSource.buffer = createNoiseBuffer(ctx, "pink");
        waveSource.loop = true;

        // Biquad filter for rolling sweeps
        const waveFilter = ctx.createBiquadFilter();
        waveFilter.type = "bandpass";
        waveFilter.Q.value = 1.8;
        waveFilter.frequency.value = 350;

        // Modulate filter frequency with an LFO to simulate rolling ocean waves
        const lfo = ctx.createOscillator();
        lfo.type = "sine";
        lfo.frequency.value = 0.12; // Wave every ~8 seconds

        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 220; // range of sweep

        lfo.connect(lfoGain);
        lfoGain.connect(waveFilter.frequency);

        // Modulate volume matching the wave cycle
        const volLfoGain = ctx.createGain();
        volLfoGain.gain.value = 0.55;

        // Connect noise through filter and gains
        const waveGain = ctx.createGain();
        waveGain.gain.value = 0.08;

        waveSource.connect(waveFilter);
        waveFilter.connect(waveGain);
        waveGain.connect(channelGain);

        lfo.start();
        waveSource.start();
        synthNodesRef.current[ch.id].push(lfo, waveSource);
      }

      // ── CHANNEL 4: MONSOON RAIN (🌧️ Pattering Rain & Thunder)
      else if (ch.id === "monsoon") {
        // Rain noise (High-pass white noise)
        const rainSrc = ctx.createBufferSource();
        rainSrc.buffer = createNoiseBuffer(ctx, "white");
        rainSrc.loop = true;

        const rainFilter = ctx.createBiquadFilter();
        rainFilter.type = "highpass";
        rainFilter.frequency.value = 1800;

        const rainGain = ctx.createGain();
        rainGain.gain.value = 0.04;

        rainSrc.connect(rainFilter);
        rainFilter.connect(rainGain);
        rainGain.connect(channelGain);
        rainSrc.start();
        synthNodesRef.current[ch.id].push(rainSrc);

        // Periodic thunder sweeps
        const triggerThunder = () => {
          if (!isPlaying && audioCtxRef.current?.state !== "running") return;
          const now = ctx.currentTime;
          
          const thunderSrc = ctx.createBufferSource();
          thunderSrc.buffer = createNoiseBuffer(ctx, "brown");

          const thunderFilter = ctx.createBiquadFilter();
          thunderFilter.type = "lowpass";
          thunderFilter.frequency.setValueAtTime(180, now);
          // Sweep filter down to sound like distant rumble
          thunderFilter.frequency.exponentialRampToValueAtTime(30, now + 4.0);

          const thunderGain = ctx.createGain();
          thunderGain.gain.setValueAtTime(0, now);
          thunderGain.gain.linearRampToValueAtTime(0.35, now + 0.5); // swelling rumble
          thunderGain.gain.exponentialRampToValueAtTime(0.0001, now + 5.0);

          thunderSrc.connect(thunderFilter);
          thunderFilter.connect(thunderGain);
          thunderGain.connect(channelGain);
          
          thunderSrc.start(now);
          thunderSrc.stop(now + 5.5);
        };

        const interval = setInterval(() => {
          if (volumes[idx] > 15 && Math.random() > 0.75) {
            triggerThunder();
          }
        }, 10000);
        intervalsRef.current.push(interval);
      }

      // ── CHANNEL 5: TEMPLE FLAMES (🔥 Crackling Fire)
      else if (ch.id === "fire") {
        // Low rumble of fire (Filtered brown noise)
        const rumbleSrc = ctx.createBufferSource();
        rumbleSrc.buffer = createNoiseBuffer(ctx, "brown");
        rumbleSrc.loop = true;

        const rumbleFilter = ctx.createBiquadFilter();
        rumbleFilter.type = "lowpass";
        rumbleFilter.frequency.value = 90;

        const rumbleGain = ctx.createGain();
        rumbleGain.gain.value = 0.25;

        rumbleSrc.connect(rumbleFilter);
        rumbleFilter.connect(rumbleGain);
        rumbleGain.connect(channelGain);
        rumbleSrc.start();
        synthNodesRef.current[ch.id].push(rumbleSrc);

        // Fire crackle clicks (random impulse transients)
        const triggerCrackle = () => {
          if (!isPlaying && audioCtxRef.current?.state !== "running") return;
          const now = ctx.currentTime;
          
          const crackleOsc = ctx.createOscillator();
          crackleOsc.type = "triangle";
          crackleOsc.frequency.setValueAtTime(2500 + Math.random() * 3000, now);

          const crackleGain = ctx.createGain();
          crackleGain.gain.setValueAtTime(0.03, now);
          crackleGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.006);

          crackleOsc.connect(crackleGain);
          crackleGain.connect(channelGain);
          
          crackleOsc.start(now);
          crackleOsc.stop(now + 0.02);
        };

        const interval = setInterval(() => {
          if (volumes[idx] > 10 && Math.random() > 0.2) {
            triggerCrackle();
          }
        }, 120);
        intervalsRef.current.push(interval);
      }

      // ── CHANNEL 6: SACRED WIND (🍃 Sea Breeze)
      else if (ch.id === "wind") {
        // Pink noise generator
        const windSrc = ctx.createBufferSource();
        windSrc.buffer = createNoiseBuffer(ctx, "pink");
        windSrc.loop = true;

        // Bandpass filter with moving center frequency
        const windFilter = ctx.createBiquadFilter();
        windFilter.type = "bandpass";
        windFilter.Q.value = 2.5;
        windFilter.frequency.value = 400;

        // LFO to simulate gusting/surging breeze
        const windLfo = ctx.createOscillator();
        windLfo.type = "sine";
        windLfo.frequency.value = 0.08; // slow cycles

        const windLfoGain = ctx.createGain();
        windLfoGain.gain.value = 280; // swing up and down by 280 Hz

        windLfo.connect(windLfoGain);
        windLfoGain.connect(windFilter.frequency);

        const windGain = ctx.createGain();
        windGain.gain.value = 0.12;

        windSrc.connect(windFilter);
        windFilter.connect(windGain);
        windGain.connect(channelGain);

        windLfo.start();
        windSrc.start();
        synthNodesRef.current[ch.id].push(windLfo, windSrc);
      }
    });

  }, [stopAll, volumes, masterVolume, isPlaying]);

  // Handle master volume adjustments in real-time
  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setTargetAtTime(masterVolume / 100, audioCtxRef.current.currentTime, 0.1);
    }
  }, [masterVolume]);

  // Adjust channel gain in real-time
  useEffect(() => {
    if (isPlaying) {
      gainNodesRef.current.forEach((g, i) => {
        if (g && audioCtxRef.current) {
          g.gain.setTargetAtTime(volumes[i] / 100, audioCtxRef.current.currentTime, 0.15);
        }
      });
    }
  }, [volumes, isPlaying]);

  // Animate custom visualizers depending on volume levels
  useEffect(() => {
    if (!isPlaying) {
      setVisualizerHeights(CHANNELS.map(() => 0));
      return;
    }
    const interval = setInterval(() => {
      setVisualizerHeights(volumes.map(v => (v > 0 ? 15 + Math.random() * 85 : 0)));
    }, 150);
    return () => clearInterval(interval);
  }, [volumes, isPlaying]);

  // Clean up nodes on component destruction
  useEffect(() => {
    return () => {
      stopAll();
    };
  }, [stopAll]);

  const togglePlayback = () => {
    if (isPlaying) {
      stopAll();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      // Wait for state change, audio is triggered by useEffect on change
    }
  };

  // Start audio synthesis as soon as playback starts or volumes change
  useEffect(() => {
    if (isPlaying) {
      startAudio();
    }
  }, [isPlaying]);

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setVolumes(preset.volumes);
    setActivePreset(preset.name);
    setShowPresets(false);
  };

  const setChannelVolume = (index: number, value: number[]) => {
    const newVols = [...volumes];
    newVols[index] = value[0];
    setVolumes(newVols);
    setActivePreset(null);
  };

  const totalActive = volumes.filter(v => v > 0).length;

  return (
    <div className="min-h-screen bg-[#0d0905] text-[#f7efe6] font-sans">
      <Navigation />
      <div className="relative pt-24 pb-12 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-radial-at-t from-[#c49a5e]/10 via-[#0d0905]/80 to-[#0d0905] pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-amber-500/10 to-orange-600/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container mx-auto px-4 pt-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-sm text-amber-400 mb-6 font-medium tracking-wide">
            <Headphones className="w-4 h-4 animate-bounce" /> Spatial Heritage Soundscapes
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-amber-200 via-orange-400 to-amber-500 bg-clip-text text-transparent">Procedural Soundscape Mixer</span>
            <br /><span className="text-white/95 text-3xl md:text-4xl font-light">Interactive Historical Atmosphere</span>
          </h1>
          <p className="text-amber-100/60 max-w-2xl mx-auto text-base md:text-lg leading-relaxed font-light">
            Each ambient layer is synthesized <strong>live in real-time</strong> using standard mathematical models (Web Audio API). Turn up the sliders to blend chisels tapping ancient stone, echoing chants, sea breeze, and coastal waves.
          </p>

          <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-5 max-w-3xl mx-auto bg-black/40 p-6 rounded-3xl border border-[#c49a5e]/15 backdrop-blur-md">
            <button
              id="soundscape-play-btn"
              onClick={togglePlayback}
              className={`relative flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 w-full md:w-auto shadow-lg ${
                isPlaying 
                  ? "bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 hover:shadow-red-500/5" 
                  : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black shadow-amber-500/10"
              }`}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
              {isPlaying ? "Mute Atmosphere" : "Begin Soundwalk"}
              {isPlaying && (
                <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500" />
                </span>
              )}
            </button>

            <div className="flex items-center gap-4 bg-white/5 border border-white/5 rounded-2xl px-6 py-4 w-full md:flex-1">
              {masterVolume === 0 ? (
                <VolumeX className="w-5 h-5 text-amber-500/40" />
              ) : (
                <Volume2 className="w-5 h-5 text-amber-400" />
              )}
              <Slider
                min={0}
                max={100}
                step={1}
                value={[masterVolume]}
                onValueChange={v => setMasterVolume(v[0])}
                className="flex-1 accent-amber-500"
              />
              <span className="text-sm font-mono text-amber-300/80 w-10 text-right">{masterVolume}%</span>
            </div>
          </div>

          {isPlaying && (
            <div className="mt-5 inline-flex items-center gap-2 text-sm text-amber-400/80 bg-amber-400/5 px-4 py-1.5 rounded-full border border-amber-400/10">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping" />
              <span>{totalActive} channel{totalActive !== 1 ? "s" : ""} active</span>
              {activePreset && <span className="text-white/60">· Preset: {activePreset}</span>}
            </div>
          )}
        </div>
      </div>

      {/* Presets Row */}
      <div className="container mx-auto px-4 mb-10 text-center">
        <div className="relative inline-block">
          <Button
            variant="outline"
            className="gap-2 bg-black/40 border-[#c49a5e]/30 text-amber-400 hover:bg-[#c49a5e]/10 rounded-xl px-6 py-5 font-semibold"
            onClick={() => setShowPresets(!showPresets)}
          >
            🎼 Select Environmental Preset ▾
          </Button>
          {showPresets && (
            <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 bg-[#120d09] border border-[#c49a5e]/20 rounded-2xl p-4 grid grid-cols-2 gap-3 min-w-[320px] shadow-2xl backdrop-blur-xl">
              {PRESETS.map(p => (
                <button
                  key={p.name}
                  onClick={() => applyPreset(p)}
                  className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activePreset === p.name 
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" 
                      : "hover:bg-white/5 text-amber-100/60 hover:text-white"
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Channels Grid */}
      <div className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {CHANNELS.map((channel, i) => {
            const vol = volumes[i];
            const isActive = vol > 0 && isPlaying;
            const heightMultiplier = visualizerHeights[i];
            
            return (
              <div 
                key={channel.id} 
                className={`relative bg-gradient-to-br from-black/60 to-black/30 border rounded-2xl p-6 transition-all duration-500 backdrop-blur-md overflow-hidden ${
                  isActive ? "border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.05)] scale-[1.02]" : "border-[#c49a5e]/10 hover:border-[#c49a5e]/25"
                }`}
              >
                {/* Visual glow indicator */}
                {isActive && (
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${channel.color} opacity-40 transition-opacity duration-500`} />
                )}
                
                <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all duration-300 ${
                        isActive ? "bg-amber-500/20 border border-amber-500/20 shadow-inner" : "bg-white/5 border border-white/5 text-amber-400/40"
                      }`}>
                        {channel.emoji}
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-amber-100">{channel.label}</h3>
                        <p className="text-xs text-amber-100/50 mt-1 leading-snug">{channel.description}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg ${
                      vol > 0 ? "bg-amber-500/20 text-amber-300 border border-amber-500/20" : "bg-white/5 text-amber-100/40"
                    }`}>
                      {vol}%
                    </span>
                  </div>

                  {/* Animated Visualizer bars for active channel */}
                  <div className="h-10 flex items-end justify-between gap-[2px] bg-black/40 rounded-xl px-4 py-2 border border-[#c49a5e]/5">
                    {isActive ? (
                      Array.from({ length: 14 }).map((_, b) => (
                        <div 
                          key={b} 
                          className="flex-1 bg-gradient-to-t from-amber-600 to-amber-300 rounded-full transition-all duration-150" 
                          style={{ 
                            height: `${(heightMultiplier * (0.3 + 0.7 * Math.sin((b + 1) * 0.4))) * 0.8}%`,
                          }} 
                        />
                      ))
                    ) : (
                      <div className="w-full text-center text-[10px] text-amber-100/20 font-mono">CHANNEL INACTIVE</div>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setChannelVolume(i, [vol > 0 ? 0 : 65])} 
                      className="text-amber-400/50 hover:text-amber-400 transition-colors shrink-0"
                    >
                      {vol === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      value={[vol]}
                      onValueChange={v => setChannelVolume(i, v)}
                      className="flex-1 accent-amber-500"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center bg-black/40 border border-[#c49a5e]/15 rounded-3xl p-8 max-w-2xl mx-auto backdrop-blur-md">
          <Headphones className="w-10 h-10 text-amber-400 mx-auto mb-4" />
          <h3 className="font-bold text-lg mb-2 text-amber-200">🎧 Best Experienced with Headphones</h3>
          <p className="text-sm text-amber-100/60 leading-relaxed max-w-lg mx-auto">
            This module generates continuous waves, wind noise, and flute tones directly in your browser. Ensure your sound is turned on and adjust the slider to tailor your immersive historical audio journey.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Soundscape;
