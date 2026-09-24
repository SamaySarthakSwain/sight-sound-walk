/**
 * Modified to bypass Supabase.
 * Always returns null to force Web Speech API fallback.
 */

export const ELEVENLABS_INDIAN_FEMALE_VOICE_ID = "amiAXapsDOAiHJqbsAZj";

export interface PlayElevenLabsOptions {
  voiceId?: string;
}

export async function fetchElevenLabsAudio(
  text: string,
  options: PlayElevenLabsOptions = {}
): Promise<{ audio: HTMLAudioElement; revoke: () => void } | null> {
  // Return null to trigger Web Speech API fallback in the frontend
  return null;
}
