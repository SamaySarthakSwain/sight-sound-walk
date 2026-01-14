import { useState } from "react";
import { MapPin, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCity } from "@/contexts/CityContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface CityOption {
  name: string;
  fullName: string;
  lat: number;
  lng: number;
}

const odishaCities: CityOption[] = [
  { name: "Bhubaneswar", fullName: "Bhubaneswar, Odisha, India", lat: 20.2961, lng: 85.8245 },
  { name: "Puri", fullName: "Puri, Odisha, India", lat: 19.8135, lng: 85.8312 },
  { name: "Cuttack", fullName: "Cuttack, Odisha, India", lat: 20.4625, lng: 85.8830 },
  { name: "Berhampur", fullName: "Berhampur, Odisha, India", lat: 19.3150, lng: 84.7941 },
  { name: "Konark", fullName: "Konark, Odisha, India", lat: 19.8876, lng: 86.0945 },
  { name: "Rourkela", fullName: "Rourkela, Odisha, India", lat: 22.2604, lng: 84.8536 },
  { name: "Sambalpur", fullName: "Sambalpur, Odisha, India", lat: 21.4669, lng: 83.9812 },
];

const indiaCities: CityOption[] = [
  { name: "Delhi", fullName: "New Delhi, India", lat: 28.6139, lng: 77.2090 },
  { name: "Mumbai", fullName: "Mumbai, Maharashtra, India", lat: 19.0760, lng: 72.8777 },
  { name: "Kolkata", fullName: "Kolkata, West Bengal, India", lat: 22.5726, lng: 88.3639 },
  { name: "Chennai", fullName: "Chennai, Tamil Nadu, India", lat: 13.0827, lng: 80.2707 },
  { name: "Bengaluru", fullName: "Bengaluru, Karnataka, India", lat: 12.9716, lng: 77.5946 },
  { name: "Hyderabad", fullName: "Hyderabad, Telangana, India", lat: 17.3850, lng: 78.4867 },
];

interface CitySearchBoxProps {
  className?: string;
}

const CitySearchBox = ({ className }: CitySearchBoxProps) => {
  const { selectedCity, setSelectedCity } = useCity();
  const [isOpen, setIsOpen] = useState(false);

  const currentCityName = selectedCity.split(",")[0] || "Bhubaneswar";

  const handleCitySelect = (city: CityOption) => {
    setSelectedCity(city.fullName, city.lat, city.lng);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative inline-flex items-center gap-2", className)}>
      <span className="text-sm text-muted-foreground whitespace-nowrap">Exploring</span>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "h-8 px-3 text-sm border-primary/30 bg-background/80 backdrop-blur-sm",
              "hover:border-primary hover:bg-background/90",
              "focus:border-primary focus:ring-1 focus:ring-primary/50",
              "flex items-center gap-2"
            )}
          >
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span>{currentCityName}</span>
            <ChevronDown className={cn(
              "w-3.5 h-3.5 text-muted-foreground transition-transform duration-200",
              isOpen && "rotate-180"
            )} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-56 bg-background border border-border shadow-lg z-50"
          align="start"
        >
          <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
            Odisha Cities
          </DropdownMenuLabel>
          {odishaCities.map((city) => (
            <DropdownMenuItem
              key={city.name}
              onClick={() => handleCitySelect(city)}
              className={cn(
                "cursor-pointer flex items-center gap-2",
                currentCityName === city.name && "bg-primary/10 text-primary"
              )}
            >
              <MapPin className="w-3.5 h-3.5" />
              {city.name}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
            Other Indian Cities
          </DropdownMenuLabel>
          {indiaCities.map((city) => (
            <DropdownMenuItem
              key={city.name}
              onClick={() => handleCitySelect(city)}
              className={cn(
                "cursor-pointer flex items-center gap-2",
                currentCityName === city.name && "bg-primary/10 text-primary"
              )}
            >
              <MapPin className="w-3.5 h-3.5" />
              {city.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CitySearchBox;
