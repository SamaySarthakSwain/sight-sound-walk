/**
 * Shared ElevenLabs TTS via Supabase edge function.
 * Uses Indian female voice (Priya) by default across the site.
 */

const TTS_BASE = typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_URL
  ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`
  : "";

/** ElevenLabs Priya - Indian English Female voice ID. */
export const ELEVENLABS_INDIAN_FEMALE_VOICE_ID = "amiAXapsDOAiHJqbsAZj";

export function getTtsUrl(): string {
  return TTS_BASE;
}

export function getTtsAuthHeaders(): Record<string, string> {
  const key = typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY
    ? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
    : "";
  return {
    "Content-Type": "application/json",
    apikey: key,
    Authorization: `Bearer ${key}`,
  };
}

export interface PlayElevenLabsOptions {
  voiceId?: string;
}

/**
 * Fetch TTS audio from edge function and return an Audio element ready to play.
 * Caller should call audio.play() and set onended/onerror.
 * Returns null if fetch fails (caller can fall back to Web Speech).
 */
export async function fetchElevenLabsAudio(
  text: string,
  options: PlayElevenLabsOptions = {}
): Promise<{ audio: HTMLAudioElement; revoke: () => void } | null> {
  const url = getTtsUrl();
  if (!url || !text?.trim()) return null;

  const voiceId = options.voiceId ?? ELEVENLABS_INDIAN_FEMALE_VOICE_ID;
  const resp = await fetch(url, {
    method: "POST",
    headers: getTtsAuthHeaders(),
    body: JSON.stringify({ text: text.trim(), voiceId }),
  });

  if (!resp.ok) return null;

  const blob = await resp.blob();
  const audioUrl = URL.createObjectURL(blob);
  const audio = new Audio(audioUrl);

  return {
    audio,
    revoke: () => URL.revokeObjectURL(audioUrl),
  };
}
