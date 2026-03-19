import { Bot, User, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAppTTS } from "@/hooks/useAppTTS";
import type { SupportedLanguage } from "@/hooks/useTravelChat";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  language?: SupportedLanguage;
}

const ChatMessage = ({ role, content }: ChatMessageProps) => {
  const isUser = role === "user";
  const { speak, stop, isSpeaking } = useAppTTS();

  const handleSpeak = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(content);
    }
  };

  return (
    <div className={cn("flex gap-3 p-4", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <Bot className="w-5 h-5 text-primary-foreground" />
        </div>
      )}
      <div className="flex flex-col gap-1 max-w-[80%]">
        <div
          className={cn(
            "rounded-2xl px-4 py-3",
            isUser
              ? "bg-primary text-primary-foreground rounded-br-sm"
              : "bg-muted text-foreground rounded-bl-sm"
          )}
        >
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{content}</p>
        </div>
        {!isUser && content && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSpeak}
            className={cn(
              "self-start h-7 px-2 text-xs gap-1",
              isSpeaking ? "text-primary" : "text-muted-foreground"
            )}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                Stop
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5" />
                Listen
              </>
            )}
          </Button>
        )}
      </div>
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
          <User className="w-5 h-5 text-secondary-foreground" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
