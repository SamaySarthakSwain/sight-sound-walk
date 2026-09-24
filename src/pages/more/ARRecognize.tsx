import { useRef, useState } from "react";
import { Camera, Loader2, Upload } from "lucide-react";
import MorePageShell from "@/components/MorePageShell";

const ARRecognize = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const analyze = async (file: File) => {
    setLoading(true);
    setResult("");
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setPreview(dataUrl);
      try {
        const response = await fetch("http://localhost:5000/api/ai/rag-guide", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            query: `Identify this monument or place based on architectural style typical of Odisha (Konark, Jagannath, Lingaraj, etc). If uncertain, describe what heritage feature you notice. Photo filename hint: ${file.name}.`,
            mode: "recognize",
            image: dataUrl
          }),
        });
        
        if (!response.ok) throw new Error("Failed to recognize");
        
        const data = await response.json();
        setResult(data.result || "Couldn't identify the monument.");
      } catch {
        setResult("Recognition service is offline. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <MorePageShell
      title="AR Monument Recognition"
      subtitle="Point, capture, learn — on-device vision assisted by cloud fallback."
      icon={Camera}
      badge="Beta"
    >
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] aspect-video backdrop-blur-xl">
          {preview ? (
            <img src={preview} alt="Captured" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
              <Camera className="h-10 w-10" />
              <p className="text-sm">Capture or upload a photo of an Odisha monument</p>
            </div>
          )}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) analyze(f); }}
          />
          <button
            onClick={() => inputRef.current?.click()}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
          >
            <Camera className="h-4 w-4" /> Capture
          </button>
          <button
            onClick={() => inputRef.current?.click()}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium hover:bg-white/10 transition"
          >
            <Upload className="h-4 w-4" /> Upload
          </button>
        </div>
        {result && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-relaxed">
            {result}
          </div>
        )}
      </div>
    </MorePageShell>
  );
};

export default ARRecognize;
