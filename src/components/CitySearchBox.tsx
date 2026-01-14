import { useState, useRef, useEffect } from "react";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import { MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const libraries: ("places")[] = ["places"];

interface CitySearchBoxProps {
  onCitySelect?: (city: string, lat: number, lng: number) => void;
  className?: string;
}

const CitySearchBox = ({ onCitySelect, className }: CitySearchBoxProps) => {
  const [city, setCity] = useState("Berhampur, Odisha");
  const [isFocused, setIsFocused] = useState(false);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBVVkTWwfx3NW6bFi1t7CEomwv1owCO1SI",
    libraries,
  });

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.formatted_address) {
        setCity(place.formatted_address);
        const lat = place.geometry?.location?.lat() || 0;
        const lng = place.geometry?.location?.lng() || 0;
        onCitySelect?.(place.formatted_address, lat, lng);
      } else if (place.name) {
        setCity(place.name);
        onCitySelect?.(place.name, 0, 0);
      }
    }
  };

  if (!isLoaded) {
    return (
      <div className={cn("flex items-center gap-2 text-sm text-muted-foreground", className)}>
        <MapPin className="w-4 h-4" />
        <span>Berhampur, Odisha</span>
      </div>
    );
  }

  return (
    <div className={cn("relative inline-flex items-center gap-2", className)}>
      <span className="text-sm text-muted-foreground whitespace-nowrap">Exploring</span>
      <div className={cn(
        "relative transition-all duration-300",
        isFocused ? "w-64" : "w-48"
      )}>
        <Autocomplete
          onLoad={onLoad}
          onPlaceChanged={onPlaceChanged}
          options={{
            types: ["(cities)"],
            componentRestrictions: { country: "in" },
          }}
        >
          <div className="relative">
            <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary" />
            <Input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Search city..."
              className={cn(
                "h-8 pl-8 pr-8 text-sm border-primary/30 bg-background/80 backdrop-blur-sm",
                "focus:border-primary focus:ring-1 focus:ring-primary/50",
                "placeholder:text-muted-foreground/60"
              )}
            />
            <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/60" />
          </div>
        </Autocomplete>
      </div>
    </div>
  );
};

export default CitySearchBox;
