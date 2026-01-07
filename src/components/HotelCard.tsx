import { Star, MapPin, Phone, Wifi, Car, Dumbbell, Coffee, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Hotel } from '@/hooks/useHotels';

interface HotelCardProps {
  hotel: Hotel;
}

const amenityIcons: Record<string, React.ReactNode> = {
  'WiFi': <Wifi className="h-3 w-3" />,
  'Parking': <Car className="h-3 w-3" />,
  'Gym': <Dumbbell className="h-3 w-3" />,
  'Restaurant': <Coffee className="h-3 w-3" />,
};

export const HotelCard = ({ hotel }: HotelCardProps) => {
  const renderStars = (rating: number | null) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'
            }`}
          />
        ))}
      </div>
    );
  };

  const getAvailabilityColor = (available: number | null, total: number | null) => {
    if (!available || !total) return 'bg-muted text-muted-foreground';
    const ratio = available / total;
    if (ratio > 0.5) return 'bg-green-500/10 text-green-600 border-green-500/20';
    if (ratio > 0.2) return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
    return 'bg-red-500/10 text-red-600 border-red-500/20';
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={hotel.image_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {hotel.star_rating && (
            <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
              {hotel.star_rating} Star
            </Badge>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <Badge 
            variant="outline" 
            className={`${getAvailabilityColor(hotel.available_rooms, hotel.total_rooms)} backdrop-blur-sm`}
          >
            <Users className="h-3 w-3 mr-1" />
            {hotel.available_rooms} rooms available
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{hotel.name}</CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3" />
              {hotel.address || hotel.location}
            </CardDescription>
          </div>
          {hotel.google_rating && (
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1 text-sm font-semibold">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {hotel.google_rating}
              </div>
              <span className="text-xs text-muted-foreground">
                ({hotel.google_total_ratings?.toLocaleString()} reviews)
              </span>
            </div>
          )}
        </div>
        <div className="mt-2">{renderStars(hotel.star_rating)}</div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {hotel.description}
        </p>

        {hotel.amenities && hotel.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {hotel.amenities.slice(0, 5).map((amenity) => (
              <Badge key={amenity} variant="outline" className="text-xs">
                {amenityIcons[amenity] || null}
                <span className={amenityIcons[amenity] ? 'ml-1' : ''}>{amenity}</span>
              </Badge>
            ))}
            {hotel.amenities.length > 5 && (
              <Badge variant="outline" className="text-xs">
                +{hotel.amenities.length - 5} more
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t">
          <div>
            <p className="text-xs text-muted-foreground">Starting from</p>
            <p className="text-lg font-bold text-primary">
              ₹{hotel.price_per_night_min?.toLocaleString()}
              <span className="text-xs font-normal text-muted-foreground">/night</span>
            </p>
          </div>
          <div className="flex gap-2">
            {hotel.contact_phone && (
              <Button variant="outline" size="sm" asChild>
                <a href={`tel:${hotel.contact_phone}`}>
                  <Phone className="h-4 w-4" />
                </a>
              </Button>
            )}
            <Button size="sm">Book Now</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
