import { useState, useCallback, useRef, useEffect, FC } from "react";
import { getApiUrl } from "@/lib/apiConfig";
import { Mic, MicOff, Volume2, Loader2, Camera, CameraOff, X, Sparkles, AudioLines, Radio, Upload, RefreshCw, Send, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { useLocation, useNavigate } from "react-router-dom";
import { useTTSVoice } from "@/hooks/useTTSVoice";

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

const getVoiceGuideUrl = () => getApiUrl("/api/ai/voice-guide");

interface VoiceGuideProps {
  language?: SupportedLanguage;
  onLanguageChange?: (lang: SupportedLanguage) => void;
}

const VoiceGuide: FC<VoiceGuideProps> = ({
  language: externalLanguage,
  onLanguageChange,
}) => {
  const { preferredVoice, lang: ttsLang } = useTTSVoice();
  const [internalLanguage, setInternalLanguage] = useState<SupportedLanguage>("en");
  const language = externalLanguage ?? internalLanguage;
  const setLanguage = onLanguageChange ?? setInternalLanguage;

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [textInput, setTextInput] = useState("");
  const [showTextInput, setShowTextInput] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
  const [isConversationActive, setIsConversationActive] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const shouldRestartRef = useRef(false);
  
  // Streaming speech synthesis queue for instant response
  const speechQueueRef = useRef<string[]>([]);
  const isCurrentlySpeakingRef = useRef<boolean>(false);
  const streamFinishedRef = useRef<boolean>(false);

  const ring1Ref = useRef<HTMLDivElement>(null);
  const ring2Ref = useRef<HTMLDivElement>(null);
  const ring3Ref = useRef<HTMLDivElement>(null);

  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const isSpeechSupported = typeof window !== "undefined" && Boolean(
    window.SpeechRecognition || window.webkitSpeechRecognition
  );

  // Proactive location nudge handler
  useEffect(() => {
    if (location.state?.proactiveMonument) {
      const monument = location.state.proactiveMonument;
      if (!isConversationActive) {
        setIsConversationActive(true);
        shouldRestartRef.current = true;
      }
      handleProactiveNudge(monument.title);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state?.proactiveMonument, isConversationActive, navigate]);

  useEffect(() => {
    const handleNudge = (event: CustomEvent<{ monument: { title: string } }>) => {
      const { monument } = event.detail;
      if (!isConversationActive) {
        setIsConversationActive(true);
        shouldRestartRef.current = true;
      }
      handleProactiveNudge(monument.title);
    };

    window.addEventListener("proactive-nudge", handleNudge as EventListener);
    return () => {
      window.removeEventListener("proactive-nudge", handleNudge as EventListener);
      stopCamera();
      stopConversation();
    };
  }, [isConversationActive, language]);

  // Audio visualization pulse rings (Crash-proof 60fps RAF animation)
  useEffect(() => {
    let animId: number;
    let t = 0;

    const animateRings = () => {
      t += 0.05;
      if (isSpeaking) {
        // Dynamic voice wave pulses matching speech rhythm
        const s1 = 1 + Math.abs(Math.sin(t * 1.8)) * 0.22;
        const s2 = 1 + Math.abs(Math.sin(t * 1.3 + 0.5)) * 0.38;
        const s3 = 1 + Math.abs(Math.sin(t * 0.9 + 1.0)) * 0.55;
        if (ring1Ref.current) ring1Ref.current.style.transform = `scale(${s1})`;
        if (ring2Ref.current) ring2Ref.current.style.transform = `scale(${s2})`;
        if (ring3Ref.current) ring3Ref.current.style.transform = `scale(${s3})`;
      } else if (isListening) {
        // Gentle rhythmic breathing pulse while listening
        const s1 = 1 + Math.abs(Math.sin(t * 0.9)) * 0.12;
        const s2 = 1 + Math.abs(Math.sin(t * 0.9)) * 0.22;
        const s3 = 1 + Math.abs(Math.sin(t * 0.9)) * 0.35;
        if (ring1Ref.current) ring1Ref.current.style.transform = `scale(${s1})`;
        if (ring2Ref.current) ring2Ref.current.style.transform = `scale(${s2})`;
        if (ring3Ref.current) ring3Ref.current.style.transform = `scale(${s3})`;
      } else {
        if (ring1Ref.current) ring1Ref.current.style.transform = "scale(1)";
        if (ring2Ref.current) ring2Ref.current.style.transform = "scale(1)";
        if (ring3Ref.current) ring3Ref.current.style.transform = "scale(1)";
      }
      animId = requestAnimationFrame(animateRings);
    };

    animId = requestAnimationFrame(animateRings);
    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isSpeaking, isListening]);

  // Speech synthesis sentence player — seamless streaming queue
  const playNextSentence = useCallback(() => {
    if (!speechQueueRef.current.length) {
      isCurrentlySpeakingRef.current = false;
      if (streamFinishedRef.current) {
        setIsSpeaking(false);
        // Automatically resume listening if in active conversation mode
        if (shouldRestartRef.current) {
          setTimeout(() => {
            if (shouldRestartRef.current) {
              startListening();
            }
          }, 350);
        }
      }
      return;
    }

    const nextSentence = speechQueueRef.current.shift()!;
    isCurrentlySpeakingRef.current = true;
    setIsSpeaking(true);
    setIsProcessing(false);

    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      isCurrentlySpeakingRef.current = false;
      setIsSpeaking(false);
      return;
    }

    const clean = nextSentence.replace(/[*#_`~]/g, "").trim();
    if (!clean) {
      playNextSentence();
      return;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(clean);
      if (preferredVoice) {
        utterance.voice = preferredVoice;
        utterance.lang = preferredVoice.lang;
      } else {
        utterance.lang = speechLangCodes[language] ?? ttsLang ?? "en-IN";
      }
      utterance.rate = 1.05;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        playNextSentence();
      };

      utterance.onerror = (e) => {
        console.warn("Speech synthesis notice:", e);
        playNextSentence();
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn("Utterance error:", err);
      playNextSentence();
    }
  }, [language, preferredVoice, ttsLang]);

  const queueSentence = useCallback((sentence: string) => {
    const clean = sentence.trim();
    if (!clean) return;
    speechQueueRef.current.push(clean);
    if (!isCurrentlySpeakingRef.current) {
      playNextSentence();
    }
  }, [playNextSentence]);

  // Create SpeechRecognition safely
  const createRecognition = useCallback(() => {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) return null;

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = speechLangCodes[language] || "en-IN";
      return recognition;
    } catch (e) {
      console.warn("SpeechRecognition init error:", e);
      return null;
    }
  }, [language]);

  // Handle streaming AI response with INSTANT sentence-by-sentence audio playback
  const streamResponse = useCallback(async (userMessage: string, image: string | null) => {
    setIsProcessing(true);
    setResponse("");
    speechQueueRef.current = [];
    isCurrentlySpeakingRef.current = false;
    streamFinishedRef.current = false;

    // Immediately stop any previously playing speech
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    let fullResponse = "";
    let streamBuffer = "";

    try {
      const resp = await fetch(getVoiceGuideUrl(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
              streamBuffer += content;

              // Extract complete sentences on punctuation (. ! ? or newline) for INSTANT speech
              const sentenceEndRegex = /([.!?\n]+)(\s+|$)/;
              let match = sentenceEndRegex.exec(streamBuffer);
              while (match) {
                const sentenceEnd = match.index + match[1].length;
                const sentence = streamBuffer.slice(0, sentenceEnd).trim();
                streamBuffer = streamBuffer.slice(sentenceEnd).trim();

                if (sentence.length > 2) {
                  queueSentence(sentence);
                }
                match = sentenceEndRegex.exec(streamBuffer);
              }
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      // Stream finished — queue any remaining words
      streamFinishedRef.current = true;
      if (streamBuffer.trim().length > 0) {
        queueSentence(streamBuffer.trim());
      } else if (!speechQueueRef.current.length && !isCurrentlySpeakingRef.current) {
        setIsSpeaking(false);
      }

      // Update conversation history
      setConversationHistory(prev => [
        ...prev,
        { role: "user", content: userMessage },
        { role: "assistant", content: fullResponse },
      ]);

      setCapturedImage(null);
    } catch (err) {
      console.error("API error:", err);
      toast({
        variant: "destructive",
        title: "Voice Guide Error",
        description: "Could not retrieve voice response. Please try again.",
      });
      setIsProcessing(false);
      setIsSpeaking(false);
      if (shouldRestartRef.current) {
        setTimeout(() => startListening(), 800);
      }
    }
  }, [language, conversationHistory, toast, queueSentence]);

  // Proactive audio guide
  const handleProactiveNudge = useCallback(async (monumentName: string) => {
    setIsProcessing(true);
    setResponse("");
    speechQueueRef.current = [];
    isCurrentlySpeakingRef.current = false;
    streamFinishedRef.current = false;

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    let fullResponse = "";
    let streamBuffer = "";

    try {
      const resp = await fetch(getVoiceGuideUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
              streamBuffer += content;

              const sentenceEndRegex = /([.!?\n]+)(\s+|$)/;
              let match = sentenceEndRegex.exec(streamBuffer);
              while (match) {
                const sentenceEnd = match.index + match[1].length;
                const sentence = streamBuffer.slice(0, sentenceEnd).trim();
                streamBuffer = streamBuffer.slice(sentenceEnd).trim();

                if (sentence.length > 2) {
                  queueSentence(sentence);
                }
                match = sentenceEndRegex.exec(streamBuffer);
              }
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      streamFinishedRef.current = true;
      if (streamBuffer.trim().length > 0) {
        queueSentence(streamBuffer.trim());
      }

      setConversationHistory(prev => [
        ...prev,
        { role: "assistant", content: fullResponse },
      ]);
    } catch (err) {
      console.error("Proactive API error:", err);
      setIsProcessing(false);
      setIsSpeaking(false);
    }
  }, [language, conversationHistory, queueSentence]);

  // Start listening safely
  const startListening = useCallback(() => {
    try {
      if (isSpeaking || isCurrentlySpeakingRef.current) {
        speechQueueRef.current = [];
        window.speechSynthesis?.cancel();
        isCurrentlySpeakingRef.current = false;
        setIsSpeaking(false);
      }

      const recognition = createRecognition();
      if (!recognition) {
        setShowTextInput(true);
        toast({
          title: "Microphone Voice Input",
          description: "Speech recognition is unavailable in this browser. You can type below to hear the voice guide!",
        });
        setIsListening(false);
        setIsConversationActive(false);
        shouldRestartRef.current = false;
        return;
      }

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

        if (finalTranscript.trim()) {
          streamResponse(finalTranscript.trim(), capturedImage);
        }
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition notice:", event.error);
        setIsListening(false);

        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          toast({
            variant: "destructive",
            title: "Microphone Access Required",
            description: "Please allow microphone permissions in your browser to speak with the guide.",
          });
          setIsConversationActive(false);
          shouldRestartRef.current = false;
          setShowTextInput(true);
          return;
        }

        if (shouldRestartRef.current && event.error !== "aborted") {
          setTimeout(() => {
            if (shouldRestartRef.current) startListening();
          }, 800);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.warn("Recognition start catch:", e);
      setIsListening(false);
    }
  }, [createRecognition, isSpeaking, capturedImage, streamResponse, toast]);

  const stopListening = useCallback(() => {
    try {
      recognitionRef.current?.abort();
    } catch {
      // ignore
    }
    setIsListening(false);
  }, []);

  const startConversation = () => {
    try {
      // Resume audio context/speech synthesis on user click
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.resume();
      }
      setIsConversationActive(true);
      shouldRestartRef.current = true;
      startListening();
      toast({
        title: "🎙️ Voice Guide Ready",
        description: "Speak naturally — your travel guide is listening!",
      });
    } catch (e) {
      console.error("Start conversation error:", e);
    }
  };

  const stopConversation = () => {
    try {
      shouldRestartRef.current = false;
      setIsConversationActive(false);
      stopListening();
      speechQueueRef.current = [];
      isCurrentlySpeakingRef.current = false;
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      setIsProcessing(false);
    } catch (e) {
      console.error("Stop conversation error:", e);
    }
  };

  // Camera capture with validation
  const startCamera = async () => {
    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }
      streamRef.current = stream;
      setCameraActive(true);
    } catch (err) {
      console.error("Camera access error:", err);
      toast({
        variant: "destructive",
        title: "Camera Access Error",
        description: "Could not open camera. You can also click 'Upload Photo' to select an image from your device.",
      });
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraActive(false);
  };

  useEffect(() => {
    if (cameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [cameraActive]);

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    const width = video.videoWidth || video.clientWidth || 640;
    const height = video.videoHeight || video.clientHeight || 480;

    if (width === 0 || height === 0) {
      toast({
        variant: "destructive",
        title: "Camera Initializing",
        description: "Please wait 1 second for the camera preview to settle.",
      });
      return;
    }

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, width, height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      if (dataUrl && dataUrl.length > 500) {
        setCapturedImage(dataUrl);
        stopCamera();
        identifyMonumentPhoto(dataUrl);
      } else {
        toast({
          variant: "destructive",
          title: "Capture Error",
          description: "Could not capture image data. Please try again.",
        });
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl && dataUrl.length > 500) {
        setCapturedImage(dataUrl);
        identifyMonumentPhoto(dataUrl, file.name);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const identifyMonumentPhoto = async (dataUrl: string, fileHint?: string) => {
    const prompt = `Identify this monument or tourist place in Odisha/India from the photo. State the exact monument name, location, and key historical or architectural significance in 2 concise sentences. ${fileHint ? `Photo filename hint: ${fileHint}` : ""}`;
    toast({ title: "🔍 Identifying Monument...", description: "Analyzing architectural highlights..." });
    await streamResponse(prompt, dataUrl);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim() || isProcessing) return;
    const query = textInput.trim();
    setTextInput("");
    setTranscript(query);
    streamResponse(query, capturedImage);
  };

  const isActive = isListening || isSpeaking || isProcessing;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="glass-card shadow-2xl overflow-hidden border-none text-foreground bg-card/60 backdrop-blur-xl">
        <CardHeader className="text-center pb-2 pt-6">
          {/* Language Selector */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/60 border border-border/50 shadow-sm">
              <Globe className="w-3.5 h-3.5 text-primary" />
              <Select value={language} onValueChange={(val) => setLanguage(val as SupportedLanguage)}>
                <SelectTrigger className="w-[115px] h-7 text-xs border-0 bg-transparent shadow-none focus:ring-0 px-1">
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
            {/* Animated Dynamic Rings */}
            {isActive && (
              <>
                <div
                  ref={ring3Ref}
                  className="absolute inset-0 rounded-full border-2 border-primary/20 pointer-events-none transition-transform duration-100 ease-out"
                  style={{ opacity: 0.25 }}
                />
                <div
                  ref={ring2Ref}
                  className="absolute inset-0 rounded-full border-2 border-primary/30 pointer-events-none transition-transform duration-100 ease-out"
                  style={{ opacity: 0.4 }}
                />
                <div
                  ref={ring1Ref}
                  className="absolute inset-0 rounded-full border-2 border-primary/40 pointer-events-none transition-transform duration-100 ease-out"
                  style={{ opacity: 0.6 }}
                />
              </>
            )}

            {/* Pulsing ambient glow */}
            {isActive && (
              <div className={cn(
                "absolute inset-2 rounded-full blur-xl transition-opacity duration-300 pointer-events-none",
                isListening ? "bg-primary/30 animate-pulse" :
                  isSpeaking ? "bg-accent/40 animate-pulse" :
                    "bg-primary/20 animate-spin"
              )} />
            )}

            {/* Main Interactive Button */}
            <button
              onClick={isConversationActive ? stopConversation : startConversation}
              disabled={isProcessing && !isSpeaking}
              type="button"
              className={cn(
                "relative w-36 h-36 rounded-full flex flex-col items-center justify-center gap-1.5 transition-all duration-300 focus:outline-none select-none",
                isProcessing && !isSpeaking
                  ? "bg-muted/80 cursor-wait shadow-lg"
                  : isSpeaking
                    ? "bg-gradient-to-br from-amber-500 to-orange-600 cursor-pointer shadow-[0_0_40px_rgba(249,115,22,0.4)] scale-105 active:scale-95"
                    : isListening
                      ? "bg-gradient-to-br from-primary to-primary/80 cursor-pointer shadow-[0_0_40px_rgba(var(--primary),0.5)] scale-105 active:scale-95 animate-pulse"
                      : isConversationActive
                        ? "bg-primary/70 cursor-pointer shadow-lg hover:bg-primary/80"
                        : "bg-gradient-to-br from-primary to-orange-600 cursor-pointer shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95"
              )}
            >
              {isProcessing && !isSpeaking ? (
                <Loader2 className="w-10 h-10 text-primary-foreground animate-spin" />
              ) : isSpeaking ? (
                <AudioLines className="w-10 h-10 text-white animate-pulse" />
              ) : isListening ? (
                <Radio className="w-10 h-10 text-white animate-pulse" />
              ) : isConversationActive ? (
                <MicOff className="w-10 h-10 text-white" />
              ) : (
                <Mic className="w-10 h-10 text-white" />
              )}
              <span className="text-xs font-semibold text-white tracking-wide">
                {isProcessing && !isSpeaking ? "Thinking..." : isSpeaking ? "Speaking" : isListening ? "Listening..." : isConversationActive ? "Tap to Stop" : "Tap to Talk"}
              </span>
            </button>

            {/* Active pulsing status badge */}
            {isConversationActive && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-background shadow-md">
                <div className="absolute inset-0.5 bg-emerald-400 rounded-full animate-ping opacity-75" />
              </div>
            )}
          </div>

          <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
            Your Travel Guide
          </CardTitle>
          <CardDescription className="text-xs mt-1 flex items-center justify-center gap-1.5 text-muted-foreground">
            <Volume2 className="w-3.5 h-3.5 text-primary" />
            <span>Instant voice-to-voice narration</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 pb-6">
          {/* Transcript Display */}
          {transcript && (
            <div className="glass-panel rounded-xl p-3 border-transparent bg-muted/30">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/80 mb-0.5 font-semibold">You said</p>
              <p className="text-xs text-foreground font-medium italic">"{transcript}"</p>
            </div>
          )}

          {/* Response Display */}
          {response && (
            <div className="glass-panel rounded-xl p-3 border-transparent bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <p className="text-[10px] uppercase tracking-wider text-primary font-bold">Guide Reply</p>
              </div>
              <p className="text-xs text-foreground/90 leading-relaxed font-sans">{response}</p>
            </div>
          )}

          {/* Fallback Type Input when mic is unavailable or user prefers typing */}
          {(showTextInput || !isSpeechSupported) && (
            <form onSubmit={handleManualSubmit} className="flex gap-2 pt-1">
              <Input
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Ask about any temple or place..."
                disabled={isProcessing}
                className="h-9 text-xs rounded-xl bg-background/70 border-border/60 focus-visible:ring-primary"
              />
              <Button type="submit" size="sm" disabled={!textInput.trim() || isProcessing} className="h-9 px-3 rounded-xl gap-1.5">
                <Send className="w-3.5 h-3.5" />
                <span>Ask</span>
              </Button>
            </form>
          )}

          {/* Camera / Photo Section */}
          {capturedImage && (
            <div className="relative rounded-2xl overflow-hidden border border-primary/30 shadow-lg bg-black/60">
              <img
                src={capturedImage}
                alt="Captured Landmark"
                className="w-full h-44 object-cover"
                onError={() => {
                  setCapturedImage(null);
                  toast({ variant: "destructive", title: "Image Error", description: "Image preview failed to load." });
                }}
              />
              <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-[11px] font-medium text-white shadow">
                <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                <span>Captured Landmark</span>
              </div>
              <div className="absolute top-2 right-2 flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-7 text-xs gap-1 rounded-full bg-black/75 hover:bg-black/90 text-white backdrop-blur-md border border-white/10"
                  onClick={() => identifyMonumentPhoto(capturedImage)}
                >
                  <RefreshCw className="w-3 h-3" />
                  Re-identify
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  className="h-7 w-7 rounded-full shadow-md"
                  onClick={() => setCapturedImage(null)}
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          )}

          {cameraActive && (
            <div className="relative rounded-2xl overflow-hidden bg-black border border-primary/40 shadow-xl">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                onLoadedMetadata={(e) => (e.target as HTMLVideoElement).play().catch(() => {})}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-x-4 top-4 bottom-14 border border-dashed border-white/30 rounded-xl pointer-events-none flex items-center justify-center">
                <span className="text-[11px] text-white/90 bg-black/60 px-2.5 py-0.5 rounded-full backdrop-blur-sm">Point at monument</span>
              </div>
              <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-2">
                <Button onClick={captureImage} size="sm" className="gap-1.5 h-8 text-xs rounded-full px-4 font-semibold shadow-lg">
                  <Camera className="w-3.5 h-3.5" />
                  Capture & Identify
                </Button>
                <Button onClick={stopCamera} size="sm" variant="outline" className="gap-1 h-8 text-xs rounded-full bg-background/80 hover:bg-background">
                  <CameraOff className="w-3.5 h-3.5" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {!cameraActive && !capturedImage && (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Button onClick={startCamera} variant="outline" size="sm" className="w-full gap-2 rounded-xl h-10 border-primary/30 hover:border-primary/60 bg-primary/5 hover:bg-primary/10">
                <Camera className="w-4 h-4 text-primary" />
                <span>Open Camera</span>
              </Button>
              <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="sm" className="w-full gap-2 rounded-xl h-10 border-border/60 hover:border-primary/50">
                <Upload className="w-4 h-4 text-primary" />
                <span>Upload Photo</span>
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />

          {/* Quick toggle to type or speak */}
          <div className="flex items-center justify-between pt-1 px-1 text-[11px] text-muted-foreground/70">
            <span>💡 Speak naturally — conversation flows automatically</span>
            <button
              type="button"
              onClick={() => setShowTextInput(!showTextInput)}
              className="text-primary hover:underline flex items-center gap-1 font-medium ml-2"
            >
              <MessageSquare className="w-3 h-3" />
              <span>{showTextInput ? "Hide text" : "Type question"}</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceGuide;
