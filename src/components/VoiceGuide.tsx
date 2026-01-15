import { useState, useCallback, useRef, useEffect } from "react";
import { Mic, MicOff, Volume2, Loader2, Camera, CameraOff, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
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

const speechLangCodes: Record<SupportedLanguage, string> = {
  en: "en-IN",
  hi: "hi-IN",
  or: "or-IN",
  te: "te-IN",
  bn: "bn-IN",
};

const VoiceGuide = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [language, setLanguage] = useState<SupportedLanguage>("en");
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const { toast } = useToast();

  // Initialize speech synthesis
  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      stopCamera();
    };
  }, []);

  // Initialize speech recognition
  const initRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({
        variant: "destructive",
        title: "Not Supported",
        description: "Speech recognition is not supported in your browser. Try Chrome or Edge.",
      });
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = speechLangCodes[language];

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
        handleUserInput(finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      if (event.error !== "aborted") {
        toast({
          variant: "destructive",
          title: "Listening Error",
          description: "Could not understand. Please try again.",
        });
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    return recognition;
  }, [language, toast]);

  // Handle user input (voice or image)
  const handleUserInput = async (userMessage: string) => {
    setIsProcessing(true);
    setResponse("");

    try {
      const { data, error } = await supabase.functions.invoke("gemini-voice-guide", {
        body: {
          message: userMessage,
          image: capturedImage,
          language,
        },
      });

      if (error) throw error;

      const aiResponse = data?.response || "I'm sorry, I couldn't process that.";
      setResponse(aiResponse);
      speakResponse(aiResponse);
      setCapturedImage(null); // Clear image after processing
    } catch (err) {
      console.error("API error:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get response. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Text to speech
  const speakResponse = (text: string) => {
    if (!synthRef.current) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = speechLangCodes[language];
    utterance.rate = 0.9;
    utterance.pitch = 1;

    // Try to find a voice for the language
    const voices = synthRef.current.getVoices();
    const langVoice = voices.find(v => v.lang.startsWith(language === "or" ? "or" : speechLangCodes[language].split("-")[0]));
    if (langVoice) {
      utterance.voice = langVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  // Start listening
  const startListening = () => {
    if (isSpeaking) {
      synthRef.current?.cancel();
      setIsSpeaking(false);
    }

    const recognition = initRecognition();
    if (recognition) {
      recognitionRef.current = recognition;
      recognition.start();
    }
  };

  // Stop listening
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  // Camera functions
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Use back camera on mobile
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch (err) {
      console.error("Camera error:", err);
      toast({
        variant: "destructive",
        title: "Camera Error",
        description: "Could not access camera. Please check permissions.",
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
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
      const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
      setCapturedImage(dataUrl);
      stopCamera();
      
      toast({
        title: "Photo Captured!",
        description: "Now tap the mic and ask about this monument.",
      });
    }
  };

  const clearImage = () => {
    setCapturedImage(null);
  };

  const isActive = isListening || isSpeaking || isProcessing;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="border-2 border-primary/20 shadow-xl">
        <CardHeader className="text-center pb-4">
          {/* Language Selector */}
          <div className="flex justify-end mb-4">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <Select value={language} onValueChange={(val) => setLanguage(val as SupportedLanguage)}>
                <SelectTrigger className="w-[140px] h-9">
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

          {/* Main Action Circle */}
          <div className="mx-auto mb-4 relative">
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={isProcessing}
              className={cn(
                "w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 focus:outline-none focus:ring-4 focus:ring-primary/30",
                isProcessing
                  ? "bg-muted cursor-wait"
                  : isSpeaking
                    ? "bg-accent animate-pulse cursor-pointer"
                    : isListening
                      ? "bg-primary animate-pulse cursor-pointer"
                      : "bg-primary/80 hover:bg-primary cursor-pointer hover:scale-105"
              )}
            >
              {isProcessing ? (
                <Loader2 className="w-12 h-12 text-muted-foreground animate-spin" />
              ) : isSpeaking ? (
                <Volume2 className="w-12 h-12 text-accent-foreground animate-pulse" />
              ) : isListening ? (
                <Mic className="w-12 h-12 text-primary-foreground animate-pulse" />
              ) : (
                <Mic className="w-12 h-12 text-primary-foreground" />
              )}
            </button>
            {isActive && (
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
                  ? "Listening... Speak now!"
                  : "Tap the mic to start talking"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Transcript Display */}
          {transcript && (
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">You said:</p>
              <p className="text-foreground">{transcript}</p>
            </div>
          )}

          {/* Response Display */}
          {response && (
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <p className="text-sm font-medium text-primary">Guide Response:</p>
              </div>
              <p className="text-foreground">{response}</p>
            </div>
          )}

          {/* Camera Section */}
          <div className="space-y-4">
            {/* Captured Image Preview */}
            {capturedImage && (
              <div className="relative rounded-lg overflow-hidden">
                <img 
                  src={capturedImage} 
                  alt="Captured" 
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2"
                  onClick={clearImage}
                >
                  <X className="w-4 h-4" />
                </Button>
                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                  📸 Ready to identify - tap mic and ask!
                </div>
              </div>
            )}

            {/* Camera View */}
            {cameraActive && (
              <div className="relative rounded-lg overflow-hidden bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                  <Button onClick={captureImage} size="sm" className="gap-2">
                    <Camera className="w-4 h-4" />
                    Capture
                  </Button>
                  <Button onClick={stopCamera} size="sm" variant="outline" className="gap-2">
                    <CameraOff className="w-4 h-4" />
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Camera Button */}
            {!cameraActive && !capturedImage && (
              <Button
                onClick={startCamera}
                variant="outline"
                className="w-full gap-2"
              >
                <Camera className="w-4 h-4" />
                Take Photo of Monument
              </Button>
            )}
          </div>

          {/* Hidden canvas for image capture */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Tips */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-sm">Try asking:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• "What are the best temples to visit?"</li>
              <li>• "Tell me about Konark Sun Temple"</li>
              <li>• "Where can I find good seafood?"</li>
              <li>• 📸 Take a photo and ask "What is this monument?"</li>
            </ul>
          </div>

          {/* Language Note */}
          <p className="text-xs text-center text-muted-foreground">
            Powered by Gemini AI • Supports English, Hindi, Odia, Telugu & Bengali
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceGuide;
