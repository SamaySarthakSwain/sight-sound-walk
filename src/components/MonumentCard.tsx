import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Volume2, FileText, MapPin } from "lucide-react";
import { useState } from "react";

interface MonumentCardProps {
  title: string;
  description: string;
  location: string;
  category: string;
  imageUrl: string;
  facts: string[];
}

const MonumentCard = ({ title, description, location, category, imageUrl, facts }: MonumentCardProps) => {
  const [isReading, setIsReading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(description);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsReading(true);
      utterance.onend = () => setIsReading(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsReading(false);
  };

  return (
    <Card className="overflow-hidden hover:shadow-medium transition-smooth group">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
          {category}
        </Badge>
      </div>

      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          {location}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{description}</p>

        {showSummary && (
          <div className="p-4 rounded-lg bg-muted/50 space-y-2 animate-in fade-in slide-in-from-top-2">
            <h4 className="font-semibold">Historical Facts:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {facts.map((fact, i) => (
                <li key={i}>{fact}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={isReading ? handleStop : handleSpeak}
            className="flex-1 bg-secondary hover:bg-secondary/90"
          >
            <Volume2 className="w-4 h-4 mr-2" />
            {isReading ? "Stop" : "Listen"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowSummary(!showSummary)}
            className="flex-1"
          >
            <FileText className="w-4 h-4 mr-2" />
            {showSummary ? "Hide" : "Read"} Summary
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonumentCard;
