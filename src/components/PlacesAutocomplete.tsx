import { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, Search, X, Loader2 } from "lucide-react";
import { useGoogleMaps } from "@/contexts/GoogleMapsContext";
import { cn } from "@/lib/utils";

export interface PlaceResult {
  placeId: string;
  primaryText: string;
  secondaryText: string;
  location?: { lat: number; lng: number };
  formattedAddress?: string;
}

interface Props {
  placeholder?: string;
  className?: string;
  /** Bias results toward a region (default: Odisha, India) */
  bias?: { lat: number; lng: number; radiusMeters?: number };
  onSelect: (place: PlaceResult) => void;
}

// Debounce helper
function useDebounced<T>(value: T, delay = 220) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

const DEFAULT_BIAS = { lat: 20.2961, lng: 85.8245, radiusMeters: 200_000 }; // Odisha (Bhubaneswar)

/**
 * A crystal-clear, glassy places autocomplete search box.
 * Uses Places API (New): AutocompleteSuggestion.fetchAutocompleteSuggestions()
 */
export function PlacesAutocomplete({
  placeholder = "Search monuments, cities, hotels…",
  className,
  bias = DEFAULT_BIAS,
  onSelect,
}: Props) {
  const { isLoaded } = useGoogleMaps();
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<
    Array<{ placeId: string; primary: string; secondary: string }>
  >([]);
  const [highlight, setHighlight] = useState(0);
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounced = useDebounced(input, 220);

  // Close on outside click
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // Fetch predictions
  useEffect(() => {
    if (!isLoaded || !debounced.trim() || debounced.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const placesLib = (await google.maps.importLibrary(
          "places"
        )) as google.maps.PlacesLibrary;
        const { AutocompleteSuggestion, AutocompleteSessionToken } = placesLib;
        if (!sessionTokenRef.current) {
          sessionTokenRef.current = new AutocompleteSessionToken();
        }

        const { suggestions: raw } =
          await AutocompleteSuggestion.fetchAutocompleteSuggestions({
            input: debounced,
            sessionToken: sessionTokenRef.current,
            locationBias: {
              center: { lat: bias.lat, lng: bias.lng },
              radius: bias.radiusMeters ?? 200_000,
            },
            includedRegionCodes: ["in"],
          });

        if (cancelled) return;

        const parsed = (raw || [])
          .map((s) => s.placePrediction)
          .filter((p): p is google.maps.places.PlacePrediction => !!p)
          .map((p) => ({
            placeId: p.placeId,
            primary: p.mainText?.text ?? p.text?.text ?? "",
            secondary: p.secondaryText?.text ?? "",
          }));
        setSuggestions(parsed);
        setHighlight(0);
      } catch (err) {
        console.warn("[PlacesAutocomplete] failed", err);
        if (!cancelled) setSuggestions([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [debounced, isLoaded, bias.lat, bias.lng, bias.radiusMeters]);

  const handleSelect = async (idx: number) => {
    const s = suggestions[idx];
    if (!s) return;
    setInput(s.primary);
    setOpen(false);
    try {
      const placesLib = (await google.maps.importLibrary(
        "places"
      )) as google.maps.PlacesLibrary;
      const place = new placesLib.Place({ id: s.placeId });
      await place.fetchFields({
        fields: ["location", "formattedAddress", "displayName"],
      });
      const loc = place.location;
      onSelect({
        placeId: s.placeId,
        primaryText: s.primary,
        secondaryText: s.secondary,
        location: loc ? { lat: loc.lat(), lng: loc.lng() } : undefined,
        formattedAddress: place.formattedAddress ?? undefined,
      });
      sessionTokenRef.current = null; // end session after a selection
    } catch (err) {
      console.warn("[PlacesAutocomplete] place details failed", err);
      onSelect({
        placeId: s.placeId,
        primaryText: s.primary,
        secondaryText: s.secondary,
      });
    }
  };

  const showDropdown = useMemo(
    () => open && (loading || suggestions.length > 0 || (input.length >= 2 && !loading)),
    [open, loading, suggestions.length, input]
  );

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div
        className={cn(
          "group relative flex items-center gap-3 rounded-2xl border border-white/10",
          "bg-white/5 backdrop-blur-xl px-4 py-3 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)]",
          "transition-all duration-300",
          "focus-within:border-primary/50 focus-within:bg-white/[0.07]",
          "focus-within:shadow-[0_0_0_4px_hsl(var(--primary)/0.15),0_12px_40px_-12px_hsl(var(--primary)/0.4)]"
        )}
      >
        <Search className="w-5 h-5 text-primary/80 shrink-0 transition-transform group-focus-within:scale-110" />
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (!showDropdown) return;
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setHighlight((h) => Math.min(h + 1, suggestions.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setHighlight((h) => Math.max(h - 1, 0));
            } else if (e.key === "Enter") {
              e.preventDefault();
              handleSelect(highlight);
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground/70 text-[15px]"
          aria-label="Search places"
          aria-autocomplete="list"
          aria-expanded={showDropdown}
        />
        {loading && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
        {input && !loading && (
          <button
            type="button"
            onClick={() => {
              setInput("");
              setSuggestions([]);
            }}
            className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-white/10 transition"
            aria-label="Clear"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {showDropdown && (
        <div
          className={cn(
            "absolute z-50 left-0 right-0 mt-2 overflow-hidden",
            "rounded-2xl border border-white/10 bg-background/90 backdrop-blur-2xl",
            "shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)]",
            "animate-in fade-in-0 slide-in-from-top-2 duration-200"
          )}
          role="listbox"
        >
          {suggestions.length === 0 && !loading ? (
            <div className="px-4 py-6 text-sm text-muted-foreground text-center">
              No matching places found
            </div>
          ) : (
            <ul className="max-h-80 overflow-y-auto py-1">
              {suggestions.map((s, i) => (
                <li key={s.placeId}>
                  <button
                    type="button"
                    onMouseEnter={() => setHighlight(i)}
                    onClick={() => handleSelect(i)}
                    className={cn(
                      "w-full text-left px-4 py-3 flex items-start gap-3 transition-colors",
                      i === highlight
                        ? "bg-primary/15 text-foreground"
                        : "hover:bg-white/5 text-foreground/90"
                    )}
                    role="option"
                    aria-selected={i === highlight}
                  >
                    <div
                      className={cn(
                        "mt-0.5 p-1.5 rounded-lg shrink-0 transition-colors",
                        i === highlight
                          ? "bg-primary/25 text-primary"
                          : "bg-white/5 text-primary/80"
                      )}
                    >
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{s.primary}</div>
                      {s.secondary && (
                        <div className="text-xs text-muted-foreground truncate mt-0.5">
                          {s.secondary}
                        </div>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default PlacesAutocomplete;
