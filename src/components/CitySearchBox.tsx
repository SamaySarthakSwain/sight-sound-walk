import { useState, useRef } from "react";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import { MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useCity } from "@/contexts/CityContext";

const libraries: ("places")[] = ["places"];

interface CitySearchBoxProps {
  className?: string;
}

const CitySearchBox = ({ className }: CitySearchBoxProps) => {
  const { selectedCity, setSelectedCity } = useCity();
  const [inputValue, setInputValue] = useState(selectedCity.split(",")[0] || "Bhubaneswar");
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
        const cityName = place.formatted_address;
        setInputValue(place.name || cityName.split(",")[0]);
        const lat = place.geometry?.location?.lat() || 0;
        const lng = place.geometry?.location?.lng() || 0;
        setSelectedCity(cityName, lat, lng);
      } else if (place.name) {
        setInputValue(place.name);
        setSelectedCity(place.name, 0, 0);
      }
    }
  };

  if (!isLoaded) {
    return (
      <div className={cn("flex items-center gap-2 text-sm text-muted-foreground", className)}>
        <MapPin className="w-4 h-4" />
        <span>Bhubaneswar, Odisha</span>
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
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
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
