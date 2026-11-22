import { useState, FC } from "react";
import { Bot, User, Volume2, VolumeX, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAppTTS } from "@/hooks/useAppTTS";
import type { SupportedLanguage } from "@/hooks/useTravelChat";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  language?: SupportedLanguage;
}

// Lightweight Markdown Formatter for Assistant responses
const formatMessageContent = (text: string) => {
  if (!text) return null;

  const lines = text.split("\n");
  return lines.map((line, idx) => {
    const trimmed = line.trim();

    // Empty lines
    if (!trimmed) {
      return <div key={idx} className="h-2" />;
    }

    // Bullet points: - or *
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const itemText = trimmed.slice(2);
      return (
        <div key={idx} className="flex items-start gap-2 my-1 pl-1">
          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
          <span className="leading-relaxed">{renderBoldText(itemText)}</span>
        </div>
      );
    }

    // Numbered lists: 1. or 2.
    const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numberedMatch) {
      return (
        <div key={idx} className="flex items-start gap-2 my-1 pl-1">
          <span className="text-xs font-bold text-primary px-1.5 py-0.5 rounded bg-primary/10 flex-shrink-0">
            {numberedMatch[1]}
          </span>
          <span className="leading-relaxed">{renderBoldText(numberedMatch[2])}</span>
        </div>
      );
    }

    // Headings: ###
    if (trimmed.startsWith("### ")) {
      return (
        <h4 key={idx} className="font-bold text-sm text-foreground mt-3 mb-1">
          {renderBoldText(trimmed.slice(4))}
        </h4>
      );
    }
    if (trimmed.startsWith("## ")) {
      return (
        <h3 key={idx} className="font-bold text-base text-primary mt-3 mb-1.5">
          {renderBoldText(trimmed.slice(3))}
        </h3>
      );
    }

    return (
      <p key={idx} className="leading-relaxed my-0.5">
        {renderBoldText(trimmed)}
      </p>
    );
  });
};

// Render **bold** segments safely
const renderBoldText = (text: string) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
};

const ChatMessage: FC<ChatMessageProps> = ({ role, content }) => {
  const isUser = role === "user";
  const { speak, stop, isSpeaking } = useAppTTS();
  const [copied, setCopied] = useState(false);

  const handleSpeak = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(content);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("flex gap-3 p-4 transition-colors", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center shadow-md">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      <div className={cn("flex flex-col gap-1.5", isUser ? "max-w-[85%] sm:max-w-[75%]" : "max-w-[90%] sm:max-w-[80%]")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-3 shadow-sm border",
            isUser
              ? "bg-primary text-primary-foreground rounded-br-sm border-primary/20"
              : "bg-card/70 text-foreground rounded-bl-sm border-border/40 backdrop-blur-md"
          )}
        >
          {isUser ? (
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{content}</p>
          ) : (
            <div className="text-sm space-y-0.5 font-sans leading-relaxed">
              {formatMessageContent(content)}
            </div>
          )}
        </div>

        {!isUser && content && (
          <div className="flex items-center gap-1 self-start pt-0.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSpeak}
              className={cn(
                "h-7 px-2.5 text-xs gap-1.5 rounded-lg border border-transparent hover:border-border/50",
                isSpeaking ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-primary animate-pulse" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen</span>
                </>
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-7 px-2 text-xs gap-1 rounded-lg text-muted-foreground hover:text-foreground"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-500" />
                  <span className="text-[11px] text-green-500">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Copy</span>
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center shadow-sm">
          <User className="w-4 h-4 text-secondary-foreground" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
