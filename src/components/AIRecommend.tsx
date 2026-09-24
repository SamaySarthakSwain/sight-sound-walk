import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Sparkles, Loader2, ArrowRight, Calendar } from "lucide-react";
import { toast } from "sonner";
import { getApiUrl } from "@/lib/apiConfig";

interface Recommendation {
  name: string;
  rating: number;
  description: string;
  best_time: string;
}

const AIRecommend = ({ onSelectMonument }: { onSelectMonument?: (name: string) => void }) => {
  const [interests, setInterests] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  const handleGetRecommendations = async () => {
    if (!interests.trim()) {
      toast.error("Please enter your interests first!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(getApiUrl("/api/recommend"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interests })
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
      }
      
      const data = await response.json();
      setRecommendations(data.recommendations || []);
      
      if (data.recommendations?.length === 0) {
         toast.info("No perfect matches found. Try different keywords.");
      } else {
         toast.success("AI found some great matches using real-world tourism data!");
      }
      
    } catch (error) {
      console.error(error);
      toast.error("Could not connect to AI backend. Make sure the backend is active.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass-card border-none mt-8 mb-8 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Sparkles className="w-6 h-6 text-primary animate-pulse" />
          AI Exploration Engine
        </CardTitle>
        <CardDescription className="text-base">
          Our AI has been trained on real Kaggle datasets of 100+ Indian destinations and Uber trip logs.
          <br />
          <span className="text-primary/80 font-medium">Try: "Buddhist architecture in hills" or "Beaches with clear water"</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2 p-1 bg-muted/30 rounded-lg border border-border/50">
          <Input 
            placeholder="What kind of vibe are you looking for?" 
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGetRecommendations()}
            className="flex-1 border-none bg-transparent focus-visible:ring-0 text-lg h-12"
          />
          <Button onClick={handleGetRecommendations} disabled={loading} size="lg" className="gap-2 shadow-lg">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            {loading ? "Analyzing..." : "Discover"}
          </Button>
        </div>
        
        {recommendations.length > 0 && (
          <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="font-semibold text-xl flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Top Personalized Matches
            </h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recommendations.map((rec, i) => (
                <Card key={i} className="group relative bg-background/40 hover:bg-background/60 transition-all duration-300 border-primary/10 hover:border-primary/30 hover:shadow-xl hover:-translate-y-1">
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full text-xs font-bold text-primary">
                    ★ {rec.rating.toFixed(1)}
                  </div>
                  <CardContent className="p-5 flex flex-col h-full">
                    <div className="mb-3">
                      <h4 className="font-bold text-xl group-hover:text-primary transition-colors">{rec.name}</h4>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Calendar className="w-3 h-3" />
                        <span>Best: {rec.best_time}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground/90 flex-grow leading-relaxed line-clamp-4 italic">
                      "{rec.description}"
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-5 w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                      onClick={() => onSelectMonument && onSelectMonument(rec.name)}
                    >
                      Plan My Visit <ArrowRight className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIRecommend;
