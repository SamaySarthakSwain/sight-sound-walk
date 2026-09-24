import { useRef, useState } from "react";
import { Languages, Loader2, Camera } from "lucide-react";
import MorePageShell from "@/components/MorePageShell";

const ARTranslate = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [translated, setTranslated] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const translateText = async (input: string) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/ai/rag-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input, mode: "translate" }),
      });
      if (!response.ok) throw new Error("Failed to translate");
      const data = await response.json();
      setTranslated(data.result || "");
    } catch {
      setTranslated("Translation unavailable right now.");
    } finally {
      setLoading(false);
    }
  };

  const onFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <MorePageShell
      title="AR Text Translate"
      subtitle="Odia ↔ English translation for signboards, menus, and inscriptions."
      icon={Languages}
      badge="Beta"
    >
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] aspect-[4/3] backdrop-blur-xl">
          {preview ? (
            <img src={preview} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
              <Camera className="h-10 w-10" />
              <p className="text-sm">Snap or upload a sign to overlay reference</p>
            </div>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }}
        />
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium hover:bg-white/10 transition"
        >
          <Camera className="h-4 w-4" /> Capture reference photo
        </button>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <label className="text-xs uppercase tracking-wider text-muted-foreground">Text to translate</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={2}
            placeholder="ଏଠାରେ ଲେଖନ୍ତୁ… or type English"
            className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            onClick={() => translateText(text)}
            disabled={loading || !text.trim()}
            className="mt-3 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Languages className="h-4 w-4" />}
            Translate
          </button>
        </div>

        {translated && (
          <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4 text-sm leading-relaxed">
            {translated}
          </div>
        )}
      </div>
    </MorePageShell>
  );
};

export default ARTranslate;
