import { useState, useCallback } from "react";
import { useConversation } from "@elevenlabs/react";
import { Mic, MicOff, Volume2, Loader2, Phone, PhoneOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const VoiceGuide = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to voice guide");
      toast({
        title: "Connected!",
        description: "Your travel guide is ready. Start speaking!",
      });
    },
    onDisconnect: () => {
      console.log("Disconnected from voice guide");
    },
    onMessage: (message) => {
      console.log("Message:", message);
    },
    onError: (error) => {
      console.error("Voice guide error:", error);
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Failed to connect. Please try again.",
      });
    },
  });

  const startConversation = useCallback(async () => {
    setIsConnecting(true);
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Get signed URL from edge function
      const { data, error } = await supabase.functions.invoke(
        "elevenlabs-conversation-token"
      );

      if (error) {
        throw new Error(error.message || "Failed to get connection token");
      }

      if (!data?.signed_url) {
        throw new Error("No signed URL received");
      }

      // Start the conversation with WebSocket
      await conversation.startSession({
        signedUrl: data.signed_url,
      });
    } catch (error) {
      console.error("Failed to start conversation:", error);
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Please check your microphone permissions and try again.",
      });
    } finally {
      setIsConnecting(false);
    }
  }, [conversation, toast]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const isConnected = conversation.status === "connected";
  const isSpeaking = conversation.isSpeaking;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="border-2 border-primary/20 shadow-xl">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 relative">
            <div
              className={cn(
                "w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500",
                isConnected
                  ? isSpeaking
                    ? "bg-primary animate-pulse"
                    : "bg-primary/80"
                  : "bg-muted"
              )}
            >
              {isConnecting ? (
                <Loader2 className="w-12 h-12 text-primary-foreground animate-spin" />
              ) : isConnected ? (
                isSpeaking ? (
                  <Volume2 className="w-12 h-12 text-primary-foreground animate-pulse" />
                ) : (
                  <Mic className="w-12 h-12 text-primary-foreground" />
                )
              ) : (
                <MicOff className="w-12 h-12 text-muted-foreground" />
              )}
            </div>
            {isConnected && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-background" />
            )}
          </div>
          <CardTitle className="text-2xl">Your Travel Guide</CardTitle>
          <CardDescription className="text-base">
            {isConnected
              ? isSpeaking
                ? "I'm speaking..."
                : "Listening... Go ahead, ask me anything!"
              : "Tap the button below to start talking with your local guide"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Indicator */}
          <div className="flex items-center justify-center gap-2 text-sm">
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                isConnected ? "bg-green-500" : "bg-muted-foreground"
              )}
            />
            <span className="text-muted-foreground">
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>

          {/* Main Action Button */}
          <div className="flex justify-center">
            {!isConnected ? (
              <Button
                onClick={startConversation}
                disabled={isConnecting}
                size="lg"
                className="gap-2 px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Phone className="w-5 h-5" />
                    Start Talking
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={stopConversation}
                variant="destructive"
                size="lg"
                className="gap-2 px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                <PhoneOff className="w-5 h-5" />
                End Conversation
              </Button>
            )}
          </div>

          {/* Tips */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-sm">You can ask me about:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Nearby tourist places and hidden gems</li>
              <li>• Local food recommendations and restaurants</li>
              <li>• Cultural facts and interesting stories</li>
              <li>• Route and travel tips</li>
              <li>• Cab services and price expectations</li>
              <li>• Safety tips and emergency help</li>
            </ul>
          </div>

          {/* Language Note */}
          <p className="text-xs text-center text-muted-foreground">
            I can help you in English, Hindi, and Odia. Just speak naturally!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceGuide;
