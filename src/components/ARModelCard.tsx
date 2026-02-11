import { useState, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Maximize2, RotateCcw, Eye, MapPin, ExternalLink } from "lucide-react";
import type { ARModel } from "@/data/arModels";

interface ARModelCardProps {
  model: ARModel;
}

const ARModelCard = ({ model }: ARModelCardProps) => {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Intersection observer for lazy loading
  const observerRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        },
        { rootMargin: "200px" }
      );
      observer.observe(node);
    },
    []
  );

  const handleFullscreen = () => {
    iframeRef.current?.requestFullscreen?.();
  };

  const handleReload = () => {
    if (iframeRef.current) {
      setLoaded(false);
      const src = iframeRef.current.src;
      iframeRef.current.src = "";
      setTimeout(() => {
        if (iframeRef.current) iframeRef.current.src = src;
      }, 100);
    }
  };

  return (
    <Card
      ref={(node) => {
        (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        observerRef(node);
      }}
      className="group overflow-hidden border-border/50 bg-card hover:shadow-medium transition-all duration-300"
    >
      {/* 3D Viewer */}
      <div className="relative w-full aspect-[4/3] bg-muted">
        {inView ? (
          <>
            {!loaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  <span className="text-sm text-muted-foreground">Loading 3D model…</span>
                </div>
              </div>
            )}
            <iframe
              ref={iframeRef}
              title={model.name}
              src={model.embedUrl}
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
              allow="autoplay; fullscreen; xr-spatial-tracking"
              allowFullScreen
              onLoad={() => setLoaded(true)}
            />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Eye className="h-8 w-8 text-muted-foreground/40" />
          </div>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg text-foreground leading-tight">{model.name}</h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
            <MapPin className="h-3.5 w-3.5" />
            {model.location}
          </p>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">{model.description}</p>

        <div className="flex flex-wrap gap-1.5">
          {model.categories.map((cat) => (
            <Badge key={cat} variant="secondary" className="text-xs">
              {cat}
            </Badge>
          ))}
        </div>

        <div className="flex gap-2 pt-1">
          <Button size="sm" variant="default" className="flex-1 gap-1.5" onClick={handleFullscreen}>
            <Maximize2 className="h-3.5 w-3.5" />
            Fullscreen
          </Button>
          <Button size="sm" variant="outline" className="gap-1.5" onClick={handleReload}>
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
          <Button size="sm" variant="outline" className="gap-1.5" asChild>
            <a href={model.credit.modelUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground/70">
          Model by{" "}
          <a href={model.credit.authorUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
            {model.credit.author}
          </a>{" "}
          on Sketchfab
        </p>
      </CardContent>
    </Card>
  );
};

export default ARModelCard;
