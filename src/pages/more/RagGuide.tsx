import { useState, useRef, useEffect } from "react";
import { getApiUrl } from "@/lib/apiConfig";
import { Sparkles, Send, Loader2 } from "lucide-react";
import MorePageShell from "@/components/MorePageShell";


interface Msg { role: "user" | "assistant"; content: string; citations?: string[] }

const SUGGESTIONS = [
  "What time does Jagannath Temple open?",
  "What's the etiquette at Lingaraj Temple?",
  "Best month to visit Konark?",
  "Which Odia festival is happening this month?",
];

const RagGuide = () => {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Namaskar! I'm your Odisha local guide. Ask me about temple timings, festivals, etiquette, or anything about exploring the region." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const response = await fetch(getApiUrl("/api/ai/rag-guide"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text, mode: "qa" }),
      });
      
      if (!response.ok) throw new Error("Failed to reach guide");
      
      const data = await response.json();
      setMessages([...next, { role: "assistant", content: data.result, citations: [] }]);
    } catch (e) {
      setMessages([...next, { role: "assistant", content: "I couldn't reach the knowledge base just now. Please try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MorePageShell
      title="Local Guide"
      subtitle="Answers grounded in curated Odisha knowledge."
      icon={Sparkles}
      badge="Beta"
    >
      <div className="mx-auto max-w-3xl">
        <div
          ref={scrollRef}
          className="min-h-[420px] max-h-[60vh] overflow-y-auto space-y-4 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-4 md:p-6 backdrop-blur-xl"
        >
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-white/5 border border-white/10 text-foreground"
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>
                {m.citations && m.citations.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {m.citations.map((c, ci) => (
                      <span key={ci} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl px-4 py-3 bg-white/5 border border-white/10">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            </div>
          )}
        </div>

        {messages.length <= 1 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="text-xs px-3 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => { e.preventDefault(); send(input); }}
          className="mt-4 flex gap-2 rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-xl"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Odisha…"
            className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition"
          >
            <Send className="h-4 w-4" /> Ask
          </button>
        </form>
      </div>
    </MorePageShell>
  );
};

export default RagGuide;
