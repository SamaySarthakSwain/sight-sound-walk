import { useState, useCallback, useRef } from "react";
import { fetchElevenLabsAudio } from "@/lib/elevenlabsTts";
import { useTTSVoice } from "@/hooks/useTTSVoice";

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

  const speakWithWebSpeech = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (preferredVoice) {
        utterance.voice = preferredVoice;
        utterance.lang = preferredVoice.lang;
      } else {
        utterance.lang = lang;
      }
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
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
        // ignore pause errors (e.g. already stopped)
      }
      revokeRef.current?.();
      audioRef.current = null;
      revokeRef.current = null;
      isElevenLabsRef.current = false;
    } else {
      window.speechSynthesis?.cancel();
    }
    setIsSpeaking(false);
  }, []);

  const speak = useCallback(
    async (text: string) => {
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

      const result = await fetchElevenLabsAudio(cleanText);
      if (!result) {
        speakWithWebSpeech(cleanText);
        return;
      }

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
        speakWithWebSpeech(cleanText);
      };

      setIsSpeaking(true);
      try {
        await audio.play();
      } catch (err) {
        console.error("ElevenLabs play error:", err);
        revoke();
        audioRef.current = null;
        revokeRef.current = null;
        isElevenLabsRef.current = false;
        setIsSpeaking(false);
        speakWithWebSpeech(cleanText);
      }
    },
    [stop, speakWithWebSpeech]
  );

  return { speak, stop, isSpeaking };
}
