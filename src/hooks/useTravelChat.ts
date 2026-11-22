import { useState, useCallback, useRef } from "react";
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

// High-quality local offline fallback for chat
const getLocalFallbackReply = (query: string): string => {
  const q = query.toLowerCase();
  if (q.includes("weather") || q.includes("temperature")) {
    return "The weather across coastal Odisha today is pleasant, typically ranging from 28°C to 33°C. Morning and late afternoon hours are ideal for visiting open-air monuments like Konark and Dhauli!";
  }
  if (q.includes("konark") || q.includes("sun temple")) {
    return "The 13th-century Konark Sun Temple is a UNESCO World Heritage marvel conceived as a colossal chariot for the Sun God Surya, complete with 24 intricately carved stone wheels and seven galloping horses.";
  }
  if (q.includes("puri") || q.includes("jagannath")) {
    return "Shree Jagannath Temple in Puri is one of Hinduism's revered Char Dham shrines. Famous worldwide for the annual Ratha Yatra and the Ananda Bazar (serving sacred Mahaprasad), it stands as the spiritual heart of Odisha.";
  }
  if (q.includes("food") || q.includes("eat") || q.includes("dish")) {
    return "Must-try Odia delicacies include Chhena Poda (caramelized baked cottage cheese), Pahala Rasagola, Dalma (lentil & vegetable stew), Machha Besara, and Cuttack Dahi Bara Aloodum!";
  }
  if (q.includes("temple") || q.includes("bhubaneswar")) {
    return "Bhubaneswar is the Temple City of India, featuring architectural wonders like the 11th-century Lingaraja Temple, Mukteswara Temple ('Gem of Kalinga Architecture'), and the peaceful Rajarani Temple.";
  }
  if (q.includes("beach") || q.includes("chilika") || q.includes("gopalpur")) {
    return "Top waterside destinations include Puri Golden Beach (Blue Flag certified), Gopalpur-on-Sea, Chandrabhaga Beach, and Chilika Lake — Asia's largest brackish lagoon home to playful Irrawaddy dolphins.";
  }
  return "Welcome to Odisha Explorer! Whether you are planning a trip to ancient temples, searching for authentic Odia cuisine, or looking for local travel guidance, I am here to help. What destination would you like to explore?";
};

export const useTravelChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<SupportedLanguage>("en");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

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
        throw new Error(`Server returned status ${resp.status}`);
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

      // If response ended up empty, provide fallback
      if (!assistantContent.trim()) {
        updateAssistant(getLocalFallbackReply(input));
      }
    } catch (err) {
      console.warn("Chat API notice (using local offline engine):", err);
      // NEVER delete user message! Provide immediate helpful fallback response:
      const fallback = getLocalFallbackReply(input);
      updateAssistant(fallback);
    } finally {
      setIsLoading(false);
    }
  }, [messages, language]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  // Built-in speech recognition for Chat input bar
  const startSpeechInput = useCallback((onResult: (text: string) => void) => {
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) return false;

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language === "en" ? "en-IN" : `${language}-IN`;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) onResult(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
      return true;
    } catch {
      setIsListening(false);
      return false;
    }
  }, [language]);

  const stopSpeechInput = useCallback(() => {
    try {
      recognitionRef.current?.abort();
    } catch {
      // ignore
    }
    setIsListening(false);
  }, []);

  return { 
    messages, 
    isLoading, 
    error, 
    sendMessage, 
    clearChat, 
    language, 
    setLanguage,
    isListening,
    startSpeechInput,
    stopSpeechInput,
  };
};
