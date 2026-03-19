/**
 * Central TTS (text-to-speech) configuration for the app.
 * Change these to control which voice is used for "Listen" and other speech across the site.
 */

/** Preferred language for speech (BCP 47). en-IN = English (India). */
export const TTS_LANG = "en-IN";

/**
 * Optional: force a specific voice by name (e.g. Indian female).
 * Leave undefined to auto-prefer Indian female voices (e.g. Veena, Lekha, or en-IN/hi-IN with "female" in name).
 *
 * To see voices on your device, run in the browser console:
 *   speechSynthesis.getVoices().forEach(v => console.log(v.name, v.lang))
 *
 * Indian female voice examples (varies by OS/browser):
 *   macOS:   "Veena" (en-IN), "Lekha" (hi-IN)
 *   Windows: e.g. "Microsoft Priya - English (India)" if available
 */
export const TTS_VOICE_NAME: string | undefined = undefined;

/** Indian locale codes to prefer when picking a voice. */
const INDIAN_LANGS = ["en-IN", "hi-IN", "or-IN", "te-IN", "bn-IN", "ta-IN", "mr-IN", "kn-IN"];

/** Substrings that often appear in Indian voice names (any platform). */
const INDIAN_VOICE_NAME_HINTS = ["india", "indian", "ravi", "hemant", "veena", "lekha", "hindi", "odia", "bengali", "telugu", "tamil", "marathi", "kannada"];

/** Substrings that often indicate a female voice (names vary by OS/browser). */
const FEMALE_VOICE_NAME_HINTS = ["female", "woman", "veena", "lekha", "priya", "sangeeta", "aishwarya"];

function voiceNameLooksIndian(name: string): boolean {
  const lower = name.toLowerCase();
  return INDIAN_VOICE_NAME_HINTS.some((hint) => lower.includes(hint));
}

function voiceNameLooksFemale(name: string): boolean {
  const lower = name.toLowerCase();
  return FEMALE_VOICE_NAME_HINTS.some((hint) => lower.includes(hint));
}

/**
 * Pick the preferred voice from the list.
 * Prefers Indian female voice when possible, then Indian voice, then first voice.
 */
export function getPreferredVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (!voices.length) return null;

  if (TTS_VOICE_NAME) {
    const byName = voices.find(
      (v) => v.name === TTS_VOICE_NAME || v.name.toLowerCase().includes(TTS_VOICE_NAME!.toLowerCase())
    );
    if (byName) return byName;
  }

  // Prefer Indian female: en-IN/hi-IN etc. and name suggests female (e.g. Veena, Lekha)
  const indianFemaleByLang = voices.find(
    (v) => INDIAN_LANGS.includes(v.lang) && voiceNameLooksFemale(v.name)
  );
  if (indianFemaleByLang) return indianFemaleByLang;

  const indianFemaleByName = voices.find(
    (v) => voiceNameLooksIndian(v.name) && voiceNameLooksFemale(v.name)
  );
  if (indianFemaleByName) return indianFemaleByName;

  const byLang = voices.find((v) => v.lang === TTS_LANG);
  if (byLang) return byLang;

  const byIndianLang = voices.find((v) => INDIAN_LANGS.includes(v.lang));
  if (byIndianLang) return byIndianLang;

  const byIndianName = voices.find((v) => voiceNameLooksIndian(v.name));
  if (byIndianName) return byIndianName;

  const langPrefix = TTS_LANG.split("-")[0];
  const byLangPrefix = voices.find((v) => v.lang.startsWith(langPrefix));
  if (byLangPrefix) return byLangPrefix;

  return voices[0];
}
