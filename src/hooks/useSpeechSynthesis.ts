import { useState, useEffect, useCallback, useRef } from "react";
import type { SupportedLanguage } from "./useTravelChat";

// Language codes for Web Speech API
const speechLanguageCodes: Record<SupportedLanguage, string> = {
  en: "en-IN",
  hi: "hi-IN",
  or: "or-IN", // Odia
  te: "te-IN", // Telugu
  bn: "bn-IN", // Bengali
};

// Fallback language codes if primary is not available
const fallbackCodes: Record<SupportedLanguage, string[]> = {
  en: ["en-US", "en-GB", "en"],
  hi: ["hi", "hi-IN"],
  or: ["or", "hi-IN"], // Fallback to Hindi if Odia not available
  te: ["te", "te-IN"],
  bn: ["bn", "bn-IN"],
};

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsSupported(true);

      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;

      return () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, []);

  const getVoiceForLanguage = useCallback((lang: SupportedLanguage): SpeechSynthesisVoice | null => {
    if (availableVoices.length === 0) return null;

    // Try primary language code
    const primaryCode = speechLanguageCodes[lang];
    let voice = availableVoices.find(v => v.lang === primaryCode);
    if (voice) return voice;

    // Try fallback codes
    const fallbacks = fallbackCodes[lang];
    for (const code of fallbacks) {
      voice = availableVoices.find(v => v.lang.startsWith(code));
      if (voice) return voice;
    }

    // Last resort: find any voice that includes the language code
    voice = availableVoices.find(v => v.lang.toLowerCase().includes(lang));

    return voice || availableVoices[0] || null;
  }, [availableVoices]);

  const speak = useCallback((text: string, lang: SupportedLanguage = "en") => {
    if (!isSupported) return;

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    // Clean text for better speech (remove markdown)
    const cleanText = text
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/#{1,6}\s/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/`[^`]+`/g, "")
      .replace(/\n+/g, ". ")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utteranceRef.current = utterance;

    const voice = getVoiceForLanguage(lang);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = speechLanguageCodes[lang];
    }

    utterance.rate = 1.1;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [isSupported, getVoiceForLanguage]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [isSupported]);

  return { speak, stop, isSpeaking, isSupported };
};
