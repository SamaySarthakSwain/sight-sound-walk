import { useState, useCallback } from "react";
import { getApiUrl } from "@/lib/apiConfig";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export type SupportedLanguage = "en" | "hi" | "or" | "te" | "bn";

export const languageLabels: Record<SupportedLanguage, string> = {
  en: "English",
  hi: "हिंदी (Hindi)",
  or: "ଓଡ଼ିଆ (Odia)",
  te: "తెలుగు (Telugu)",
  bn: "বাংলা (Bengali)",
};

const getChatUrl = () => getApiUrl("/api/ai/travel-assistant");

// Keywords that might indicate weather-related queries
const weatherKeywords = ["weather", "temperature", "rain", "hot", "cold", "humid", "monsoon", "climate", "forecast"];
const locationKeywords = ["bhubaneswar", "puri", "konark", "cuttack", "berhampur", "gopalpur", "chilika", "sambalpur", "rourkela", "taptapani", "odisha"];

export const useTravelChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<SupportedLanguage>("en");

  const sendMessage = useCallback(async (input: string) => {
    const userMsg: ChatMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    let assistantContent = "";

    const updateAssistant = (chunk: string) => {
      assistantContent += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => 
            i === prev.length - 1 ? { ...m, content: assistantContent } : m
          );
        }
        return [...prev, { role: "assistant", content: assistantContent }];
      });
    };

    // Detect if weather info is needed
    const lowerInput = input.toLowerCase();
    const includeWeather = weatherKeywords.some(kw => lowerInput.includes(kw));
    
    // Extract location from query
    let weatherLocation = "";
    for (const loc of locationKeywords) {
      if (lowerInput.includes(loc)) {
        weatherLocation = loc;
        break;
      }
    }
    // Default to Bhubaneswar if asking about weather but no specific location
    if (includeWeather && !weatherLocation) {
      weatherLocation = "bhubaneswar";
    }

    try {
      const resp = await fetch(getChatUrl(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          messages: [...messages, userMsg],
          language,
          includeWeather,
          weatherLocation,
        }),
      });

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed with status ${resp.status}`);
      }

      if (!resp.body) {
        throw new Error("No response body");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) updateAssistant(content);
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (err) {
      console.error("Chat error:", err);
      setError(err instanceof Error ? err.message : "Failed to send message");
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  }, [messages, language]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, isLoading, error, sendMessage, clearChat, language, setLanguage };
};
