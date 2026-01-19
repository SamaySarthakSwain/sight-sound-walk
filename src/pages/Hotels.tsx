import { useState, useMemo } from 'react';
import { Building2, Search, SlidersHorizontal } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { HotelCard } from '@/components/HotelCard';
import { HotelFilters } from '@/components/HotelFilters';
import { useHotels } from '@/hooks/useHotels';
import { useCity } from '@/contexts/CityContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const Hotels = () => {
  const { hotels, loading, error } = useHotels();
  const { selectedCity } = useCity();
  const [searchQuery, setSearchQuery] = useState('');
  const [starFilter, setStarFilter] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 30000]);
  const [amenityFilter, setAmenityFilter] = useState<string[]>([]);

  const cityDisplayName = selectedCity.split(",")[0] || "Odisha";

  const maxPrice = useMemo(() => {
    return Math.max(...hotels.map((h) => h.price_per_night_max || 0), 30000);
  }, [hotels]);

  const filteredHotels = useMemo(() => {
    return hotels.filter((hotel) => {
      // Search filter
      if (
        searchQuery &&
        !hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !hotel.address?.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Star filter
      if (starFilter.length > 0 && hotel.star_rating && !starFilter.includes(hotel.star_rating)) {
        return false;
      }

      // Price filter
      if (hotel.price_per_night_min && hotel.price_per_night_min < priceRange[0]) {
        return false;
      }
      if (hotel.price_per_night_min && hotel.price_per_night_min > priceRange[1]) {
        return false;
      }

      // Amenity filter
      if (amenityFilter.length > 0) {
        const hotelAmenities = hotel.amenities || [];
        if (!amenityFilter.some((a) => hotelAmenities.includes(a))) {
          return false;
        }
      }

      return true;
    });
  }, [hotels, searchQuery, starFilter, priceRange, amenityFilter]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-20 md:pt-24 pb-8 md:py-16 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 md:gap-2 bg-primary/10 text-primary px-3 py-1.5 md:px-4 md:py-2 rounded-full mb-3 md:mb-4">
              <Building2 className="h-4 w-4 md:h-5 md:w-5" />
              <span className="text-xs md:text-sm font-medium">Hotels in {cityDisplayName}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              Find Your Perfect Stay in {cityDisplayName}
            </h1>
            <p className="text-sm md:text-lg text-muted-foreground mb-6 md:mb-8 px-2">
              Discover the best hotels in {cityDisplayName} with real Google ratings, amenities, and instant room availability
            </p>

            {/* Search Bar */}
            <div className="flex gap-2 max-w-xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search hotels by name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden">
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>
                      Narrow down your hotel search
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-4">
                    <HotelFilters
                      starFilter={starFilter}
                      setStarFilter={setStarFilter}
                      priceRange={priceRange}
                      setPriceRange={setPriceRange}
                      amenityFilter={amenityFilter}
                      setAmenityFilter={setAmenityFilter}
                      maxPrice={maxPrice}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex gap-4 md:gap-8">
            {/* Sidebar Filters - Desktop */}
            <aside className="hidden md:block w-64 lg:w-72 flex-shrink-0">
              <div className="sticky top-20 lg:top-24">
                <HotelFilters
                  starFilter={starFilter}
                  setStarFilter={setStarFilter}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  amenityFilter={amenityFilter}
                  setAmenityFilter={setAmenityFilter}
                  maxPrice={maxPrice}
                />
              </div>
            </aside>

            {/* Hotels Grid */}
            <main className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredHotels.length} of {hotels.length} hotels
                </p>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-3">
                      <Skeleton className="h-48 w-full rounded-lg" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-destructive">{error}</p>
                </div>
              ) : filteredHotels.length === 0 ? (
                <div className="text-center py-12">
                  <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No hotels found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters or search query
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredHotels.map((hotel) => (
                    <HotelCard key={hotel.id} hotel={hotel} />
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hotels;
