import { useState, useCallback, useRef, useEffect } from "react";
import { fetchElevenLabsAudio } from "@/lib/elevenlabsTts";
import { useTTSVoice } from "@/hooks/useTTSVoice";

declare global {
  interface Window {
    __currentSpeechUtterance?: SpeechSynthesisUtterance | null;
  }
}

/**
 * App-wide TTS: ElevenLabs (Indian female voice) first, Web Speech as fallback.
 * Use for all "Listen" actions across the site.
 */
export function useAppTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { preferredVoice, lang } = useTTSVoice();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const revokeRef = useRef<(() => void) | null>(null);
  const isElevenLabsRef = useRef(false);

  useEffect(() => {
    return () => {
      // Clean up audio on unmount
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (audioRef.current) {
        try {
          audioRef.current.pause();
        } catch {
          // ignore
        }
      }
      revokeRef.current?.();
    };
  }, []);

  const langMap: Record<string, string> = {
    en: "en-IN",
    hi: "hi-IN",
    or: "or-IN",
    te: "te-IN",
    bn: "bn-IN",
  };

  const speakWithWebSpeech = useCallback(
    (text: string, langCode: string = "en") => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();

      const targetLang = langMap[langCode] || langCode || "en-IN";
      const utterance = new SpeechSynthesisUtterance(text);
      
      const voices = window.speechSynthesis.getVoices();
      // Try to find a voice matching the target language
      const matchVoice = voices.find(v => v.lang.toLowerCase().startsWith(targetLang.split("-")[0].toLowerCase()));

      if (matchVoice) {
        utterance.voice = matchVoice;
        utterance.lang = matchVoice.lang;
      } else if (preferredVoice && (targetLang.startsWith("en") || !preferredVoice.lang.startsWith("en"))) {
        utterance.voice = preferredVoice;
        utterance.lang = preferredVoice.lang;
      } else {
        utterance.lang = targetLang;
      }
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Keep reference to prevent Chromium garbage collection bug
      window.__currentSpeechUtterance = utterance;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        window.__currentSpeechUtterance = null;
        setIsSpeaking(false);
      };
      utterance.onerror = () => {
        window.__currentSpeechUtterance = null;
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
      isElevenLabsRef.current = false;
    },
    [preferredVoice, lang]
  );

  const stop = useCallback(() => {
    if (isElevenLabsRef.current && audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } catch {
        // ignore pause errors
      }
      revokeRef.current?.();
      audioRef.current = null;
      revokeRef.current = null;
      isElevenLabsRef.current = false;
    } else if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      window.__currentSpeechUtterance = null;
    }
    setIsSpeaking(false);
  }, []);

  const speak = useCallback(
    async (text: string, langCode: string = "en") => {
      const cleanText = text
        .replace(/\*\*/g, "")
        .replace(/\*/g, "")
        .replace(/#{1,6}\s/g, "")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/`[^`]+`/g, "")
        .replace(/\n+/g, ". ")
        .trim();
      if (!cleanText) return;

      stop();

      // Only attempt ElevenLabs for English; use native Web Speech for Indic languages for 100% accuracy
      if (langCode === "en") {
        const result = await fetchElevenLabsAudio(cleanText);
        if (result) {
          const { audio, revoke } = result;
          audioRef.current = audio;
          revokeRef.current = revoke;
          isElevenLabsRef.current = true;

          audio.onended = () => {
            revoke();
            audioRef.current = null;
            revokeRef.current = null;
            isElevenLabsRef.current = false;
            setIsSpeaking(false);
          };
          audio.onerror = () => {
            revoke();
            audioRef.current = null;
            revokeRef.current = null;
            isElevenLabsRef.current = false;
            setIsSpeaking(false);
            speakWithWebSpeech(cleanText, langCode);
          };

          setIsSpeaking(true);
          try {
            await audio.play();
            return;
          } catch (err) {
            console.error("ElevenLabs play error:", err);
            revoke();
            audioRef.current = null;
            revokeRef.current = null;
            isElevenLabsRef.current = false;
            setIsSpeaking(false);
          }
        }
      }

      speakWithWebSpeech(cleanText, langCode);
    },
    [stop, speakWithWebSpeech]
  );

  return { speak, stop, isSpeaking };
}
