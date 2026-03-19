import { useState, useEffect } from "react";
import { getPreferredVoice, TTS_LANG } from "@/lib/tts";

/**
 * Loads voices and returns the app's preferred TTS voice.
 * Use this for Listen buttons and any in-app speech so one voice is used site-wide.
 */
export function useTTSVoice() {
  const [preferredVoice, setPreferredVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setPreferredVoice(getPreferredVoice(voices));
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  return { preferredVoice, lang: TTS_LANG };
}
