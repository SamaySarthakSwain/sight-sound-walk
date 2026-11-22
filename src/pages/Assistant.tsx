import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Send, Trash2, Bot, Sparkles, Globe, CloudSun, MessageSquare, Mic, MicOff, Compass, MapPin } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useTravelChat, SupportedLanguage, languageLabels } from "@/hooks/useTravelChat";
import ChatMessage from "@/components/ChatMessage";
import VoiceGuide from "@/components/VoiceGuide";
import WeatherReport from "@/components/WeatherReport";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

const quickPrompts = [
  "What are the top temples to visit in Bhubaneswar?",
  "Tell me the history of Konark Sun Temple",
  "What are the rituals at Jagannath Temple Puri?",
  "What authentic Odia dishes should I try?",
  "How can I travel from Bhubaneswar to Puri and Konark?",
  "What is the best time of year to visit Chilika Lake?",
];

const Assistant = () => {
  const location = useLocation();
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState(location.state?.proactiveMonument ? "voice" : "chat");
  const { 
    messages, 
    isLoading, 
    error, 
    sendMessage, 
    clearChat, 
    language, 
    setLanguage,
    isListening,
    startSpeechInput,
    stopSpeechInput
  } = useTravelChat();

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll chat to bottom smoothly
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, isLoading]);

  // Clean up any ongoing TTS speech when switching tabs or unmounting
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [activeTab]);

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

  const toggleSpeechInput = () => {
    if (isListening) {
      stopSpeechInput();
    } else {
      const ok = startSpeechInput((text) => {
        setInput(text);
      });
      if (!ok) {
        toast.info("Speech recognition is unavailable in this browser. Please type your query!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary/20">
      <Navigation />
      
      {/* Main Container */}
      <div className="pt-16 sm:pt-20 flex-1 flex flex-col max-w-4xl mx-auto w-full px-3 sm:px-6 pb-6">
        
        {/* Header with Navigation Tabs & Language Selector */}
        <div className="py-4 border-b border-border/60">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center shadow-lg shadow-primary/20">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
                    Odisha Explorer
                    <span className="text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20 rounded-full px-2 py-0.5">AI Companion</span>
                  </h1>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                    <Compass className="w-3.5 h-3.5 text-primary" />
                    <span>Real-time heritage guide, voice companion & weather</span>
                  </p>
                </div>
              </div>

              {/* Language Selector & Controls */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/50 border border-border/50 text-xs shadow-sm">
                  <Globe className="w-3.5 h-3.5 text-primary" />
                  <Select value={language} onValueChange={(val) => setLanguage(val as SupportedLanguage)}>
                    <SelectTrigger className="w-[125px] h-7 text-xs border-0 bg-transparent shadow-none focus:ring-0 px-1 font-medium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(languageLabels).map(([code, label]) => (
                        <SelectItem key={code} value={code} className="text-xs">
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {activeTab === "chat" && messages.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearChat}
                    className="h-8 px-2.5 text-xs text-muted-foreground hover:text-destructive rounded-full"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {/* Tab Pill Buttons */}
            <TabsList className="grid w-full max-w-md grid-cols-3 h-10 p-1 bg-muted/60 border border-border/40 rounded-2xl">
              <TabsTrigger value="chat" className="gap-2 text-xs font-semibold rounded-xl data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">
                <MessageSquare className="h-3.5 w-3.5" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="voice" className="gap-2 text-xs font-semibold rounded-xl data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">
                <Mic className="h-3.5 w-3.5" />
                Voice Guide
              </TabsTrigger>
              <TabsTrigger value="weather" className="gap-2 text-xs font-semibold rounded-xl data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">
                <CloudSun className="h-3.5 w-3.5" />
                Weather
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Tab 1: AI Chat Tab */}
        {activeTab === "chat" ? (
          <div className="flex-1 min-h-0 flex flex-col mt-3 bg-card/40 rounded-3xl border border-border/50 shadow-xl overflow-hidden backdrop-blur-md">
            
            {/* Scrollable Message List */}
            <div 
              ref={scrollRef} 
              className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 min-h-[350px] max-h-[calc(100vh-280px)] scroll-smooth"
            >
              {messages.length === 0 ? (
                <div className="py-8 px-2 max-w-lg mx-auto text-center space-y-6 animate-in fade-in duration-300">
                  <div className="w-16 h-16 mx-auto rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-inner">
                    <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">
                      Welcome to Odisha Explorer!
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                      Ask anything about UNESCO heritage monuments, temple rituals, local Odia delicacies, cab routes, or real-time weather.
                    </p>
                  </div>

                  {/* Starter Suggestions */}
                  <div className="space-y-2 text-left pt-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80 px-1">
                      Popular Questions:
                    </p>
                    <div className="grid gap-2">
                      {quickPrompts.slice(0, 4).map((q, i) => (
                        <button
                          key={i}
                          onClick={() => handleSuggestionClick(q)}
                          className="text-left p-3 rounded-2xl bg-muted/40 hover:bg-primary/10 border border-border/40 hover:border-primary/30 transition-all text-xs text-foreground font-medium flex items-center justify-between group shadow-sm"
                        >
                          <span>{q}</span>
                          <Send className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence initial={false}>
                    {messages.map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChatMessage role={msg.role} content={msg.content} language={language} />
                      </motion.div>
                    ))}
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3 p-4 items-center"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center shadow">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-muted/70 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5 border border-border/40">
                          <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Quick Suggestion Chips (Horizontally Scrollable) */}
            {messages.length > 0 && (
              <div className="px-4 py-2 border-t border-border/40 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2 bg-muted/20">
                {quickPrompts.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(q)}
                    disabled={isLoading}
                    className="text-[11px] px-3 py-1 rounded-full bg-background/80 hover:bg-primary/10 border border-border/50 hover:border-primary/40 text-muted-foreground hover:text-foreground transition-all flex-shrink-0"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input Bar */}
            <div className="p-3 sm:p-4 border-t border-border/60 bg-background/90 backdrop-blur-md">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={toggleSpeechInput}
                  className={`h-10 w-10 rounded-2xl flex-shrink-0 border-border/60 transition-all ${
                    isListening 
                      ? "bg-red-500/20 text-red-500 border-red-500/40 animate-pulse" 
                      : "hover:bg-primary/10 hover:text-primary"
                  }`}
                  title={isListening ? "Stop listening" : "Speak question"}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>

                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isListening ? "Listening to your voice..." : "Ask about temples, history, food, weather, or rides..."}
                  disabled={isLoading}
                  className="flex-1 h-10 text-xs sm:text-sm rounded-2xl bg-muted/40 border-border/60 focus-visible:ring-primary shadow-inner"
                />

                <Button 
                  type="submit" 
                  aria-label="Send message" 
                  disabled={!input.trim() || isLoading}
                  className="h-10 px-4 rounded-2xl gap-1.5 shadow-md shadow-primary/20 font-semibold"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Send</span>
                </Button>
              </form>
            </div>
          </div>
        ) : activeTab === "voice" ? (
          /* Tab 2: Voice Guide Tab */
          <div className="flex-1 py-4 sm:py-6">
            <VoiceGuide language={language} onLanguageChange={setLanguage} />
          </div>
        ) : (
          /* Tab 3: Live Weather Report Tab */
          <div className="flex-1 py-4 sm:py-6">
            <WeatherReport />
          </div>
        )}
      </div>
    </div>
  );
};

export default Assistant;
