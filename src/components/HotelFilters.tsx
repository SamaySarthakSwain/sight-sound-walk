import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

interface HotelFiltersProps {
  starFilter: number[];
  setStarFilter: (stars: number[]) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  amenityFilter: string[];
  setAmenityFilter: (amenities: string[]) => void;
  maxPrice: number;
}

const amenities = ['Pool', 'Spa', 'Restaurant', 'WiFi', 'Gym', 'Bar', 'Parking', 'Room Service'];

export const HotelFilters = ({
  starFilter,
  setStarFilter,
  priceRange,
  setPriceRange,
  amenityFilter,
  setAmenityFilter,
  maxPrice,
}: HotelFiltersProps) => {
  const toggleStar = (star: number) => {
    if (starFilter.includes(star)) {
      setStarFilter(starFilter.filter((s) => s !== star));
    } else {
      setStarFilter([...starFilter, star]);
    }
  };

  const toggleAmenity = (amenity: string) => {
    if (amenityFilter.includes(amenity)) {
      setAmenityFilter(amenityFilter.filter((a) => a !== amenity));
    } else {
      setAmenityFilter([...amenityFilter, amenity]);
    }
  };

  return (
    <Card className="glass-card border-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Star Rating Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Star Rating</Label>
          <div className="flex flex-wrap gap-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <Button
                key={star}
                variant={starFilter.includes(star) ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleStar(star)}
                className="flex items-center gap-1"
              >
                {star} <Star className="h-3 w-3 fill-current" />
              </Button>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Price Range: ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
          </Label>
          <Slider
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            max={maxPrice}
            min={0}
            step={500}
            className="w-full"
          />
        </div>

        {/* Amenities Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Amenities</Label>
          <div className="grid grid-cols-2 gap-2">
            {amenities.map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={amenity}
                  checked={amenityFilter.includes(amenity)}
                  onCheckedChange={() => toggleAmenity(amenity)}
                />
                <label
                  htmlFor={amenity}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {amenity}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Clear Filters */}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            setStarFilter([]);
            setPriceRange([0, maxPrice]);
            setAmenityFilter([]);
          }}
        >
          Clear All Filters
        </Button>
      </CardContent>
    </Card>
  );
};
