import { useState, useCallback, useRef, useEffect } from "react";
import { Mic, MicOff, Volume2, Loader2, Camera, CameraOff, X, Sparkles, Settings2, AudioLines, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { SupportedLanguage, languageLabels } from "@/hooks/useTravelChat";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";

// Web Speech API types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event & { error: string }) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

const speechLangCodes: Record<SupportedLanguage, string> = {
  en: "en-IN",
  hi: "hi-IN",
  or: "or-IN",
  te: "te-IN",
  bn: "bn-IN",
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gemini-voice-guide`;
const TTS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`;

const VoiceGuide = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [language, setLanguage] = useState<SupportedLanguage>("en");
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
  const [isConversationActive, setIsConversationActive] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const shouldRestartRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number>(0);

  const { toast } = useToast();

  useEffect(() => {
    const handleNudge = (event: any) => {
      const { monument } = event.detail;
      if (!isConversationActive) {
        setIsConversationActive(true);
        shouldRestartRef.current = true;
      }
      handleProactiveNudge(monument.title);
    };

    window.addEventListener("proactive-nudge", handleNudge);
    return () => {
      window.removeEventListener("proactive-nudge", handleNudge);
      stopCamera();
      stopConversation();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isConversationActive, language]);

  // Create speech recognition instance
  const createRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({
        variant: "destructive",
        title: "Not Supported",
        description: "Use Chrome or Edge for voice features.",
      });
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = speechLangCodes[language];

    return recognition;
  }, [language, toast]);

  // ElevenLabs TTS playback
  const speakWithElevenLabs = async (text: string) => {
    setIsSpeaking(true);
    try {
      const resp = await fetch(TTS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ text }),
      });

      if (!resp.ok) {
        throw new Error("TTS failed");
      }

      const audioBlob = await resp.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Create audio context for visualization
      const audioCtx = new AudioContext();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      const source = audioCtx.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(audioCtx.destination);

      // Start visualization
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const visualize = () => {
        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setAudioLevel(avg / 255);
        animFrameRef.current = requestAnimationFrame(visualize);
      };
      visualize();

      audio.onended = () => {
        setIsSpeaking(false);
        setAudioLevel(0);
        cancelAnimationFrame(animFrameRef.current);
        URL.revokeObjectURL(audioUrl);
        audioCtx.close();
        // Auto-restart listening
        if (isConversationActive && shouldRestartRef.current) {
          setTimeout(() => startListening(), 300);
        }
      };

      audio.onerror = () => {
        setIsSpeaking(false);
        setAudioLevel(0);
        cancelAnimationFrame(animFrameRef.current);
        audioCtx.close();
        if (isConversationActive && shouldRestartRef.current) {
          setTimeout(() => startListening(), 300);
        }
      };

      await audio.play();
    } catch (err) {
      console.error("ElevenLabs TTS error:", err);
      setIsSpeaking(false);
      setAudioLevel(0);
      // Fallback to Web Speech API
      speakWithWebSpeech(text);
    }
  };

  // Fallback Web Speech TTS
  const speakWithWebSpeech = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = speechLangCodes[language];
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      if (isConversationActive && shouldRestartRef.current) {
        setTimeout(() => startListening(), 300);
      }
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      if (isConversationActive && shouldRestartRef.current) {
        setTimeout(() => startListening(), 300);
      }
    };
    window.speechSynthesis.speak(utterance);
  };

  // Handle streaming response
  const streamResponse = async (userMessage: string, image: string | null) => {
    setIsProcessing(true);
    setResponse("");
    let fullResponse = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          message: userMessage,
          image,
          language,
          conversationHistory: conversationHistory.slice(-6),
        }),
      });

      if (!resp.ok) throw new Error("Failed to get response");

      const reader = resp.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullResponse += content;
              setResponse(fullResponse);
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      // Update conversation history
      setConversationHistory(prev => [
        ...prev,
        { role: "user", content: userMessage },
        { role: "assistant", content: fullResponse },
      ]);

      // Speak with ElevenLabs
      if (fullResponse) {
        speakWithElevenLabs(fullResponse);
      }

      setCapturedImage(null);
    } catch (err) {
      console.error("API error:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get response.",
      });
      if (isConversationActive) {
        setTimeout(() => startListening(), 500);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProactiveNudge = async (monumentName: string) => {
    setIsProcessing(true);
    setResponse("");
    let fullResponse = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          isProactive: true,
          monumentName,
          language,
          conversationHistory: conversationHistory.slice(-6),
        }),
      });

      if (!resp.ok) throw new Error("Failed to get response");

      const reader = resp.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullResponse += content;
              setResponse(fullResponse);
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      setConversationHistory(prev => [
        ...prev,
        { role: "assistant", content: fullResponse },
      ]);

      if (fullResponse) {
        speakWithElevenLabs(fullResponse);
      }
    } catch (err) {
      console.error("Proactive API error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Start listening
  const startListening = useCallback(() => {
    if (isSpeaking) {
      audioRef.current?.pause();
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      setAudioLevel(0);
    }

    const recognition = createRecognition();
    if (!recognition) return;

    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript("");
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      setTranscript(finalTranscript || interimTranscript);

      if (finalTranscript) {
        streamResponse(finalTranscript, capturedImage);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech error:", event.error);
      setIsListening(false);

      if (isConversationActive && shouldRestartRef.current && event.error !== "aborted") {
        setTimeout(() => startListening(), 1000);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (e) {
      console.error("Recognition start error:", e);
    }
  }, [language, capturedImage, isSpeaking, isConversationActive, createRecognition]);

  const stopListening = () => {
    recognitionRef.current?.abort();
    setIsListening(false);
  };

  const startConversation = () => {
    setIsConversationActive(true);
    shouldRestartRef.current = true;
    startListening();
    toast({
      title: "🎙️ Conversation Started",
      description: "I'm listening — speak naturally!",
    });
  };

  const stopConversation = () => {
    shouldRestartRef.current = false;
    setIsConversationActive(false);
    stopListening();
    audioRef.current?.pause();
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setAudioLevel(0);
    cancelAnimationFrame(animFrameRef.current);
  };

  // Camera functions
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraActive(true);
    } catch {
      toast({ variant: "destructive", title: "Camera Error", description: "Could not access camera." });
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraActive(false);
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
      setCapturedImage(dataUrl);
      stopCamera();
      toast({ title: "📸 Photo Captured!", description: "Now ask about this place." });
    }
  };

  const isActive = isListening || isSpeaking || isProcessing;

  // Dynamic ring sizes for audio visualization
  const ringScale1 = 1 + audioLevel * 0.4;
  const ringScale2 = 1 + audioLevel * 0.7;
  const ringScale3 = 1 + audioLevel * 1.0;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="border-0 shadow-2xl bg-gradient-to-b from-card to-card/95 overflow-hidden">
        <CardHeader className="text-center pb-2 pt-6">
          {/* Language Selector */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
              <Globe className="w-3.5 h-3.5 text-primary" />
              <Select value={language} onValueChange={(val) => setLanguage(val as SupportedLanguage)}>
                <SelectTrigger className="w-[110px] h-7 text-xs border-0 bg-transparent shadow-none focus:ring-0 px-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(languageLabels).map(([code, label]) => (
                    <SelectItem key={code} value={code}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Main Voice Circle with Audio Visualization */}
          <div className="mx-auto mb-6 relative flex items-center justify-center" style={{ width: 180, height: 180 }}>
            {/* Animated rings */}
            {isActive && (
              <>
                <div
                  className="absolute inset-0 rounded-full border-2 border-primary/10 transition-transform duration-150"
                  style={{ transform: `scale(${ringScale3})`, opacity: 0.2 }}
                />
                <div
                  className="absolute inset-0 rounded-full border-2 border-primary/20 transition-transform duration-150"
                  style={{ transform: `scale(${ringScale2})`, opacity: 0.3 }}
                />
                <div
                  className="absolute inset-0 rounded-full border-2 border-primary/30 transition-transform duration-150"
                  style={{ transform: `scale(${ringScale1})`, opacity: 0.5 }}
                />
              </>
            )}

            {/* Pulsing glow when active */}
            {isActive && (
              <div className={cn(
                "absolute inset-2 rounded-full blur-xl transition-opacity duration-500",
                isListening ? "bg-primary/30 animate-pulse" :
                  isSpeaking ? "bg-accent/30 animate-pulse" :
                    "bg-muted/20"
              )} />
            )}

            {/* Main button */}
            <button
              onClick={isConversationActive ? stopConversation : startConversation}
              disabled={isProcessing}
              className={cn(
                "relative w-36 h-36 rounded-full flex flex-col items-center justify-center gap-1 transition-all duration-500 focus:outline-none",
                isProcessing
                  ? "bg-muted/80 cursor-wait shadow-lg"
                  : isSpeaking
                    ? "bg-gradient-to-br from-accent to-accent/80 cursor-pointer shadow-[0_0_40px_rgba(var(--accent),0.3)]"
                    : isListening
                      ? "bg-gradient-to-br from-primary to-primary/80 cursor-pointer shadow-[0_0_40px_rgba(var(--primary),0.4)] scale-105"
                      : isConversationActive
                        ? "bg-primary/60 cursor-pointer shadow-lg hover:bg-primary/70"
                        : "bg-gradient-to-br from-primary/80 to-primary cursor-pointer shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95"
              )}
            >
              {isProcessing ? (
                <Loader2 className="w-10 h-10 text-muted-foreground animate-spin" />
              ) : isSpeaking ? (
                <AudioLines className="w-10 h-10 text-accent-foreground animate-pulse" />
              ) : isListening ? (
                <Radio className="w-10 h-10 text-primary-foreground animate-pulse" />
              ) : isConversationActive ? (
                <MicOff className="w-10 h-10 text-primary-foreground" />
              ) : (
                <Mic className="w-10 h-10 text-primary-foreground" />
              )}
              <span className="text-[10px] font-medium text-primary-foreground/80">
                {isProcessing ? "Thinking" : isSpeaking ? "Speaking" : isListening ? "Listening" : isConversationActive ? "Stop" : "Tap to Talk"}
              </span>
            </button>

            {/* Active indicator dot */}
            {isConversationActive && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-background shadow-md">
                <div className="absolute inset-0.5 bg-green-400 rounded-full animate-ping opacity-75" />
              </div>
            )}
          </div>

          <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Your Travel Guide
          </CardTitle>
          <CardDescription className="text-sm mt-1 flex items-center justify-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5" />
            Powered by ElevenLabs voice
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 pb-6">
          {/* Transcript Display */}
          {transcript && (
            <div className="bg-muted/40 backdrop-blur-sm rounded-xl p-3 border border-border/30">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 mb-1 font-semibold">You said</p>
              <p className="text-sm text-foreground">{transcript}</p>
            </div>
          )}

          {/* Response Display */}
          {response && (
            <div className="bg-primary/5 backdrop-blur-sm rounded-xl p-3 border border-primary/15">
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3 h-3 text-primary" />
                <p className="text-[10px] uppercase tracking-wider text-primary/70 font-semibold">Guide</p>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{response}</p>
            </div>
          )}

          {/* Camera Section */}
          {capturedImage && (
            <div className="relative rounded-xl overflow-hidden border border-border/30">
              <img src={capturedImage} alt="Captured" className="w-full h-32 object-cover" />
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2 h-6 w-6 rounded-full"
                onClick={() => setCapturedImage(null)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          )}

          {cameraActive && (
            <div className="relative rounded-xl overflow-hidden bg-black border border-border/30">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-32 object-cover" />
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                <Button onClick={captureImage} size="sm" className="gap-1 h-7 text-xs rounded-full">
                  <Camera className="w-3 h-3" />
                  Capture
                </Button>
                <Button onClick={stopCamera} size="sm" variant="outline" className="gap-1 h-7 text-xs rounded-full bg-background/80">
                  <CameraOff className="w-3 h-3" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {!cameraActive && !capturedImage && (
            <Button onClick={startCamera} variant="outline" size="sm" className="w-full gap-2 rounded-xl h-9 border-dashed">
              <Camera className="w-4 h-4" />
              Identify Monument
            </Button>
          )}

          <canvas ref={canvasRef} className="hidden" />

          {/* Tips */}
          <div className="text-center pt-2">
            <p className="text-[11px] text-muted-foreground/60">
              💡 Speak naturally — the conversation flows automatically
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceGuide;
