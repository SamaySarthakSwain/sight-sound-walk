import { useState, useCallback, useRef, useEffect } from "react";
import { Mic, MicOff, Volume2, Loader2, Camera, CameraOff, X, Sparkles, Settings2 } from "lucide-react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

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
  
  // Voice settings
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [speechRate, setSpeechRate] = useState(1.1);
  const [pitch, setPitch] = useState(1);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const shouldRestartRef = useRef(false);
  
  const { toast } = useToast();

  // Load available voices
  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    
    const loadVoices = () => {
      const availableVoices = synthRef.current?.getVoices() || [];
      // Filter for relevant languages
      const relevantVoices = availableVoices.filter(v => 
        v.lang.startsWith("en") || 
        v.lang.startsWith("hi") || 
        v.lang.startsWith("te") || 
        v.lang.startsWith("bn") ||
        v.lang.startsWith("or")
      );
      setVoices(relevantVoices.length > 0 ? relevantVoices : availableVoices.slice(0, 20));
      
      // Set default voice
      if (!selectedVoice && relevantVoices.length > 0) {
        const defaultVoice = relevantVoices.find(v => v.lang.startsWith("en") && v.name.includes("Female")) ||
                           relevantVoices.find(v => v.lang.startsWith("en")) ||
                           relevantVoices[0];
        if (defaultVoice) setSelectedVoice(defaultVoice.name);
      }
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      synthRef.current?.cancel();
      stopCamera();
      stopConversation();
    };
  }, []);

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
          conversationHistory: conversationHistory.slice(-6), // Keep last 3 exchanges
        }),
      });

      if (!resp.ok) {
        throw new Error("Failed to get response");
      }

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

      // Speak the response
      if (fullResponse) {
        speakResponse(fullResponse);
      }

      setCapturedImage(null);
    } catch (err) {
      console.error("API error:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get response.",
      });
      // Restart listening on error if conversation is active
      if (isConversationActive) {
        setTimeout(() => startListening(), 500);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Text to speech with selected voice
  const speakResponse = (text: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find selected voice
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = speechLangCodes[language];
    }
    
    utterance.rate = speechRate;
    utterance.pitch = pitch;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      // Auto-restart listening for continuous conversation
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

    synthRef.current.speak(utterance);
  };

  // Start listening
  const startListening = useCallback(() => {
    if (isSpeaking) {
      synthRef.current?.cancel();
      setIsSpeaking(false);
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
      
      // Auto-restart on recoverable errors
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

  // Stop listening
  const stopListening = () => {
    recognitionRef.current?.abort();
    setIsListening(false);
  };

  // Start continuous conversation
  const startConversation = () => {
    setIsConversationActive(true);
    shouldRestartRef.current = true;
    startListening();
    toast({
      title: "Conversation Started",
      description: "I'm listening. Speak naturally!",
    });
  };

  // Stop conversation
  const stopConversation = () => {
    shouldRestartRef.current = false;
    setIsConversationActive(false);
    stopListening();
    synthRef.current?.cancel();
    setIsSpeaking(false);
  };

  // Camera functions
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Camera Error",
        description: "Could not access camera.",
      });
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
      toast({
        title: "Photo Captured!",
        description: "Ask about this monument.",
      });
    }
  };

  const isActive = isListening || isSpeaking || isProcessing;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="border-2 border-primary/20 shadow-xl">
        <CardHeader className="text-center pb-4">
          {/* Settings Row */}
          <div className="flex justify-between items-center mb-4">
            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <Select value={language} onValueChange={(val) => setLanguage(val as SupportedLanguage)}>
                <SelectTrigger className="w-[120px] h-8 text-sm">
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

            {/* Voice Settings */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Settings2 className="w-4 h-4" />
                  Voice
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Voice</Label>
                    <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select voice" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {voices.map((voice) => (
                          <SelectItem key={voice.name} value={voice.name}>
                            {voice.name.split(" ").slice(0, 3).join(" ")} ({voice.lang})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Speed: {speechRate.toFixed(1)}x</Label>
                    <Slider
                      value={[speechRate]}
                      onValueChange={([v]) => setSpeechRate(v)}
                      min={0.5}
                      max={2}
                      step={0.1}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Pitch: {pitch.toFixed(1)}</Label>
                    <Slider
                      value={[pitch]}
                      onValueChange={([v]) => setPitch(v)}
                      min={0.5}
                      max={2}
                      step={0.1}
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Main Action Circle */}
          <div className="mx-auto mb-4 relative">
            <button
              onClick={isConversationActive ? stopConversation : startConversation}
              disabled={isProcessing}
              className={cn(
                "w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/30",
                isProcessing
                  ? "bg-muted cursor-wait"
                  : isSpeaking
                    ? "bg-accent cursor-pointer"
                    : isListening
                      ? "bg-primary animate-pulse cursor-pointer"
                      : isConversationActive
                        ? "bg-primary/60 cursor-pointer"
                        : "bg-primary/80 hover:bg-primary cursor-pointer hover:scale-105"
              )}
            >
              {isProcessing ? (
                <Loader2 className="w-12 h-12 text-muted-foreground animate-spin" />
              ) : isSpeaking ? (
                <Volume2 className="w-12 h-12 text-accent-foreground animate-pulse" />
              ) : isListening ? (
                <Mic className="w-12 h-12 text-primary-foreground" />
              ) : isConversationActive ? (
                <MicOff className="w-12 h-12 text-primary-foreground" />
              ) : (
                <Mic className="w-12 h-12 text-primary-foreground" />
              )}
            </button>
            {isConversationActive && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-background animate-pulse" />
            )}
          </div>

          <CardTitle className="text-2xl">Your Travel Guide</CardTitle>
          <CardDescription className="text-base">
            {isProcessing
              ? "Thinking..."
              : isSpeaking
                ? "Speaking..."
                : isListening
                  ? "Listening..."
                  : isConversationActive
                    ? "Tap to stop conversation"
                    : "Tap to start talking"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Transcript Display */}
          {transcript && (
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">You:</p>
              <p className="text-sm text-foreground">{transcript}</p>
            </div>
          )}

          {/* Response Display */}
          {response && (
            <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-3 h-3 text-primary" />
                <p className="text-xs font-medium text-primary">Guide:</p>
              </div>
              <p className="text-sm text-foreground">{response}</p>
            </div>
          )}

          {/* Camera Section */}
          {capturedImage && (
            <div className="relative rounded-lg overflow-hidden">
              <img src={capturedImage} alt="Captured" className="w-full h-32 object-cover rounded-lg" />
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={() => setCapturedImage(null)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          )}

          {cameraActive && (
            <div className="relative rounded-lg overflow-hidden bg-black">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-32 object-cover" />
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                <Button onClick={captureImage} size="sm" className="gap-1 h-7 text-xs">
                  <Camera className="w-3 h-3" />
                  Capture
                </Button>
                <Button onClick={stopCamera} size="sm" variant="outline" className="gap-1 h-7 text-xs">
                  <CameraOff className="w-3 h-3" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {!cameraActive && !capturedImage && (
            <Button onClick={startCamera} variant="outline" size="sm" className="w-full gap-2">
              <Camera className="w-4 h-4" />
              Identify Monument
            </Button>
          )}

          <canvas ref={canvasRef} className="hidden" />

          {/* Quick Tips */}
          <div className="bg-muted/30 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">
              💡 Conversation continues automatically. Just speak naturally!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceGuide;
