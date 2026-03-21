import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Send, Trash2, Bot, Sparkles, Globe, CloudSun, MessageSquare, Mic } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatMessage from "@/components/ChatMessage";
import VoiceGuide from "@/components/VoiceGuide";
import WeatherReport from "@/components/WeatherReport";
import { useTravelChat, languageLabels, type SupportedLanguage } from "@/hooks/useTravelChat";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const suggestedQuestions = [
  "What are the must-visit temples in Odisha?",
  "What's the weather like in Puri today?",
  "Tell me about Konark Sun Temple",
  "What local food should I try in Berhampur?",
];

const Assistant = () => {
  const location = useLocation();
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState(location.state?.proactiveMonument ? "voice" : "chat");
  const { messages, isLoading, error, sendMessage, clearChat, language, setLanguage } = useTravelChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput("");
  };

  const handleSuggestionClick = (question: string) => {
    if (isLoading) return;
    sendMessage(question);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <div className="pt-16 flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {/* Header with Tabs */}
        <div className="p-6 border-b border-border">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                  <Bot className="w-7 h-7 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Odisha Explorer</h1>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <CloudSun className="w-3.5 h-3.5" />
                    AI travel companion with live weather
                  </p>
                </div>
              </div>
              {activeTab === "chat" && (
                <div className="flex items-center gap-2">
                  {/* Language Selector */}
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <Select value={language} onValueChange={(val) => setLanguage(val as SupportedLanguage)}>
                      <SelectTrigger className="w-[140px] h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(languageLabels).map(([code, label]) => (
                          <SelectItem key={code} value={code}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {messages.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearChat}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
                  )}
                </div>
              )}
            </div>

            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="chat" className="gap-2">
                <MessageSquare className="h-4 w-4 hidden sm:block" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="voice" className="gap-2">
                <Mic className="h-4 w-4 hidden sm:block" />
                Audio
              </TabsTrigger>
              <TabsTrigger value="weather" className="gap-2">
                <CloudSun className="h-4 w-4 hidden sm:block" />
                Weather
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {activeTab === "chat" ? (
          <>
            {/* Chat Area */}
            <ScrollArea className="flex-1 h-[calc(100vh-300px)]" ref={scrollRef}>
              {messages.length === 0 ? (
                <div className="p-6 space-y-6">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                      <Sparkles className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">
                        Welcome to Odisha Explorer!
                      </h2>
                      <p className="text-muted-foreground mt-1">
                        Ask me anything about traveling in Odisha - destinations, weather, local tips, and more.
                      </p>
                      <p className="text-sm text-muted-foreground mt-2 flex items-center justify-center gap-2">
                        <CloudSun className="w-4 h-4" />
                        Real-time weather data included
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-medium text-muted-foreground text-center">
                      Try asking:
                    </p>
                    <div className="grid gap-2">
                      {suggestedQuestions.map((question, i) => (
                        <button
                          key={i}
                          onClick={() => handleSuggestionClick(question)}
                          className="text-left p-3 rounded-xl glass-panel glass-card-hover transition-colors text-sm text-foreground border-transparent"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="text-center text-xs text-muted-foreground">
                    Select your preferred language above. Responses and narration will be in your chosen language.
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {messages.map((msg, i) => (
                    <ChatMessage key={i} role={msg.role} content={msg.content} language={language} />
                  ))}
                  {isLoading && messages[messages.length - 1]?.role === "user" && (
                    <div className="flex gap-3 p-4">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <Bot className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                          <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:0.1s]" />
                          <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t border-border bg-background">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about Odisha destinations, weather, tips..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button type="submit" disabled={!input.trim() || isLoading}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </>
        ) : activeTab === "voice" ? (
          <div className="flex-1 py-8">
            <VoiceGuide />
          </div>
        ) : (
          <div className="flex-1 py-6 px-4">
            <WeatherReport />
          </div>
        )}
      </div>
    </div>
  );
};

export default Assistant;
