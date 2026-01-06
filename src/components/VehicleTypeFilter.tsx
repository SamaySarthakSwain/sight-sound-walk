import { Button } from "@/components/ui/button";
import { Bike, Car } from "lucide-react";

interface VehicleTypeFilterProps {
  selectedType: string | null;
  onTypeChange: (type: string | null) => void;
}

const VehicleTypeFilter = ({ selectedType, onTypeChange }: VehicleTypeFilterProps) => {
  const vehicleTypes = [
    { type: null, label: "All", icon: null },
    { type: "2_wheeler", label: "Bike", icon: <Bike className="w-4 h-4" /> },
    { type: "3_wheeler", label: "Auto", icon: <Car className="w-4 h-4" /> },
    { type: "4_wheeler", label: "Car", icon: <Car className="w-4 h-4" /> },
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {vehicleTypes.map(({ type, label, icon }) => (
        <Button
          key={label}
          variant={selectedType === type ? "default" : "outline"}
          size="sm"
          onClick={() => onTypeChange(type)}
          className="gap-2"
        >
          {icon}
          {label}
        </Button>
      ))}
    </div>
  );
};

export default VehicleTypeFilter;
